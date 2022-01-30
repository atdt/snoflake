"use strict";

var SNOBOL = require( './base' ),
    assert = require('assert');


// Extend `dst` by copying enumerable properties on `src`
// as non-enumerable data descriptors.
function defineValues( dst, src ) {
    Object.keys( src ).forEach( function (key) {
        var property = { value: src[ key ] };
        Object.defineProperty( dst, key, property );
    } );
    return dst;
}

function titleCase( str ) {
    return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
}

function MemorySlot( type, offset ) {
    type   = titleCase( type );
    offset = offset || 0;

    this.enumerable = true;

    this.get = function () {
        return this.vm[ 'get' + type ]( this.ptr + offset );
    };

    this.set = function ( n ) {
        this.vm[ 'set' + type ]( this.ptr + offset, n );
    };
}

MemorySlot.prototype.enumerable = true;

SNOBOL.Descriptor = function Descriptor( vm, ptr ) {
    Object.defineProperty( this, 'vm', { value: vm } );

    if ( ptr === undefined ) {
        ptr = vm.alloc( this.width );
    } else if ( typeof ptr === 'string' ) {
        ptr = vm.resolve( ptr );
    }
    Object.defineProperty( this, 'ptr', { value: ptr } );

    while ( this.ptr + this.width > vm.mem.length ) {
        vm.mem.push( 0 );
    }

    Object.freeze( this );
};

SNOBOL.Specifier = function Specifier( vm, ptr ) {
    SNOBOL.Descriptor.call( this, vm, ptr );
};

SNOBOL.Descriptor.prototype = Object.create( null, {
    name        : { value: 'Descriptor' },
    constructor : { value : SNOBOL.Descriptor },
    width       : { value : 3 },
    addr        : new MemorySlot( 'int',  0 ),
    raddr       : new MemorySlot( 'real', 0 ),
    flags       : new MemorySlot( 'uint', 1 ),
    value       : new MemorySlot( 'uint', 2 ),

} );

defineValues( SNOBOL.Descriptor.prototype, {
    update: function () {
        if ( arguments.length > this.width ) {
            throw new TypeError( 'Too many parameters' );
        }
        for ( var i = 0; i < this.width; i++ ) {
            this.vm.setUint( this.ptr + i, arguments[ i ] || 0 );
        }
        return this;
    },

    // Test two instances for equality
    isEqualTo: function ( other ) {
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

    // Get prev aligned data structure
    prev: function () {
        return new this.constructor( this.vm, this.ptr - this.width );
    },

    // Read (copy) the content of another instance into self
    read: function ( src ) {
        for ( var i = 0; i < this.width; i++ ) {
            this.vm.mem[ this.ptr + i ] = this.vm.mem[ src.ptr + i ];
        }
    },

    raw: function () {
        return this.vm.mem.slice( this.ptr, this.ptr + this.width );
    },

    toString: function () {
        var fields = [], props = {};

        for ( var k in this ) {
            props[ k.charAt( 0 ).toUpperCase() ] = this[ k ];
        }

        [ 'A', 'F', 'V', 'O', 'L' ].forEach( function ( k ) {
            if ( k in props ) {
                fields.push( k + '=' + props[k] );
            }
        } );

        return [
            '<', this.name, '@', this.ptr, ' ',
                fields.join( ', ' ), '>'
        ].join( '' );
    }
} );


SNOBOL.Specifier.prototype = Object.create( SNOBOL.Descriptor.prototype, {
    name        : { value: 'Specifier' },
    constructor : { value: SNOBOL.Specifier },
    width       : { value: 6 },
    offset      : new MemorySlot( 'uint', 3 ),
    length      : new MemorySlot( 'uint', 4 ),
    specified   : {
        enumerable: false,
        get: function () {
            var start = this.addr + this.offset,
                end = start + this.length;

            return SNOBOL.str.decode( this.vm.mem.slice( start, end ) );
        },
        set: function ( s ) {
            var start = this.addr + this.offset,
                raw = SNOBOL.str.encode( s ),
                length = Math.min( raw.length, this.length ),
                args = [ start, length ].concat( raw );

            this.vm.mem.splice.apply( this.vm.mem, args );
            this.length = length;
        }
    }
} );
