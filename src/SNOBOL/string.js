"use strict";

import SNOBOL from './base.js';

function pad( str, width, align, padChar ) {
        if ( str.length >= width ) {
                return str;
        }

        if ( padChar === undefined ) {
                padChar = ' ';
        }

        return align === 'left'
                ? str.padEnd( width, padChar )
                : str.padStart( width, padChar );
}

SNOBOL.str = {

    pad: pad,

    encode: function ( s ) {
        const str = s.toString();
        const len = str.length;
        const paddedLen = len + ( len % 3 === 0 ? 0 : 3 - ( len % 3 ) );
        const encoded = new Uint32Array( paddedLen );

        for ( let i = 0; i < len; i++ ) {
            encoded[ i ] = str.charCodeAt( i );
        }

        return encoded;
    },

    decode: function ( encoded ) {
        let end = encoded.length;
        while ( end > 0 && encoded[ end - 1 ] === 0 ) {
            end--;
        }

        let decoded = '';
        for ( let i = 0; i < end; i++ ) {
            decoded += String.fromCharCode( encoded[ i ] );
        }
        return decoded;
    },

    // An implementation of Jenkins's one-at-a-time hash
    // <http://en.wikipedia.org/wiki/Jenkins_hash_function>
    hash: function ( key ) {
        let hash = 0, i = key.length;
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
        return str.repeat( count );
    },

    format: function ( template, data ) {
        // Minimal FORTRAN-like formatter supporting: rAw, rIw, rFw.d, rX, nHtext, commas, '/'
        // Accept a template that may have a leading carriage control and outer parentheses.
        if (!template) return '';

        // If first character is not '(', try to find parentheses.
        const start = template.indexOf('(');
        const end = template.lastIndexOf(')');
        if (start !== -1 && end > start) {
            template = template.slice(start + 1, end);
        }

        // Data arrives as a string from STPRNT (character data for A format)
        // or as an array of descriptors from OUTPUT (numeric fields for I/F).
        let strData = '';
        let descrData = null;
        let descrIdx = 0;
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
        let pos = 0;
        let out = '';
        let i = 0;
        function take(n) {
            const s = strData.slice(pos, pos + n);
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
            const m = /^(\d+)/.exec(template.slice(i));
            if (!m) return 0;
            i += m[1].length;
            return parseInt(m[1], 10);
        }
        function readQuotedLiteral(quote) {
            let literal = '';
            while (i < template.length) {
                const ch = template[i++];
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
            for (;;) {
                while (i < template.length && /\s/.test(template[i])) {
                    i++;
                }
                const mark = template[i];
                if (mark !== '"' && mark !== "'") {
                    return;
                }
                const saved = i;
                i++;
                const literal = readQuotedLiteral(mark);
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

            const rep = parseDigits() || 1;
            const code = template[i++];

            if (code === '"' || code === "'") {
                const literal = readQuotedLiteral(code);
                out += SNOBOL.str.repeat(literal, rep);
            } else if (code === 'H') {
                // Hollerith literal: rep is the character count.
                out += template.slice(i, i + rep);
                i += rep;
            } else if (code === 'X') {
                out += pad('', rep, 'left', ' ');
            } else if (code === 'A') {
                const aw = parseDigits();
                for (let r = 0; r < rep; r++) {
                    out += aw ? take(aw) : strData.slice(pos);
                }
            } else if (code === 'I') {
                const iw = parseDigits();
                // Consume the next descriptor's address field, or fall back to string data.
                const descr = nextDescr();
                const val = descr ? descr.addr : (parseInt(strData.slice(pos), 10) || 0);
                out += pad(String(val), iw);
            } else if (code === 'F') {
                const fw = parseDigits();
                let fd = 0;
                if (template[i] === '.') {
                    i++;
                    fd = parseDigits();
                }
                // Consume the next descriptor's real-typed address field, or fall back to string data.
                const descr = nextDescr();
                const fval = descr ? descr.raddr : (parseFloat(strData.slice(pos)) || 0);
                const ftxt = fd ? fval.toFixed(fd) : String(fval);
                out += pad(ftxt, fw);
            } else if (/[A-Za-z]/.test(code)) {
                // Ignore unsupported FORTRAN control words and scale factors.
                // In historical sample programs, words such as PAUSE can
                // appear in formats; the "A" inside them must not be parsed
                // as an A-conversion and consume character data.
                let word = code;
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
