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

        // Data arrives as a string from STPRNT (character data for A format)
        // or as an array of descriptors from OUTPUT (numeric fields for I/F).
        var strData = '';
        var descrData = null;
        var descrIdx = 0;
        if (typeof data === 'string') {
            strData = data;
        } else if (Array.isArray(data) && data.length > 0 && data[0] && typeof data[0] === 'object' && 'addr' in data[0]) {
            descrData = data;
        } else if (Array.isArray(data)) {
            strData = data.map(String).join('');
        } else if (data && typeof data === 'object' && 'addr' in data) {
            descrData = [ data ];
        } else if (data && typeof data === 'object') {
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
        function nextDescr() {
            if (descrData && descrIdx < descrData.length) {
                return descrData[descrIdx++];
            }
            return null;
        }
        function skipSpaces() {
            while (i < template.length && /[\s,]/.test(template[i])) i++;
        }

        // Parse a run of decimal digits at the current template position,
        // advancing past them. Returns 0 if no digits are present.
        function parseDigits() {
            var m = /^(\d+)/.exec(template.slice(i));
            if (!m) return 0;
            i += m[1].length;
            return parseInt(m[1], 10);
        }
        function readQuotedLiteral(quote) {
            var literal = '';
            while (i < template.length) {
                var ch = template[i++];
                if (ch === quote) {
                    if (template[i] === quote) {
                        literal += quote;
                        i++;
                        continue;
                    }
                    break;
                }
                literal += ch;
            }
            return literal;
        }
        function skipPauseQuoteMarks() {
            var mark, saved, literal;
            for (;;) {
                while (i < template.length && /\s/.test(template[i])) {
                    i++;
                }
                mark = template[i];
                if (mark !== '"' && mark !== "'") {
                    return;
                }
                saved = i;
                i++;
                literal = readQuotedLiteral(mark);
                if (literal !== "'") {
                    i = saved;
                    return;
                }
            }
        }

        while (i < template.length) {
            skipSpaces();
            if (i >= template.length) break;

            if (template[i] === '/') {
                out += '\n';
                i++;
                continue;
            }

            var rep = parseDigits() || 1;
            var code = template[i++];

            if (code === '"' || code === "'") {
                var literal = readQuotedLiteral(code);
                out += SNOBOL.str.repeat(literal, rep);
            } else if (code === 'H') {
                // Hollerith literal: rep is the character count.
                out += template.slice(i, i + rep);
                i += rep;
            } else if (code === 'X') {
                out += pad('', rep, 'left', ' ');
            } else if (code === 'A') {
                var aw = parseDigits();
                for (var r = 0; r < rep; r++) {
                    out += aw ? take(aw) : strData.slice(pos);
                }
            } else if (code === 'I') {
                var iw = parseDigits();
                // Consume the next descriptor's address field, or fall back to string data.
                var descr = nextDescr();
                var val = descr ? descr.addr : (parseInt(strData.slice(pos), 10) || 0);
                out += pad(String(val), iw);
            } else if (code === 'F') {
                var fw = parseDigits();
                var fd = 0;
                if (template[i] === '.') {
                    i++;
                    fd = parseDigits();
                }
                // Consume the next descriptor's real-typed address field, or fall back to string data.
                var descr = nextDescr();
                var fval = descr ? descr.raddr : (parseFloat(strData.slice(pos)) || 0);
                var ftxt = fd ? fval.toFixed(fd) : String(fval);
                out += pad(ftxt, fw);
            } else if (/[A-Za-z]/.test(code)) {
                // Ignore unsupported FORTRAN control words and scale factors.
                // In historical sample programs, words such as PAUSE can
                // appear in formats; the "A" inside them must not be parsed
                // as an A-conversion and consume character data.
                var word = code;
                while (i < template.length && /[A-Za-z0-9.]/.test(template[i])) {
                    word += template[i];
                    i++;
                }
                if (word === 'PAUSE') {
                    skipPauseQuoteMarks();
                }
            }
        }
        return out;
    }
};
