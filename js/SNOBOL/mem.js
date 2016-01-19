/*jslint node: true, forin: true, undef:true, white:true, plusplus:true, vars:true */

"use strict";

var SNOBOL = require( './base' ),
    VM = SNOBOL.VM;

var buf = new ArrayBuffer( 4 ),
    f32 = new Float32Array( buf ),
    i32 = new Int32Array( buf ),
    u32 = new Uint32Array( buf );

SNOBOL.SymbolTable = function () {};
SNOBOL.SymbolTable.prototype = {};

function nearlyEqual( a, b ) {
    return a === b || Math.abs( a - b ) < 0.001;
}

function typedGetter( typeArray ) {
    return function ( ptr ) {
        u32[ 0 ] = this.mem[ ptr ];
        return typeArray[ 0 ];
    };
}

function typedSetter( typeArray ) {
    return function ( ptr, value ) {
        typeArray[ 0 ] = value;
        if ( !nearlyEqual( typeArray[ 0 ], value ) ) {
            throw new RangeError( value );
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

VM.prototype.resolve = function ( key ) {
    if ( typeof key === 'number' ) {
        return key;
    }

    var ptr = this.symbols[ key ];

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

VM.prototype.puts = function ( s ) {
    var ptr = this.mem.length,
        encoded = SNOBOL.str.encode( s );
    Array.prototype.push.apply( this.mem, encoded );
    return { start: ptr, stop: this.mem.length };
};

VM.prototype.gets = function ( start, stop ) {
    var encoded = this.mem.slice( start, stop );
    return SNOBOL.str.decode( encoded );
};

VM.prototype.reset = function () {
    var STACK_SIZE = 6 << 14;

    this.mem = [];
    this.symbols = new SNOBOL.SymbolTable();
    this.alloc( STACK_SIZE );
    SNOBOL.sil.ISTACK.call( this );
};
