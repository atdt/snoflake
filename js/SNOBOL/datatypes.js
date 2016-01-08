/*jslint passfail: false, indent: 4, undef:true, white:true, plusplus:true,vars:true */

"use strict";

var SNOBOL = require( './base' );

// Extend `dst` by copying enumerable properties on `src`
// as non-enumerable data descriptors.
function defineValues( dst, src ) {
    Object.keys( src ).forEach( function (key) {
        var property = { value: src[ key ] };
        Object.defineProperty( dst, key, property );
    } );
    return dst;
}

var SNOBOL = require( './base' );


SNOBOL.Descriptor = function Descriptor( vm, ptr ) {
    Object.defineProperty( this, 'vm', { value: vm } );

    if ( ptr === undefined ) {
        ptr = vm.alloc( this.width );
    } else if ( typeof ptr === 'string' ) {
        ptr = vm.resolve( ptr );
    }
    Object.defineProperty( this, 'ptr', { value: ptr } );

    Object.freeze( this );
};

SNOBOL.Specifier = function Specifier( vm, ptr ) {
    SNOBOL.Descriptor.call( this, vm, ptr );
};

var datum = Object.create( null, {
    
    constructor : { value : SNOBOL.Descriptor },
    width       : { value : 3 },

    addr: {
        enumerable: true,
        get: function () { return this.vm.getInt( this.ptr ); },
        set: function ( n ) { this.vm.setInt( this.ptr, n ); }
    },

    raddr: {
        enumerable: true,
        get: function () { return this.vm.getReal( this.ptr ); },
        set: function ( n ) { this.vm.setReal( this.ptr, n ); }
    },

    flags: {
        enumerable: true,
        get: function () { return this.vm.getUint( this.ptr + 1 ); },
        set: function ( n ) { this.vm.setUint( this.ptr + 1, n ); }
    },

    value: {
        enumerable: true,
        get: function () { return this.vm.getUint( this.ptr + 2 ); },
        set: function ( n ) { this.vm.setUint( this.ptr + 2, n ); }
    }

} );

defineValues( datum, {
    update: function () {
        var values = Array.prototype.slice.call( arguments );
        if ( values.length > this.width ) {
            throw new TypeError( 'Too many keys to unpack' );
        }
        for ( var i = 0; i < values.length; i++ ) {
            this.vm.setUint( this.ptr + i, values[ i ] );
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
            if ( this.vm.mem[ this.ptr + i ] !== this.vm.mem[ other.ptr + i ] ) {
                return false;
            }
        }
        return true;
    },

    // Get next aligned data structure
    next: function () {
        return new this.constructor( this.vm, this.ptr + this.width );
    },

    // Read (copy) the content of another instance into self
    read: function ( src ) {
        for ( var i = 0; i < this.width; i++ ) {
            this.vm.mem[ this.ptr + i ] = this.vm.mem[ src.ptr + i ];
        }
    },

    raw: function () {
        return this.vm.mem.slice( this.ptr, this.ptr + this.width );
    }
} );


SNOBOL.Descriptor.prototype = datum;

SNOBOL.Specifier.prototype = Object.create( datum, {

    constructor: { value: SNOBOL.Specifier },
    width:       { value: 6 },

    offset: {
        enumerable: true,
        get: function ()  { return this.vm.getUint( this.ptr + 3 ); },
        set: function ( n ) { this.vm.setUint( this.ptr + 3, n ); }
    },

    length: {
        enumerable: true,
        get: function ()  { return this.vm.getUint( this.ptr + 4 ); },
        set: function ( n ) { this.vm.setUint( this.ptr + 4, n ); }
    },

    specified: {
        enumerable: false,
        get: function () {
            var memLength = Math.ceil( ( this.offset + this.length ) / 12 ) * 6,
                memSegment = this.vm.mem.slice( this.addr, this.addr + memLength + 1 );

            return SNOBOL.str.decode( memSegment ).slice( this.offset, this.length );
        },
        set: function ( s ) {
            this.addr = this.vm.mem.length;
            this.offset = 0;
            this.length = s.length;
            this.vm.mem = this.vm.mem.concat( SNOBOL.str.encode( s ) );
        }
    }
} );
