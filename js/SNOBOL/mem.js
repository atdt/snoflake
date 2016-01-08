/*jslint node: true, forin: true, undef:true, white:true, plusplus:true, vars:true */

"use strict";

var SNOBOL = require( './base' ),
    VM = SNOBOL.VM;

var buf = new ArrayBuffer( 4 ),
    f32 = new Float32Array( buf ),
    i32 = new Int32Array( buf ),
    u32 = new Uint32Array( buf );

// var mem = [], symbols = {};

SNOBOL.SymbolTable = function () {};
SNOBOL.SymbolTable.prototype = {};

global.symbols = new SNOBOL.SymbolTable();

VM.prototype.getUint = function ( ptr ) {
    return this.mem[ ptr ];
};

VM.prototype.setUint = function ( ptr, value ) {
    u32[ 0 ] = value;
    if ( u32[ 0 ] !== value ) {
        throw new RangeError( 'Invalid unsigned integer ' + value );
    }
    this.mem[ ptr ] = u32[ 0 ];
};

VM.prototype.getInt = function ( ptr ) {
    u32[ 0 ] = this.mem[ ptr ];
    return i32[ 0 ];
};

VM.prototype.setInt = function ( ptr, value ) {
    i32[ 0 ] = value;
    if ( i32[ 0 ] !== value ) {
        throw new RangeError( 'Invalid integer ' + value );
    }
    this.mem[ ptr ] = u32[ 0 ];
};

VM.prototype.getReal = function ( ptr ) {
    u32[ 0 ] = this.mem[ ptr ];
    return f32[ 0 ];
};

VM.prototype.setReal = function ( ptr, value ) {
    f32[ 0 ] = value;

    if ( Math.abs(f32[ 0 ] - value) > 1 ) {
        throw new RangeError( 'Invalid real ' + value );
    }
    this.mem[ ptr ] = u32[ 0 ];
};

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
    var STACK = 1024;

    this.mem = [];
    this.symbols = new SNOBOL.SymbolTable();
    this.alloc( STACK );
    this.$( 'STACK', STACK );
    this.$( 'CSTACK', 0 );
    this.$( 'OSTACK', 0 );
};
