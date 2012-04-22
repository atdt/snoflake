// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh
// Released under GPL and MIT licenses

/*jslint plusplus: true */

"use strict";

var ip = 0,
    labels = {},
    d = {},
    sil = require('./sil.js'),
    stack = require('./v311.js');

function jmp(dest) {
    ip = isNaN(dest) ? labels[dest] : dest;
}

function exec (label, oper, getOperands) {
    var next = op.apply(label, getOperands());

    if (label !== null) {
        labels[label] = ip;
    }

    if (typeof next === 'undefined') {
        next = ip + 1;
    }

    return next;
}

function run (stack) {
    var end = stack.length,
        frame = [];

    do {
        frame = stack[ip++];
        ip = exec.apply(null, frame);
    } while (ip < end);

    return 0;
}

run(stack);
