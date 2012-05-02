function assert(expr, msg) {
    if (!expr) {
        console.error('Assertion error: ' + msg);
    }
}

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

var heap = [];

function Descriptor(offset) {
    if (!(this instanceof Descriptor)) {
        return new Descriptor(offset);
    }

    if (typeof offset !== undefined) {
        // Load a descriptor by address
        this.offset = offset;
    } else {
        // Allocate a new descriptor
        this.offset = heap.length;
        heap.push(0, 0, 0);
    }
}

Descriptor.prototype = Object.create(null, {

    addr: {
        get: function () {
            return decodeInt( heap[this.offset] );
        },
        set: function (n) {
            assert(isValidInt(n), 'overflow');
            heap[this.offset] = encodeInt(n);
        }
    },

    r_addr: {
        get: function () {
            return decodeFloat( heap[ this.offset ] );
        },
        set: function (n) {
            assert(isValidFloat(n), 'overflow');
            heap[this.offset] = encodeFloat(n);
        }
    },

    flags: {
        get: function () {
            return heap[this.offset + 1];
        },
        set: function (n) {
            heap[this.offset + 1] = n;
        }
    },

    value: {
        get: function () {
            return heap[this.offset + 2];
        },
        set: function (n) {
            assert(isValidUint(n), 'overflow');
            heap[this.offset] = n;
        }
    }
});
