/*jslint white:true, vars:true, plusplus:true */
/*jshint plusplus:false, laxbreak: true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array */

"use strict";

function Memory() {

    var data = [];

    // We store all data as unsigned 32-bit integers and use ES5's ArrayBuffer
    // interface to handle conversion to and from additional datatypes.

    var buffer   = new ArrayBuffer(4),
        float32a = new Float32Array(buffer),
        int32a   = new Int32Array(buffer),
        uint32a  = new Uint32Array(buffer);

    // Allocate and zero-fill `size` words
    this.malloc = function (size) {
        var ptr = data.length;
        while ( size-- ) {
            data.push(0);
        }
        return ptr;
    };

    // Unsigned Integers

    this.getUint = function (ptr) {
        return data[ptr];
    };

    this.setUint = function (ptr, value) {
        uint32a[0] = value;
        if ( uint32a[0] !== value ) {
            throw new TypeError( "Invalid unsigned integer " + value );
        }
        data[ptr] = uint32a[0];
    };

    // Signed integers

    this.getInt = function (ptr) {
        uint32a[0] = data[ptr];
        return int32a[0];
    };

    this.setInt = function (ptr, value) {
        int32a[0] = value;
        if ( int32a[0] !== value ) {
            throw new TypeError( "Invalid integer " + value );
        }
        data[ptr] = uint32a[0];
    };

    // Real numbers (binary32)

    this.getReal = function (ptr) {
        uint32a[0] = data[ptr];
        return float32a[0];
    };

    this.setReal = function (ptr, value) {
        float32a[0] = value;

        if ( Math.abs(float32a[0] - value) > 1 ) {
            throw new TypeError( "Invalid real " + value );
        }
        data[ptr] = uint32a[0];
    };

    Object.freeze( this );
}

var mem = new Memory();

function Descriptor(ptr) {
    this.ptr = typeof ptr !== 'undefined'
        ? ptr
        : mem.malloc(3);
    Object.seal( this );
}

Descriptor.load = function (ptr) {
    return new Descriptor( ptr );
};

function Specifier(ptr) {
    this.ptr = typeof ptr !== 'undefined'
        ? ptr
        : mem.malloc(6);
    Object.seal( this );
}

Specifier.load = function (ptr) {
    return new Specifier( ptr );
};

Descriptor.prototype = Object.create( null, {

    addr: {
        get: function ()  { return mem.getInt( this.ptr ); },
        set: function (n) { mem.setInt( this.ptr, n ); }
    },

    raddr: {
        get: function ()  { return mem.getFloat( this.ptr ); },
        set: function (n) { mem.setFloat( this.ptr, n ); }
    },

    flags: {
        get: function ()  { return mem.getUint( this.ptr + 1 ); },
        set: function (n) { mem.setUint( this.ptr + 1, n ); }
    },

    value: {
        get: function ()  { return mem.getUint( this.ptr + 2); },
        set: function (n) { mem.setUint( this.ptr + 2, n ); }
    }

} );

Specifier.prototype = Object.create( Descriptor.prototype, {

    offset: {
        get: function ()  { return mem.getUint( this.ptr + 3); },
        set: function (n) { mem.setUint( this.ptr + 3, n ); }
    },
    
    length: {
        get: function ()  { return mem.getUint( this.ptr + 4); },
        set: function (n) { mem.setUint( this.ptr + 3, 4 ); }
    }

} );
