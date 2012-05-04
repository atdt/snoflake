function assert() {}; // stub

if (typeof require !== 'undefined') {
    var datatypes = require('./datatypes.js'),
        decodeFloat = datatypes.decodeFloat,
        encodeFloat = datatypes.encodeFloat,
        encodeInt = datatypes.encodeInt,
        decodeInt = datatypes.decodeInt,
        isValidUint = datatypes.isValidUint,
        isValidInt = datatypes.isValidInt,
        encodeString = datatypes.encodeString,
        decodeString = datatypes.decodeString;
}

var mem = [];

function Descriptor(offset) {

    if (!(this instanceof Descriptor)) {
        return new Descriptor(offset);
    }

    if (typeof offset !== undefined) {
        // Load a descriptor by address
        this.offset = offset;
    } else {
        // Allocate a new descriptor
        this.offset = mem.length;
        mem.push(0, 0, 0);
    }
}

Descriptor.create = function () {
    return 'foo';
};

Descriptor.load = function () {
    return 'load';
};

Descriptor.prototype = Object.create(null, {

    addr: {
        get: function () {
            return decodeInt( mem[this.offset] );
        },
        set: function (n) {
            assert(isValidInt(n), 'overflow');
            mem[this.offset] = encodeInt(n);
        }
    },

    r_addr: {
        get: function () {
            return decodeFloat(mem[this.offset]);
        },
        set: function (n) {
            assert(isValidFloat(n), 'overflow');
            mem[this.offset] = encodeFloat(n);
        }
    },

    flags: {
        get: function () {
            return mem[this.offset + 1];
        },
        set: function (n) {
            mem[this.offset + 1] = n;
        }
    },

    value: {
        get: function () {
            return mem[this.offset + 2];
        },
        set: function (n) {
            assert(isValidUint(n), 'overflow');
            mem[this.offset] = n;
        }
    }
});
