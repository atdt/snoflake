var buffer   = new ArrayBuffer(4),
    float32a = new Float32Array(buffer),
    uint32a  = new Uint32Array(buffer),
    BOM      = '\uFEFF';

function asFloat32(n) {
    uint32a[0] = n;
    return n === uint32a[0]
        ? float32a[0]
        : NaN;
}

function asUint32(r) {
    float32a[0] = r;
    return r === float32a[0]
        ? uint32a[0]
        : NaN;
}

function encodeString(s) {
    var fst, snd, encoded = [];

    if (s.length % 2) {
        // If the string contains an odd number of characters, pad it by
        // prepending a byte order mark.
        s = BOM + s;
    }

    for (var i = 0; i < s.length; i += 2) {
        fst = s.charCodeAt(i);
        snd = s.charCodeAt(i + 1) << 16;
        encoded.push(fst + snd);
    }

    return encoded;
}

function decodeString(encoded) {
    var fst, snd, codes = [];

    for (var i = 0; i < encoded.length; i++) {
        fst = encoded[i] & 0xffff;
        snd = encoded[i] >>> 16;
        codes.push(fst, snd);
    }

    if (codes[0] === 0xfeff) {
        // Discard the byte order mark (BOM), if present.
        codes.shift();
    }

    return String.fromCharCode.apply(null, codes);
}
