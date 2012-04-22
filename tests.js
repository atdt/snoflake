module('data types');

test('string encoding', function () {
    var str = 'ハロー・ワールド',
        encoded = encodeString(str),
        decoded = decodeString(encoded);

    strictEqual(str, decoded, 'encodeString and decodeString are inverses');
});

test('real numbers', function () {
    var uint = 1042284544,
        real = 0.15625;

    strictEqual(asFloat32(uint), real, 'uInt32 -> Float32');
    strictEqual(asUint32(real), uint, 'Float32 -> uInt32');
});


test('uint32 validation', function () {
    var values = [
        [ Infinity,          false, ],
        [ -Infinity,         false, ],
        [ null,              false, ],
        [ undefined,         false, ],
        [ NaN,               false, ],
        [ 0,                 true,  ],
        [ 0,                 true,  ],
        [ 1,                 true,  ],
        [ -1,                false, ],
        [ 1.2,               false, ],
        [ -1.2,              false, ],
        [ 10000,             true,  ],
        [ -10000,            false, ],
        [ 2147483647,        true,  ],
        [ 2147483648,        true,  ],
        [ 4294967296,        false, ],
        [ -4294967296,       false, ],
        [ 4294967296.123,    false, ]
    ];

    values.forEach(function (data) {
        var value = data[0],
            is_uint32 = data[1],
            msg = [
                value,
                is_uint32 ? 'is' : 'is not',
                'an unsigned 32-bit integer'
            ].join(' ');

        strictEqual(isUint32(value), is_uint32, msg);
    });
});

module('descriptors');

test('loading descriptors', function () {
    var created = new Descriptor(),
        loaded = Descriptor(created.offset);

    created.setAddress(123);
    strictEqual(
        created.getAddress(),
        loaded.getAddress(),
        'identical descriptors share state'
    );
});


test('typecasting', function () {
    var desc = new Descriptor(),
        uint = 1042284544,
        real = 0.15625;

    desc.setAddress(uint);
    strictEqual(desc.getAddressReal(), real);
});
