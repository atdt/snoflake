/*jslint white: true, vars: true, plusplus: true, forin: true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array */

"use strict";

var Snoflake = require( './base' );

// We store all data as unsigned 32-bit integers and use ES5's ArrayBuffer
// interface to handle conversion to and from additional datatypes.

var mem = [],
    buf = new ArrayBuffer( 4 ),
    f32 = new Float32Array( buf ),
    i32 = new Int32Array( buf ),
    u32 = new Uint32Array( buf ),
    abs = Math.abs;

mem.getUint = function( ptr ) {
    return mem[ ptr ];
};

mem.setUint = function( ptr, value ) {
    u32[ 0 ] = value;
    if ( u32[ 0 ] !== value ) {
        throw new RangeError( 'Invalid unsigned integer ' + value );
    }
    mem[ ptr ] = u32[ 0 ];
};

// Signed integers

mem.getInt = function( ptr ) {
    u32[ 0 ] = mem[ ptr ];
    return i32[ 0 ];
};

mem.setInt = function( ptr, value ) {
    i32[ 0 ] = value;
    if ( i32[ 0 ] !== value ) {
        throw new RangeError( 'Invalid integer ' + value );
    }
    mem[ ptr ] = u32[ 0 ];
};

// Real numbers (binary32)

mem.getReal = function( ptr ) {
    u32[ 0 ] = mem[ ptr ];
    return f32[ 0 ];
};

mem.setReal = function( ptr, value ) {
    f32[ 0 ] = value;

    if ( abs(f32[ 0 ] - value) > 1 ) {
        throw new RangeError( 'Invalid real ' + value );
    }
    mem[ ptr ] = u32[ 0 ];
};

mem.alloc = function ( size ) {
    var ptr = mem.length;
    while ( size-- ) {
        mem.push(0);
    }
    return ptr;
};

mem.reset = function () {
    mem.splice( 0, mem.length );
    mem.symbols = {};
};

mem.symbols = {};

mem.resolve = function ( key ) {
    if ( typeof key === 'number' ) {
        return key;
    }

    var ptr = this.symbols[ key ];

    if ( ptr === undefined ) {
        throw new ReferenceError( key );
    }
    return ptr;
};

mem.assign = function ( assignee, value ) {
    if ( typeof assignee !== 'object' ) {
        mem.symbols[ assignee ] = value.ptr || value;
    } else {
        for ( var key in assignee ) {
            value = assignee[ key ];
            mem.symbols[ key ] = value.ptr || value;
        }
    }
};

Snoflake.mem = mem;    
