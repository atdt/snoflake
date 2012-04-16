// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh
// Released under GPL and MIT licenses

/*jslint plusplus: true */

(function () {
    "use strict";

    var sil = require('./macros.js');
    // << compiled SIL gets inlined here >>

    console.log(sil);
    var end = stack.length,
        sil = {},
        frame = [],
        ip = 0, // instruction pointer
        d = [];

    var op, operands, dest;
    // << macro defn's go here >>

    function exec(macro, operands, dest) {
        var next, f = sil[macro];

        if (dest !== null) {
            d[dest] = ip;
        }

        next = f.apply(dest, operands.map(function (p) {
            return d[p];
        }));

        return typeof next !== 'undefined' ? next : ip + 1;
    }

    do {
        frame = stack[ip];
        ip = exec.apply(null, frame);
    } while (ip < end);

}());
