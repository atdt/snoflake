// SIL Virtual Machine
// (C) Copyright 2012 by Ori Livneh
// Released under GPL and MIT licenses

/*jslint plusplus: true */

"use strict";


function SnoMachine(callstack) {

    var next_instruction = 0,
        symbols = {},
        data = {
            resident  : {},
            allocated : []
        };
    
    this.jump = function (loc) {
        next_instruction = isNaN(loc)
            ? labels[loc]
            : loc;
    };

};

function Descriptor() {
