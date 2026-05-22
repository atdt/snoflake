#!/usr/bin/env node
import { parseArgs } from 'node:util';
import process from 'node:process';
import { run } from '../src/snobol.js';
import { createHostLoader } from '../src/host.js';

const { values, positionals } = parseArgs( {
    args: process.argv.slice( 2 ),
    options: {
        file:            { type: 'string' },
        input:           { type: 'string' },
        interactive:     { type: 'boolean', short: 'i' },
        // -f preserves the source's original case. The SIL compiler folds
        // identifiers to uppercase by default to match historical SNOBOL4.
        'preserve-case': { type: 'boolean', short: 'f' },
        // -b restores the SNOBOL4 startup banner / termination messages,
        // which Snoflake suppresses by default.
        banner:          { type: 'boolean', short: 'b' },
        // -s emits the program statistics summary at exit.
        statistics:      { type: 'boolean', short: 's' },
        list:            { type: 'boolean' },
        // -I adds a directory to the SNOLIB search path for -INCLUDE
        // lookups. Repeatable.
        snolib:          { type: 'string', short: 'I', multiple: true },
    },
    allowPositionals: true,
    strict: true,
} );

const result = run( {
    file:        values.file ?? positionals[ 0 ],
    input:       values.input,
    interactive: values.interactive,
    case:        !values[ 'preserve-case' ],
    banner:      values.banner,
    statistics:  values.statistics,
    list:        values.list,
    loader:      createHostLoader( { snolib: values.snolib } ),
} );

process.exitCode = result.exitCode;
