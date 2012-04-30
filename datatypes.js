/*jslint bitwise: true, plusplus: true */
/*globals ArrayBuffer, Float32Array, Uint32Array */

(function (global) {
    "use strict";

    var buffer   = new ArrayBuffer(4),
        float32a = new Float32Array(buffer),
        int32a   = new Int32Array(buffer),
        uint32a  = new Uint32Array(buffer),
        BOM      = '\uFEFF'; // Byte order mark

    if (typeof module !== 'undefined' && module.exports) {
        global = module.exports;
    }

    // Signed Integers

    global.encodeInt = function (n) {
        int32a[0] = n;
        return uint32a[0];
    };

    global.decodeInt = function (n) {
        uint32a[0] = n;
        return n === uint32a[0]
            ? int32a[0]
            : NaN;
    };

    // Floats

    global.encodeFloat = function (r) {
        float32a[0] = r;
        return uint32a[0];
    };

    global.decodeFloat = function (n) {
        uint32a[0] = n;
        return n === uint32a[0]
            ? float32a[0]
            : NaN;
    };


    // Data Validation

    global.isValidUint = function (n) {
        uint32a[0] = n;
        return uint32a[0] === n;
    };

    global.isValidInt = function (n) {
        int32a[0] = n;
        return int32a[0] === n;
    };

    global.isValidFloat = function (n) {
        float32a[0] = n;
        return float32a[0] === n;
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
