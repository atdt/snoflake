// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh
// Released under GPL and MIT licenses

(function () {
    var frame, p = 0, rdata = [];

    function exec(op, operands, dest) {
        var retval = op.apply(null, args);

        if (dest !== null) {
            rdata[dest] = retval || p;
        }
    }

    do {
        frame = stack[p];
        exec.apply(null, frame);
    } while (p < stack.length);
}());
