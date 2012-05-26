/*jslint bitwise: true, plusplus: true, white: true */

"use strict";

var Snoflake = require( './base' );

var byte_order_mark = '\uFEFF',
    decodeChars = String.fromCharCode;

var str = {

    encode: function ( s ) {
        var i, lo, hi, encoded = [];

        s = s.toString();

        // Strings are stored in whole descriptors, which have a width of
        // six UTF-16 code points, so pad to the nearest multiple of six:

        while ( s.length % 6 ) {
            s = byte_order_mark + s;
        }

        for ( i = 0; i < s.length; i += 2 ) {
            lo = s.charCodeAt( i );
            hi = s.charCodeAt( i + 1 ) << 16;
            encoded.push( lo + hi );
        }

        return encoded;
    },

    decode: function ( encoded ) {
        var i, lo, hi, codes = [];

        for ( i = 0; i < encoded.length; i++ ) {
            lo = encoded[ i ] & 0xffff;
            hi = encoded[ i ] >>> 16;
            codes.push( lo, hi );
        }

        while ( codes[0] === 0xfeff ) {
            codes.shift();
        }

        return decodeChars.apply( null, codes );
    },

    // An implementation of Jenkins's one-at-a-time hash
    // <http://en.wikipedia.org/wiki/Jenkins_hash_function>
    hash: function ( key ) {
        var hash = 0, i = key.length;
        while (i--) {
            hash += key.charCodeAt(i);
            hash += (hash << 10);
            hash ^= (hash >> 6);
        }
        hash += (hash << 3);
        hash ^= (hash >> 11);
        hash += (hash << 15);
        return hash;
    }
};


Snoflake.str = str;
