/*jslint passfail: false, indent: 4, undef:true, white:true, plusplus:true, vars:true */
/*globals mem, alloc, assign, resolve, getInt, setInt, getReal, setReal, getUint, setUint */

"use strict";

var Snoflake = require( './base' ),
    alloc   = Snoflake.alloc,
    assign  = Snoflake.assign,
    getInt  = Snoflake.getInt,
    getReal = Snoflake.getReal,
    getUint = Snoflake.getUint,
    gets    = Snoflake.gets,
    puts    = Snoflake.puts,
    resolve = Snoflake.resolve,
    setInt  = Snoflake.setInt,
    setReal = Snoflake.setReal,
    setUint = Snoflake.setUint;


function Descriptor( ptr ) {
    if ( ptr === undefined ) {
        ptr = alloc( this.width );
    } else if ( typeof ptr === 'string' ) {
        ptr = resolve( ptr );
    }
    Object.defineProperty( this, 'ptr', ptr );
    Object.freeze( this );
}

function Specifier( ptr ) {
    Descriptor.call( this, ptr );
}

var datum = Object.create( {}, {
    
    constructor : { value : Descriptor },
    width       : { value : 3 },

    addr: {
        enumerable: true,
        get: function () { return getInt( this.ptr ); },
        set: function ( n ) { setInt( this.ptr, n ); }
    },

    raddr: {
        enumerable: true,
        get: function () { return getReal( this.ptr ); },
        set: function ( n ) { setReal( this.ptr, n ); }
    },

    flags: {
        enumerable: true,
        get: function () { return getUint( this.ptr + 1 ); },
        set: function ( n ) { setUint( this.ptr + 1, n ); }
    },

    value: {
        enumerable: true,
        get: function () { return getUint( this.ptr + 2 ); },
        set: function ( n ) { setUint( this.ptr + 2, n ); }
    }

} );

// Test two instances for equality
datum.eq = function ( other ) {
    if ( !( this.width ) || this.width !== other.width ) {
        return false;
    }
    for ( var i = 0; i < this.width; i++ ) {
        if ( mem[ this.ptr + i ] !== mem[ other.ptr + i ] ) {
            return false;
        }
    }
    return true;
};

// Get next aligned data structure
datum.next = function () {
    return new this.constructor( this.ptr + this.width );
};

// Read (copy) the content of another instance into self
datum.read = function ( src ) {
    for ( var i = 0; i < this.width; i++ ) {
        mem[ this.ptr + i ] = mem[ src.ptr + i ];
    }
};

Descriptor.prototype = datum;

Specifier.prototype = Object.create( datum, {

    constructor: { value: Specifier },
    width:       { value: 6 },

    offset: {
        enumerable: true,
        get: function ()  { return getUint( this.ptr + 3 ); },
        set: function ( n ) { setUint( this.ptr + 3, n ); }
    },

    length: {
        enumerable: true,
        get: function ()  { return getUint( this.ptr + 4 ); },
        set: function ( n ) { setUint( this.ptr + 4, n ); }
    }

} );


//
// Shortcuts
//

function getd( ptr ) {
    return new Descriptor( ptr );
}

function gets( ptr ) {
    return new Specifier( ptr );
}
