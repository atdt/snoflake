// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh
// Released under GPL and MIT licenses

/*jslint plusplus: true */

(function () {
    "use strict";

    // << compiled SIL gets inlined here >>
    var BEGIN = 0, ATTRIB = 1, DESCR = 2, T = 3, stack = [ [ "TITLE", [ "Program Initialization" ], null ], [ "INIT", [ null ], BEGIN ], [ "EQU", [ 2 * DESCR ], ATTRIB ], [ "EQU", [ 5 ], T ], [ "ISTACK", [ null ], null ] ];

    var end = stack.length,
        frame = [],
        ip = 0, // instruction pointer
        d = [];

    var op, operands, dest;
    // << macro defn's go here >>

    function exec(macro, operands, dest) {
        var f = sil[macro];

        if (dest !== null) {
            d[dest] = ip;
        }

        next = f.apply(dest, operands);

        return typeof next !== 'undefined' ? next : p + 1;
    }

    do {
        frame = stack[pc];
        ip = exec.apply(null, frame);
    } while (pc < end);

}());
