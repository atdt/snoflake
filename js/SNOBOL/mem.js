/*jslint node: true, forin: true, undef:true, white:true, plusplus:true, vars:true */

"use strict";

var SNOBOL = require( './base' ),
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
    return function ( ptr, value ) {
        u32.fill( 0 );
        typedArray[ 0 ] = value;
        if ( !nearlyEqual( typedArray[ 0 ], value ) ) {
            throw new RangeError( 'typedArray[0]:' + JSON.stringify( typedArray[0] ) + ' value:' + JSON.stringify( value ) );
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
    var ptr = this.mem.length;
    while ( size-- ) {
        this.mem.push(0);
    }
    return ptr;
};

VM.prototype.recent = [];

VM.prototype.resolve = function ( key ) {
    if ( typeof key === 'number' ) {
        return key;
    }

    if ( typeof key.addr === 'number' ) {
        return key;
    }

    this.recent.push( key );
    var ptr = this.symbols[ key ];
    if ( ptr === 'DESCR' ) {
        console.log( ptr );
    }

    if ( ptr === undefined ) {
        throw new ReferenceError( key );
    }

    return ptr;
};


VM.prototype.assign = function ( assignee, value ) {
    if ( typeof assignee !== 'object' ) {
        this.symbols[ assignee ] = value.ptr || value;
    } else {
        for ( var key in assignee ) {
            value = assignee[ key ];
            this.symbols[ key ] = value.ptr || value;
        }
    }
};

VM.prototype.$ = function ( key, value ) {
    return value !== undefined
        ? this.assign( key, value )
        : this.resolve( key );
}

VM.prototype.puts = function ( str ) {
    var spec = this.s(),
        encoded = SNOBOL.str.encode( str );

    spec.addr = this.mem.length,
    spec.length = encoded.length;
    this.mem.push.apply( this.mem, encoded );

    return spec;
};

VM.prototype.gets = function ( start, stop ) {
    var encoded = this.mem.slice( start, stop );
    return SNOBOL.str.decode( encoded );
};

VM.prototype.reset = function () {
    this.instructionPointer = null;
    this.symbols = new SNOBOL.SymbolTable();
    this.mem = [];
    this.callbacks = [];
    this.units = {};
    this.indent = 0;

    this.alloc( this.STSIZE * 3 );
    this.CSTACK = this.d( 'CSTACK' );
    this.OSTACK = this.d( 'OSTACK' );
    this.STACK  = this.$( 'STACK' );

    SNOBOL.sil.ISTACK.call( this );
};
