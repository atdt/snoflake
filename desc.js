function AssertException(message) {
    this.message = message;
}

AssertException.prototype.toString = function () {
      return 'AssertException: ' + this.message;
};

function assert(exp, message) {
    if (!exp) {
        throw new AssertException(message);
    }
}

if (typeof require !== 'undefined') {
    var datatypes = require('./datatypes.js'),
        asFloat32 = datatypes.asFloat32,
        asUint32 = datatypes.asUint32,
        isUint32 = datatypes.isUint32,
        encodeString = datatypes.encodeString,
        decodeString = datatypes.decodeString;
}


var heap = [];

function Descriptor(offset) {
    if (!(this instanceof Descriptor)) {
        return new Descriptor(offset);
    }

    this.offset = typeof offset !== 'undefined'
        ? offset
        : heap.length;
}

Descriptor.prototype.getAddress = function () {
    return heap[this.offset];
};

Descriptor.prototype.getAddressReal = function () {
    return asFloat32(heap[this.offset]);
};

Descriptor.prototype.setAddress = function (n) {
    assert(isUint32(n), 'overflow');
    heap[this.offset] = n;
};

Descriptor.prototype.setAddressReal = function (n) {
    this.setAddress(asUint32(n));
};

