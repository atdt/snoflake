/*jslint node: true, forin: true, undef:true, white:true, plusplus:true, vars:true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array, str */

"use strict";

var Snoflake = require( './base' ),
    str = Snoflake.str,
    push = Array.prototype.push;

var STACKSIZE = 1024;

var buf = new ArrayBuffer( 4 ),
    f32 = new Float32Array( buf ),
    i32 = new Int32Array( buf ),
    u32 = new Uint32Array( buf );

// var mem = [], symbols = {};

global.mem = [];
global.symbols = {};

function getUint( ptr ) {
    return mem[ ptr ];
}

function setUint( ptr, value ) {
    u32[ 0 ] = value;
    if ( u32[ 0 ] !== value ) {
        throw new RangeError( 'Invalid unsigned integer ' + value );
    }
    mem[ ptr ] = u32[ 0 ];
}

function getInt( ptr ) {
    u32[ 0 ] = mem[ ptr ];
    return i32[ 0 ];
}

function setInt( ptr, value ) {
    i32[ 0 ] = value;
    if ( i32[ 0 ] !== value ) {
        throw new RangeError( 'Invalid integer ' + value );
    }
    mem[ ptr ] = u32[ 0 ];
}

function getReal( ptr ) {
    u32[ 0 ] = mem[ ptr ];
    return f32[ 0 ];
}

function setReal( ptr, value ) {
    f32[ 0 ] = value;

    if ( Math.abs(f32[ 0 ] - value) > 1 ) {
        throw new RangeError( 'Invalid real ' + value );
    }
    mem[ ptr ] = u32[ 0 ];
}

function alloc( size ) {
    var ptr = mem.length;
    while ( size-- ) {
        mem.push(0);
    }
    return ptr;
}

function resolve( key ) {
    if ( typeof key === 'number' ) {
        return key;
    }

    var ptr = symbols[ key ];

    if ( ptr === undefined ) {
        throw new ReferenceError( key );
    }
    return ptr;
}

function assign( assignee, value ) {
    if ( typeof assignee !== 'object' ) {
        symbols[ assignee ] = value.ptr || value;
    } else {
        for ( var key in assignee ) {
            value = assignee[ key ];
            symbols[ key ] = value.ptr || value;
        }
    }
}

function puts( s ) {
    var ptr = mem.length;
    push.apply( mem, str.encode( s ) );
    return ptr;
}

function gets( start, stop ) {
    var encoded = mem.slice( start, stop );
    return str.decode( encoded );
}

function reset() {
    global.mem = [];
    global.symbols = {};
    alloc( STACKSIZE * 3 );
}

reset();

Snoflake.extend( {
    mem     : mem,
    alloc   : alloc,
    assign  : assign,
    getInt  : getInt,
    getReal : getReal,
    getUint : getUint,
    gets    : gets,
    puts    : puts,
    reset   : reset,
    resolve : resolve,
    setInt  : setInt,
    setReal : setReal,
    setUint : setUint,
    symbols : symbols
} );
