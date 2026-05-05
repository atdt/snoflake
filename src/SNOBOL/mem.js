"use strict";

import SNOBOL from './base.js';
const VM = SNOBOL.VM;

const buf = new ArrayBuffer( 4 ),
      f32 = new Float32Array( buf ),
      i32 = new Int32Array( buf ),
      u32 = new Uint32Array( buf );


SNOBOL.isInt32 = function isInteger( v ) {
    i32[0] = v;
    return i32[0] === v;
};

function nearlyEqual( a, b ) {
    return a === b || Math.abs( a - b ) < 0.001;
}

// Tests whether v survives the round-trip through 32-bit IEEE 754, using the
// same tolerance as the typed setter so callers and setters agree on what
// counts as overflow. Real-arithmetic SIL macros use this to branch to FLOC
// before the assignment, instead of catching the setter's RangeError.
SNOBOL.isFloat32 = function isFloat32( v ) {
    f32[0] = v;
    return nearlyEqual( f32[0], v );
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

// Convenience function for allocating a pointer, pointing to addr.
VM.prototype.ptr = function ( addr ) {
    return this.alloc( 1, addr );
}

VM.prototype.define = function ( symbol, value ) {
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

    // STREAM table indicators are SIL macro constants, not labels.  The
    // translator currently represents all bare operands as vm.$(...), so keep
    // these documented CLERTB/PLUGTB KEY values as literal control actions.
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
