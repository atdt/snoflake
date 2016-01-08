/*jslint bitwise: true, plusplus: true, white: true */

"use strict";

var SNOBOL = require( './base' );

SNOBOL.str = {

    encode: function ( s ) {
        var i, lo, hi, encoded = [];

        s = s.toString();

        // Strings are stored in whole descriptors, which have a width of
        // six UTF-16 code points, so pad to the nearest multiple of six
        // with Unicode Noncharacter U+FFFF.
        while ( s.length % 6 ) {
            s = s + '\uFFFF';
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
            lo = encoded[ i ] & 0xFFFF;
            if ( lo !== 0xFFFF ) {
                codes.push( lo );
            }
            hi = encoded[ i ] >>> 16;
            if ( hi !== 0xFFFF ) {
                codes.push( hi );
            }
        }

        return String.fromCharCode.apply( null, codes );
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
