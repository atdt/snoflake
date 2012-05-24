/*jslint passfail: false, indent: 4, undef:true, white:true, plusplus:true, vars:true */
/*globals mem, alloc, assign, resolve, getInt, setInt, getReal, setReal, getUint, setUint */

"use strict";

var Snoflake = require( './base' ),
    str = Snoflake.str,
    push = Array.prototype.push;

// Extend `dst` by copying enumerable properties on `src` as non-enumerable
// data descriptors. Note that `descriptors
function defineValues( dst, src ) {
    Object.keys( src ).forEach( function (key) {
        var property = { value: src[ key ] };
        Object.defineProperty( dst, key, property );
    } );
    return dst;
}

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

var slice = Array.prototype.slice;

function Descriptor( ptr ) {
    if ( ptr === undefined ) {
        ptr = alloc( this.width );
    } else if ( typeof ptr === 'string' ) {
        ptr = resolve( ptr );
    }
    Object.defineProperty( this, 'ptr', { value: ptr } );
    Object.freeze( this );
}

function Specifier( ptr ) {
    Descriptor.call( this, ptr );
}

var datum = Object.create( null, {
    
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

defineValues( datum, {
    update: function () {
        var values = slice.call( arguments );
        if ( values.length > this.width ) {
            throw new TypeError( 'Too many keys to unpack' );
        }
        for ( var i = 0; i < values.length; i++ ) {
            setUint( this.ptr + i, values[ i ] );
        }
        return this;
    },

    // Test two instances for equality
    eq: function ( other ) {
        if ( this.width === undefined ) {
            throw new TypeError( other );
        }
        if ( this.width !== other.width ) {
            return false;
        }
        for ( var i = 0; i < this.width; i++ ) {
            if ( mem[ this.ptr + i ] !== mem[ other.ptr + i ] ) {
                return false;
            }
        }
        return true;
    },

    // Get next aligned data structure
    next: function () {
        return new this.constructor( this.ptr + this.width );
    },

    // Read (copy) the content of another instance into self
    read: function ( src ) {
        for ( var i = 0; i < this.width; i++ ) {
            mem[ this.ptr + i ] = mem[ src.ptr + i ];
        }
    },

    raw: function () {
        return mem.slice( this.ptr, this.ptr + this.width );
    }
} );


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
    },

    specified: {
        enumerable: false,
        get: function () {
            return gets( this.addr, this.addr + this.length );
        },
        set: function ( s ) {
            this.addr = mem.length;
            push.apply( mem, str.encode( s ) );
            this.length = mem.length - this.addr;
        }
    }
} );

defineValues( Specifier.prototype, {
    specify: function ( s ) {
        this.addr = mem.length;
    },
} );


//
// Shortcuts
//

// Get descriptor
function getd( ptr ) {
    return new Descriptor( ptr );
}

// Get specifier
function getspc( ptr ) {
    return new Specifier( ptr );
}

// Stub
var file = {
    open     : function () {},
    close    : function () {},
    seek     : function () {},
};

Snoflake.extend( {
    Descriptor: Descriptor,
    Specifier: Specifier,
    datum: datum,
    defineValues: defineValues,
    getd: getd,
    getspc: getspc,
} );
