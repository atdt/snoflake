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

    encode: function ( s, maxLen ) {
        var encoded = s.toString().split( '' ).map( function ( ch ) {
            return ch.charCodeAt( 0 );
        } );

        if ( maxLen ) {
            while ( maxLen && maxLen % 3 ) {
                maxLen--;
            }
            encoded = encoded.slice( 0, maxLen );
        }

        // Strings are stored in whole descriptors, which have a width of
        // three UTF-16 code points, so pad to the nearest multiple of three
        // with Unicode Noncharacter U+FFFF.
        while ( encoded.length % 3 ) {
            encoded.push( 0 );
        }

        return encoded;
    },

    decode: function ( encoded ) {
        while ( encoded[ encoded.length -1 ] === 0 ) {
            encoded.pop();
        }

        return encoded.map( function ( charCode ) {
            return String.fromCharCode( charCode );
        } ).join( '' );
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

    repeat: function ( str, count ) {
        return new Array( count + 1 ).join( str );
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

                // throw new Error('FAIL: "' + template + '" (orig: "' + orig + '")');
                break; // XXX
        }

        control = formatted.charAt( 0 );
        formatted = formatted.slice( 2 );

         // the first character of information in each line is used
         // for carriage control of the printer.
        return formatted;
    }
};
