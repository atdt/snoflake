/*jslint node: true, forin: true, undef:true, white:true, plusplus:true, vars:true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array, str */

"use strict";

var DEBUG = true;

var Snoflake = require( './base' ),
    str = Snoflake.str,
    push = Array.prototype.push;

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
    var ptr = mem.length, encoded = str.encode( s );
    push.apply( mem, encoded );
    return { start: ptr, stop: mem.length };
}

function gets( start, stop ) {
    var encoded = mem.slice( start, stop );
    return str.decode( encoded );
}

function reset() {
    global.mem = [];
    global.symbols = {};
    alloc( stack.size * 3 );
    stack.ptr = 0;
    stack.old = 0;
}

function getterSetter( symbol, extra ) {
    var property = {
        get: resolve.bind( null, symbol ),
        set: assign.bind( null, symbol )
    };
    if ( extra !== undefined ) {
        Object.extend( property, extra );
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
        throw new RangeError( 'Stack overflow' );  // always wanted to say that :)
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

Snoflake.extend( Snoflake, {
    mem     : mem,
    alloc   : alloc,
    assign  : assign,
    getterSetter: getterSetter,
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
    stack   : stack,
    symbols : symbols
} );
