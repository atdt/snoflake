/*jslint node: true, forin: true, undef:true, white:true, plusplus:true, vars:true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array, str */

"use strict";

var DEBUG = true;

var Snoflake = require( './base' ),
    VM = Snoflake.VM,
    str = Snoflake.str,
    push = Array.prototype.push;

var buf = new ArrayBuffer( 4 ),
    f32 = new Float32Array( buf ),
    i32 = new Int32Array( buf ),
    u32 = new Uint32Array( buf );

// var mem = [], symbols = {};

Snoflake.SymbolTable = function () {};
Snoflake.SymbolTable.prototype = {};

global.symbols = new Snoflake.SymbolTable;

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
}

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

VM.prototype.puts = function ( s ) {
    var ptr = this.mem.length,
        encoded = str.encode( s );
    Array.prototype.push.apply( this.mem, encoded );
    return { start: ptr, stop: this.mem.length };
};

VM.prototype.gets = function ( start, stop ) {
    var encoded = this.mem.slice( start, stop );
    return str.decode( encoded );
};

VM.prototype.reset = function ( start, stop ) {
    this.mem = [];
    this.symbols = new Snoflake.SymbolTable;
    this.alloc( this.stack.size * 3 );
    this.stack.ptr = 0;
    this.stack.old = 0;
}

function getterSetter( symbol, extra ) {
    var property = {
        get: resolve.bind( null, symbol ),
        set: assign.bind( null, symbol )
    };
    if ( extra !== undefined ) {
        Object.keys( extra ).forEach( function ( k ) {
            property[k] = extra[k];
        } );
    }
    return property;
}

var stack = Object.create( {}, {
    old  : getterSetter( 'OSTACK' ),
    ptr  : getterSetter( 'CSTACK' ),
    size : { value: 1024, writable: DEBUG },
} );

stack.trace = function () {
    return mem.slice( 0, stack.size );
};

stack.push = function ( ar ) {
    if ( ar.length + stack.ptr > stack.size )  {
        throw new RangeError( 'Stack overflow' );
    }

    stack.old = stack.ptr;

    for ( var i = 0; i < ar.length; i++ ) {
        mem[ stack.ptr++ ] = ar[ i ];
    }

    return stack.ptr;
};

stack.pop = function ( len ) {
    len = len || 1;
    stack.old = stack.ptr;
    stack.ptr = stack.ptr - len;

    if ( stack.ptr < 0 ) {
        throw new RangeError( 'Stack underflow' );
    }

    return mem.slice( stack.ptr, stack.old );
};

reset();
