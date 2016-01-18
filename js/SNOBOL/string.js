/*jslint bitwise: true, plusplus: true, white: true */

"use strict";

var SNOBOL = require( './base' );

var FORMAT_RE = /(\d*)([HI])(\d*)([^,\/]*)([,\/]\s*)?/g;

function pad( str, width, align, padChar ) {
        var padding;

        if ( str.length >= width ) {
                return str;
        }

        if ( padChar === undefined ) {
                padChar = ' ';
        }

        padding = new Array( width - str.length + 1 ).join( padChar );
        return align === 'left' ? str + padding : padding + str;
}
SNOBOL.str = {

    pad: pad,
    encode: function ( s ) {
        var i, lo, hi, control, encoded = [];

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
    },

    format: function ( template, items ) {
        var item, match, count, code, width, control, formatted = '';

        var orig = template;
        template = template.slice( 1, -1 );  // trim parentheses

        var fraction, whole;
        while ( template.length ) {
                match = /^(\d+)H/.exec( template );
                if ( match ) {
                        template = template.slice( match[0].length );
                        count = parseInt( match[1], 10 );
                        formatted += ' ' + template.slice( 0, count );
                        template = template.slice( count + 1 );
                        continue;
                }

                match = /^I(\d+)/.exec( template );
                if ( match ) {
                        template = template.slice( match[0].length + 1 );
                        item = items.length ? items.shift().addr : '';
                        formatted += ' ' + item;
                        continue;
                }

                match = /^F(\d+)(\.(\d+))?/.exec( template );
                if ( match ) {
                        template = template.slice( match[0].length + 1 );
                        item = items.length ? items.shift().raddr : '';

                        formatted += ' ' + Number( item ).toFixed( 3 );

                        continue;
                }
                if ( /^\//.test( template ) ) break;

                throw new Error('FAIL: "' + template + '" (orig: "' + orig + '")');
        }

        control = formatted.charAt( 0 );
        formatted = formatted.slice( 2 );

         // the first character of information in each line is used
         // for carriage control of the printer.
        return formatted;
    }
};
