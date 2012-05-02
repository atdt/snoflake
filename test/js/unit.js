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

    strictEqual(decodeFloat(uint), real, 'uInt32 -> Float32');
    strictEqual(encodeFloat(real),  uint, 'Float32 -> uInt32');
});


test('float32 validation', function () {
    var values = [
        [Infinity,      true  ],
        [0,             true  ],
        [1,             true  ],
        [-1,            true  ],
        [-1000,         true  ],
        [0.1,           false ],
        [12.375,        true  ],
        [0.15625,       true  ],
        [0.125,         true  ],
        [68.123,        false ],
        [Math.PI,       false ],
        [Math.SQRT2,    false ],
        [Math.SQRT1_2,  false ],
    ];

    values.forEach(function (data) {
        var value = data[0],
            is_float32 = data[1],
            msg = [
                value,
                is_float32 ? 'is' : 'is not',
                'a valid float32 value'
            ].join(' ');

        strictEqual(isValidFloat(value), is_float32, msg);
    });
});

test('uint32 validation', function () {
    var values = [
        [ Infinity,          false ],
        [ -Infinity,         false ],
        [ null,              false ],
        [ undefined,         false ],
        [ NaN,               false ],
        [ 0,                 true  ],
        [ 0,                 true  ],
        [ 1,                 true  ],
        [ -1,                false ],
        [ 1.2,               false ],
        [ -1.2,              false ],
        [ 10000,             true  ],
        [ -10000,            false ],
        [ 2147483647,        true  ],
        [ 2147483648,        true  ],
        [ 4294967296,        false ],
        [ -4294967296,       false ],
        [ 4294967296.123,    false ]
    ];

    values.forEach(function (data) {
        var value = data[0],
            is_uint32 = data[1],
            msg = [
                value,
                is_uint32 ? 'is' : 'is not',
                'an unsigned 32-bit integer'
            ].join(' ');

        strictEqual(isValidUint(value), is_uint32, msg);
    });
});

module('descriptors');

test('loading descriptors', function () {
    var created = new Descriptor(),
        loaded  = Descriptor(created.offset);

    created.addr = -123;
    ok(created.addr === loaded.addr && loaded.addr === -123);
});


test('typecasting', function () {
    var desc = new Descriptor(),
        intg = 1042284544,
        real = 0.15625;

    desc.addr = intg;
    strictEqual(desc.r_addr, real);
});
