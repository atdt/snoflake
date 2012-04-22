/*jslint bitwise: true, plusplus: true */
/*globals ArrayBuffer, Float32Array, Uint32Array */

(function (global) {
    "use strict";

    var buffer   = new ArrayBuffer(4),
        float32a = new Float32Array(buffer),
        uint32a  = new Uint32Array(buffer),
        BOM      = '\uFEFF'; // Byte order mark

    if (typeof module !== 'undefined' && module.exports) {
        global = module.exports;
    }

    // Parses an unsigned, 32-bit integer as an IEEE 754 binary32.
    global.asFloat32 = function (n) {
        uint32a[0] = n;
        return n === uint32a[0]
            ? float32a[0]
            : NaN;
    };

    // Parses an IEEE 754 binary32 as an unsigned, 32-bit integer.
    global.asUint32 = function (r) {
        float32a[0] = r;
        return r === float32a[0]
            ? uint32a[0]
            : NaN;
    };

    global.isUint32 = function (n) {
        // return n === 0 || n === n >>> 0;
        uint32a[0] = n;
        return uint32a[0] === n;
    };

    global.encodeString = function (s) {
        var i, fst, snd, encoded = [];

        if (s.length % 2) {
            // If the string contains an odd number of characters, pad it by
            // prepending a byte order mark.
            s = BOM + s;
        }

        for (i = 0; i < s.length; i += 2) {
            fst = s.charCodeAt(i);
            snd = s.charCodeAt(i + 1) << 16;
            encoded.push(fst + snd);
        }

        return encoded;
    };

    global.decodeString = function (encoded) {
        var i, fst, snd, codes = [];

        for (i = 0; i < encoded.length; i++) {
            fst = encoded[i] & 0xffff;
            snd = encoded[i] >>> 16;
            codes.push(fst, snd);
        }

        if (codes[0] === 0xfeff) {
            // Discard the byte order mark (BOM), if present.
            codes.shift();
        }

        return String.fromCharCode.apply(null, codes);
    };

}(this));
