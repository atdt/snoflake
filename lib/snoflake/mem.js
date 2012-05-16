/*jslint white: true, vars: true, plusplus: true, forin: true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array */

"use strict";

var Snoflake = require( './base' );

// We store all data as unsigned 32-bit integers and use ES5's ArrayBuffer
// interface to handle conversion to and from additional datatypes.

var raw = [], symbols = {};

var buf = new ArrayBuffer( 4 ),
    f32 = new Float32Array( buf ),
    i32 = new Int32Array( buf ),
    u32 = new Uint32Array( buf );

var mem = {

    getUint: function( ptr ) {
        return raw[ ptr ];
    },

    setUint: function( ptr, value ) {
        u32[ 0 ] = value;
        if ( u32[ 0 ] !== value ) {
            throw new RangeError( 'Invalid unsigned integer ' + value );
        }
        raw[ ptr ] = u32[ 0 ];
    },

    getInt: function( ptr ) {
        u32[ 0 ] = raw[ ptr ];
        return i32[ 0 ];
    },

    setInt: function( ptr, value ) {
        i32[ 0 ] = value;
        if ( i32[ 0 ] !== value ) {
            throw new RangeError( 'Invalid integer ' + value );
        }
        raw[ ptr ] = u32[ 0 ];
    },

    getReal: function( ptr ) {
        u32[ 0 ] = raw[ ptr ];
        return f32[ 0 ];
    },

    setReal: function( ptr, value ) {
        f32[ 0 ] = value;

        if ( Math.abs(f32[ 0 ] - value) > 1 ) {
            throw new RangeError( 'Invalid real ' + value );
        }
        raw[ ptr ] = u32[ 0 ];
    },

    alloc: function ( size ) {
        var ptr = raw.length;
        while ( size-- ) {
            raw.push(0);
        }
        return ptr;
    },

    reset: function () {
        raw.splice( 0, raw.length );
        raw.symbols = {};
    },

    resolve: function ( key ) {
        if ( typeof key === 'number' ) {
            return key;
        }

        var ptr = this.symbols[ key ];

        if ( ptr === undefined ) {
            throw new ReferenceError( key );
        }
        return ptr;
    },

    assign: function ( assignee, value ) {
        if ( typeof assignee !== 'object' ) {
            raw.symbols[ assignee ] = value.ptr || value;
        } else {
            for ( var key in assignee ) {
                value = assignee[ key ];
                raw.symbols[ key ] = value.ptr || value;
            }
        }
    }

};

Snoflake.raw = raw;    
