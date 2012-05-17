/*jslint white: true, vars: true, plusplus: true, forin: true */
/*globals ArrayBuffer, Float32Array, Int32Array, Uint32Array */


var Snoflake = require( './base' );

(function () {
    "use strict";

    // We store all data as unsigned 32-bit integers and use ES5's
    // ArrayBuffer interface to handle conversion to and from additional
    // datatypes.

    var buf = new ArrayBuffer( 4 ),
        f32 = new Float32Array( buf ),
        i32 = new Int32Array( buf ),
        u32 = new Uint32Array( buf );

    Snoflake.mem = {

        raw     : [],
        symbols : {},

        getUint: function( ptr ) {
            return this.raw[ ptr ];
        },

        setUint: function( ptr, value ) {
            u32[ 0 ] = value;
            if ( u32[ 0 ] !== value ) {
                throw new RangeError( 'Invalid unsigned integer ' + value );
            }
            this.raw[ ptr ] = u32[ 0 ];
        },

        getInt: function( ptr ) {
            u32[ 0 ] = this.raw[ ptr ];
            return i32[ 0 ];
        },

        setInt: function( ptr, value ) {
            i32[ 0 ] = value;
            if ( i32[ 0 ] !== value ) {
                throw new RangeError( 'Invalid integer ' + value );
            }
            this.raw[ ptr ] = u32[ 0 ];
        },

        getReal: function( ptr ) {
            u32[ 0 ] = this.raw[ ptr ];
            return f32[ 0 ];
        },

        setReal: function( ptr, value ) {
            f32[ 0 ] = value;

            if ( Math.abs(f32[ 0 ] - value) > 1 ) {
                throw new RangeError( 'Invalid real ' + value );
            }
            this.raw[ ptr ] = u32[ 0 ];
        },

        alloc: function ( size ) {
            var ptr = this.raw.length;
            while ( size-- ) {
                this.raw.push(0);
            }
            return ptr;
        },

        reset: function () {
            this.raw = [];
            this.symbols = {};
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
            var key;
            if ( typeof assignee !== 'object' ) {
                this.symbols[ assignee ] = value.ptr || value;
            } else {
                for ( key in assignee ) {
                    value = assignee[ key ];
                    this.symbols[ key ] = value.ptr || value;
                }
            }
        }
    };
}());
