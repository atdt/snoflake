"use strict";

var SNOBOL = require( './base' ),
    assert = require( 'assert' ),
    VM = SNOBOL.VM;

var buf = new ArrayBuffer( 4 ),
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

function typedGetter( typedArray ) {
    return function ( ptr ) {
        u32.fill( 0 );
        u32[ 0 ] = this.mem[ ptr ];
        return typedArray[ 0 ];
    };
}

function typedSetter( typedArray ) {
    var typeName = /(\w+)Array/.exec( typedArray.constructor )[1];
    return function ( ptr, value ) {
        u32.fill( 0 );
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
    var i, ptr = this.mem.length;

    if ( typeof value === 'undefined' ) {
        value = 0;
    }

    for ( i = 0; i < size; i++ ) {
        this.mem.push( value );
    }

    return ptr;
};

VM.prototype.specify = function ( str, $SPEC ) {
    var SPEC = this.s( $SPEC ), encodedString = SNOBOL.str.encode( str );
    SPEC.update( this.mem.length, 0, 0, 0, encodedString.length );
    this.mem.push.apply( this.mem, encodedString );
    return SPEC.ptr;
}

// Convenience function for allocating a pointer, pointing to addr.
VM.prototype.ptr = function ( addr ) {
    return this.alloc( 1, addr );
}

SNOBOL.VM.prototype.define = function ( symbol, value ) {
    if ( symbol === 'DESCR' && value !== 3 ) {
        throw new Error(`symbol=${symbol}, value=${value}`);
    }
    if ( typeof value === 'string' ) {
        this.symbols[ symbol ] = this.mem.length;
        for ( var i = 0; i < value.length; i++ ) {
            this.mem.push( value.charCodeAt( i ) );
        }
    } else {
        this.symbols[ symbol ] = value;
    }
}

VM.prototype.$ = VM.prototype.resolve = function ( key ) {
    var val = this.symbols[ key ];

    if ( val === undefined ) {
        throw new ReferenceError( key );
    }

    return val;
};


VM.prototype.reset = function () {
    this.instructionPointer = null;
    this.symbols = {};
    this.mem = [];
    this.callbacks = [];
    this.units = {};

    this.define( 'CSTACK', this.d().ptr );
    this.define( 'OSTACK', this.d().ptr );
    this.define( 'STACK', this.alloc( 3 * 1000 ) );

    this.CSTACK = this.d( this.symbols.CSTACK );
    this.OSTACK = this.d( this.symbols.OSTACK );

    SNOBOL.sil.ISTACK.call( this );
};
