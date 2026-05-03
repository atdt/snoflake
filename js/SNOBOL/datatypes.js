"use strict";

import SNOBOL from './base.js';
import assert from 'node:assert';


// Extend `dst` by copying enumerable properties on `src`
// as non-enumerable data descriptors.
function defineValues( dst, src ) {
    Object.keys( src ).forEach( function (key) {
        const property = { value: src[ key ] };
        Object.defineProperty( dst, key, property );
    } );
    return dst;
}

SNOBOL.Descriptor = function Descriptor( vm, ptr ) {
    this.vm = vm;

    if ( ptr === undefined ) {
        ptr = vm.alloc( this.width );
    } else if ( typeof ptr === 'string' ) {
        ptr = vm.resolve( ptr );
    }
    this.ptr = ptr;
};

SNOBOL.Specifier = function Specifier( vm, ptr ) {
    SNOBOL.Descriptor.call( this, vm, ptr );
};

SNOBOL.Descriptor.prototype = Object.create( null, {
    name        : { value: 'Descriptor' },
    constructor : { value : SNOBOL.Descriptor },
    width       : { value : 3 },
    slots       : { value: Object.freeze( [ 'addr', 'flags', 'value' ] ) },
    addr        : {
        get: function ()  { return this.vm.getInt( this.ptr + 0 ); },
        set: function (n) { this.vm.setInt( this.ptr + 0, n ); }
    },
    raddr       : {
        get: function ()  { return this.vm.getReal( this.ptr + 0 ); },
        set: function (n) { this.vm.setReal( this.ptr + 0, n ); }
    },
    flags       : {
        get: function ()  { return this.vm.getUint( this.ptr + 1 ); },
        set: function (n) { this.vm.setUint( this.ptr + 1, n ); }
    },
    value       : {
        get: function ()  { return this.vm.getUint( this.ptr + 2 ); },
        set: function (n) { this.vm.setUint( this.ptr + 2, n ); }
    }
} );

defineValues( SNOBOL.Descriptor.prototype, {
    update: function (...args) {
        this.addr = args.length ? args.shift() : 0;
        this.flags = args.length ? args.shift() : 0;
        this.value = args.length ? args.shift() : 0;
        return this;
    },

    // Test two instances for equality
    isEqualTo: function ( other ) {
        if ( this.width !== other.width ) {
            return false;
        }
        for ( let i = 0; i < this.width; i++ ) {
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
        for ( let i = 0; i < this.width; i++ ) {
            this.vm.mem[ this.ptr + i ] = this.vm.mem[ src.ptr + i ];
        }
    },

    raw: function () {
        const r = [];
        for ( let i = 0; i < this.slots.length; i++ ) {
            r.push( this.vm.mem[ this.ptr + i ] );
        }
        return r;
    },

    toString: function () {
        const fields = [];
        const props = {
            A: this.addr,
            F: this.flags,
            V: this.value
        };
        if ( this.width === 6 ) {
            props.O = this.offset;
            props.L = this.length;
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
    slots       : { value: Object.freeze( [ 'addr', 'flags', 'value', 'offset', 'length' ] ) },
    offset      : {
        get: function ()  { return this.vm.getUint( this.ptr + 3 ); },
        set: function (n) { this.vm.setUint( this.ptr + 3, n ); }
    },
    length      : {
        get: function ()  { return this.vm.getUint( this.ptr + 4 ); },
        set: function (n) { this.vm.setUint( this.ptr + 4, n ); }
    },
    specified   : {
        enumerable: false,
        get: function () {
            const start = this.addr + this.offset,
                  end = start + this.length;

            return SNOBOL.str.decode( this.vm.mem.slice( start, end ) );
        }
    }
} );

defineValues( SNOBOL.Specifier.prototype, {
    update: function (...args) {
        this.addr = args.length ? args.shift() : 0;
        this.flags = args.length ? args.shift() : 0;
        this.value = args.length ? args.shift() : 0;
        this.offset = args.length ? args.shift() : 0;
        this.length = args.length ? args.shift() : 0;
        return this;
    }
} );
