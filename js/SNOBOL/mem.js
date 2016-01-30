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

SNOBOL.SymbolTable = function () {};
SNOBOL.SymbolTable.prototype = {};

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

VM.prototype.alloc = function ( size ) {
    var i, ptr = this.mem.length;

    for ( i = 0; i < size; i++ ) {
        this.mem.push( 0 );
    }

    return ptr;
};

VM.prototype.$ = VM.prototype.resolve = function ( key ) {
    if ( this.symbols[ key ] === undefined ) {
        throw new ReferenceError( key );
    }
    return this.symbols[ key ];
};


VM.prototype.reset = function () {
    this.instructionPointer = null;
    this.symbols = new SNOBOL.SymbolTable();
    this.mem = [];
    this.callbacks = [];
    this.units = {};
    this.indent = 0;

    // this.alloc( this.STSIZE * 3 );
    this.alloc( 9000 );
    this.CSTACK = this.d( 'CSTACK' );
    this.OSTACK = this.d( 'OSTACK' );
    this.STACK  = this.$( 'STACK' );

    SNOBOL.sil.ISTACK.call( this );
};
