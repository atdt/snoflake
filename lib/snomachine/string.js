/*jslint bitwise: true, plusplus: true, white: true */

var SnoMachine = require( './base' );

var byte_order_mark = '\uFEFF',
    decode = String.fromCharCode;

SnoMachine.string = {
    encode: function ( s ) {
        var i, lo, hi, encoded = [];

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

        return decode.apply( null, codes );
    }
};
