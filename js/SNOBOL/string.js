"use strict";

var SNOBOL = require( './base' );
var assert = require( 'assert' );

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
        var encoded = s.toString().split( '' ).map( function ( ch ) {
            return ch.charCodeAt( 0 );
        } );

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

    format: function ( template, data ) {
        // Minimal FORTRAN-like formatter supporting: rAw, rIw, rFw.d, rX, nHtext, commas, '/'
        // Accept a template that may have a leading carriage control and outer parentheses.
        if (!template) return '';

        // If first character is not '(', try to find parentheses.
        var start = template.indexOf('(');
        var end = template.lastIndexOf(')');
        if (start !== -1 && end > start) {
            template = template.slice(start + 1, end);
        }

        // Normalize data: allow string or array of descriptors/values.
        var strData = '';
        if (typeof data === 'string') {
            strData = data;
        } else if (Array.isArray(data)) {
            // Join string-like items; for numeric formats, code below can be extended if needed.
            strData = data.map(String).join('');
        } else if (data && typeof data === 'object') {
            // Descriptor-like
            strData = String(data.specified || data.addr || '');
        }
        var pos = 0;
        var out = '';
        var i = 0;
        function take(n) {
            var s = strData.slice(pos, pos + n);
            pos += n;
            return s;
        }
        function skipSpaces() {
            while (i < template.length && /[\s,]/.test(template[i])) i++;
        }
        while (i < template.length) {
            skipSpaces();
            if (i >= template.length) break;
            if (template[i] === '/') { out += '\n'; i++; continue; }

            // Parse repeat count (optional)
            var m, rep = 1;
            m = /^(\d+)/.exec(template.slice(i));
            if (m) { rep = parseInt(m[1], 10); i += m[1].length; }

            var code = template[i++];
            if (code === 'H') {
                // repHtext
                var text = template.slice(i, i + rep);
                out += text;
                i += rep;
                continue;
            }
            if (code === 'X') {
                out += pad('', rep, 'left', ' ');
                continue;
            }
            if (code === 'A') {
                // width after A
                m = /^(\d+)/.exec(template.slice(i));
                var w = m ? (i += m[1].length, parseInt(m[1], 10)) : 0;
                for (var r = 0; r < rep; r++) {
                    var s = w ? take(w) : strData.slice(pos);
                    out += s;
                }
                continue;
            }
            if (code === 'I') {
                m = /^(\d+)/.exec(template.slice(i));
                var iw = m ? (i += m[1].length, parseInt(m[1], 10)) : 0;
                // Minimal: consume one integer from data (not robust). Pad left to width.
                var val = parseInt(strData.slice(pos), 10) || 0;
                var text = String(val);
                out += iw ? pad(text, iw) : text;
                continue;
            }
            if (code === 'F') {
                m = /^(\d+)(?:\.(\d+))?/.exec(template.slice(i));
                var fw = 0, fd = 0;
                if (m) { i += m[0].length; fw = parseInt(m[1], 10); fd = m[2] ? parseInt(m[2], 10) : 0; }
                var fval = parseFloat(strData.slice(pos)) || 0;
                var ftxt = fd ? fval.toFixed(fd) : String(fval);
                out += fw ? pad(ftxt, fw) : ftxt;
                continue;
            }
            // Unknown code: skip one char to avoid infinite loop
        }
        return out;
    }
};
