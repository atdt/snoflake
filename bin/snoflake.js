#!/usr/bin/env node
"use strict";

import { parseArgs } from 'node:util';
import process from 'node:process';
import { VM, image } from '../src/snobol.js';

const { values, positionals } = parseArgs( {
    args: process.argv.slice( 2 ),
    options: {
        file:            { type: 'string' },
        input:           { type: 'string' },
        // -f preserves the source's original case. The SIL compiler folds
        // identifiers to uppercase by default to match historical SNOBOL4.
        'preserve-case': { type: 'boolean', short: 'f' },
        // -b restores the SNOBOL4 startup banner / termination messages,
        // which Snoflake suppresses by default.
        banner:          { type: 'boolean', short: 'b' },
        // -s emits the program statistics summary at exit.
        statistics:      { type: 'boolean', short: 's' },
        listing:         { type: 'boolean' },
    },
    allowPositionals: true,
    strict: true,
} );

const vm = new VM( {
    file:       values.file ?? positionals[ 0 ],
    input:      values.input,
    caseFold:   !values[ 'preserve-case' ],
    banner:     values.banner,
    statistics: values.statistics,
    listing:    values.listing,
} );

vm.run( image );
process.exitCode = vm.exitCode;
