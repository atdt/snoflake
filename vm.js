// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh
// Released under GPL and MIT licenses

(function () {

    // << compiled SIL gets inlined here >>

    var end = stack.length,
        frame = [],
        p = 0,
        resident = [];

    // << macro defn's go here >>

    function exec(macro, operands, dest) {
        var stack_loc = p - 1,
            func = resident[macro],
            retval = func.apply(null, operands);

        if (dest !== null) {
            resident[dest] = (retval !== undefined) ? retval : stack_loc;
        }
    }

    do {
        frame = stack[p++];
        exec.apply(null, frame);
    } while (p < end);

}());
