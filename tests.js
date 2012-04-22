module('data types');

test('string encoding', function () {
    var str = 'ハロー・ワールド',
        encoded = encodeString(str),
        decoded = decodeString(encoded);

    strictEqual(str, decoded, 'encodeString and decodeString are inverses');
});

test('real numbers', function () {
    var raw = 1042284544,
        real = 0.15625;

    strictEqual(asFloat32(raw), real, 'uInt32 -> Float32');
    strictEqual(asUint32(real), raw, 'Float32 -> uInt32');
});
