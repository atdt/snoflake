"use strict";

import SNOBOL from './base.js';
const VM = SNOBOL.VM;

const WORD_SIZE = Uint32Array.BYTES_PER_ELEMENT,
      INITIAL_WORDS = 1024 * 1024,
      MAX_WORDS = 256 * 1024 * 1024;

const buf = new ArrayBuffer( 4 ),
      f32 = new Float32Array( buf ),
      i32 = new Int32Array( buf ),
      u32 = new Uint32Array( buf );


SNOBOL.isInt32 = function isInteger( value ) {
    i32[0] = value;
    return i32[0] === value;
};

function nearlyEqual( a, b ) {
    return a === b || Math.abs( a - b ) < 0.001;
}

// Tests whether v survives the round-trip through 32-bit IEEE 754, using the
// same tolerance as the typed setter so callers and setters agree on what
// counts as overflow.
SNOBOL.isFloat32 = function isFloat32( value ) {
    f32[0] = value;
    return nearlyEqual( f32[0], value );
};

function wordsToBytes( words ) {
    return words * WORD_SIZE;
}

VM.prototype.getUint = function ( ptr ) {
    return this.mem[ ptr ];
};

VM.prototype.setUint = function ( ptr, value ) {
    u32[ 0 ] = value;
    if ( u32[ 0 ] !== value ) {
        throw new RangeError( 'Invalid Uint32: ' + JSON.stringify( value ) );
    }
    this.mem[ ptr ] = u32[ 0 ];
};

VM.prototype.getInt = function ( ptr ) {
    return this.i32[ ptr ];
};

VM.prototype.setInt = function ( ptr, value ) {
    i32[ 0 ] = value;
    if ( i32[ 0 ] !== value ) {
        throw new RangeError( 'Invalid Int32: ' + JSON.stringify( value ) );
    }
    this.i32[ ptr ] = i32[ 0 ];
};

VM.prototype.getReal = function ( ptr ) {
    return this.f32[ ptr ];
};

VM.prototype.setReal = function ( ptr, value ) {
    f32[ 0 ] = value;
    if ( !nearlyEqual( f32[ 0 ], value ) ) {
        throw new RangeError( 'Invalid Float32: ' + JSON.stringify( value ) );
    }
    this.f32[ ptr ] = f32[ 0 ];
};

// SIL storage is word-addressed. These length-tracking views share one
// resizable buffer so a field can be read as unsigned, signed, or float.
VM.prototype.refreshMemoryViews = function () {
    this.mem = new Uint32Array( this.buffer );
    this.i32 = new Int32Array( this.buffer );
    this.f32 = new Float32Array( this.buffer );
};

// Grow capacity only. this.memPtr remains the logical end of assembled memory.
VM.prototype.grow = function ( minWords ) {
    let words = this.mem.length * 2;
    while ( words < minWords ) {
        words *= 2;
    }

    this.buffer.resize( wordsToBytes( words ) );
};

VM.prototype.resetMemory = function () {
    this.memPtr = 0;
    this.buffer = new ArrayBuffer( wordsToBytes( INITIAL_WORDS ), {
        maxByteLength: wordsToBytes( MAX_WORDS )
    } );
    this.refreshMemoryViews();
};

// Allocate zero-filled words from the logical frontier, not from typed-array
// length. mem.length is capacity and may be much larger than initialized data.
VM.prototype.alloc = function ( size, value = 0 ) {
    if ( this.memPtr + size > this.mem.length ) {
        this.grow( this.memPtr + size );
    }

    const ptr = this.memPtr;

    if ( value !== 0 ) {
        this.mem.fill( value, ptr, ptr + size );
    }

    this.memPtr += size;
    return ptr;
};

VM.prototype.specify = function ( str, $SPEC ) {
    const SPEC = this.s( $SPEC ), encodedString = SNOBOL.str.encode( str );
    const ptr = this.alloc( encodedString.length );
    SPEC.update( ptr, 0, 0, 0, str.toString().length );
    this.mem.set( encodedString, ptr );
    return SPEC.ptr;
}

VM.prototype.define = function ( symbol, value ) {
    if ( typeof value === 'string' ) {
        const ptr = this.alloc( value.length ),
              encoded = SNOBOL.str.encode( value );
        this.symbols[ symbol ] = ptr;
        this.mem.set( encoded.subarray( 0, value.length ), ptr );
    } else {
        this.symbols[ symbol ] = value;
    }
}

VM.prototype.$ = VM.prototype.resolve = function ( key ) {
    const val = this.symbols[ key ];

    if ( val !== undefined ) {
        return val;
    }

    // These four names are STREAM's indicator values, not symbols.
    // The name itself is the value: STREAM stores it in a table entry
    // and later switches on the string.
    if ( key === 'CONTIN' || key === 'ERROR' || key === 'STOP' || key === 'STOPSH' ) {
        return key;
    }

    // Fallback to programSymbols to support direct macro testing
    // without running the generated SIL to bind symbols into memory.
    if ( SNOBOL.programSymbols && Object.hasOwn( SNOBOL.programSymbols, key ) ) {
        return SNOBOL.programSymbols[ key ];
    }

    throw new ReferenceError( key );
};
