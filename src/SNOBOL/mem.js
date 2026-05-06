"use strict";

import SNOBOL from './base.js';
const VM = SNOBOL.VM;

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

function typedGetter( typedArray ) {
    return function ( ptr ) {
        u32[ 0 ] = this.mem[ ptr ];
        return typedArray[ 0 ];
    };
}

function typedSetter( typedArray ) {
    const typeName = /(\w+)Array/.exec( typedArray.constructor )[1];
    return function ( ptr, value ) {
        typedArray[ 0 ] = value;
        if ( !nearlyEqual( typedArray[ 0 ], value ) ) {
            throw new RangeError( 'Invalid ' + typeName + ': ' + JSON.stringify( value ) );
        }
        this.mem[ ptr ] = u32[ 0 ];
    };
}

VM.prototype.getUint = typedGetter( u32 );
VM.prototype.setUint = typedSetter( u32 );

VM.prototype.getInt  = typedGetter( i32 );
VM.prototype.setInt  = typedSetter( i32 );

VM.prototype.getReal = typedGetter( f32 );
VM.prototype.setReal = typedSetter( f32 );

VM.prototype.alloc = function ( size, value ) {
    const ptr = this.mem.length;

    if ( typeof value === 'undefined' ) {
        value = 0;
    }

    for ( let i = 0; i < size; i++ ) {
        this.mem.push( value );
    }

    return ptr;
};

VM.prototype.specify = function ( str, $SPEC ) {
    const SPEC = this.s( $SPEC ), encodedString = SNOBOL.str.encode( str );
    SPEC.update( this.mem.length, 0, 0, 0, encodedString.length );
    this.mem.push( ...encodedString );
    return SPEC.ptr;
}

VM.prototype.define = function ( symbol, value ) {
    if ( symbol === 'DESCR' && value !== 3 ) {
        throw new Error(`symbol=${symbol}, value=${value}`);
    }
    if ( typeof value === 'string' ) {
        this.symbols[ symbol ] = this.mem.length;
        for ( let i = 0; i < value.length; i++ ) {
            this.mem.push( value.charCodeAt( i ) );
        }
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
