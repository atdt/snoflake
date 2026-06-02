#!/usr/bin/env node
import module from 'node:module';
import { parseArgs } from 'node:util';
import { readFileSync } from 'node:fs';
import process from 'node:process';

// Persist V8 bytecode across runs. The src/ imports below are dynamic so
// they compile after this call and land in the cache.
module.enableCompileCache?.();

const HELP = `Usage: snoflake [options] [file]

Run a SNOBOL4 program. The source is the first argument.

Options:
  --input=PATH       Finite input file consumed by runtime INPUT reads.
  -i, --interactive  After --input is exhausted, read INPUT from the
                     terminal. Use this for conversational programs.
  --case=false       Preserve the source's letter case. By default
                     identifiers are folded to uppercase, as in SNOBOL4.
  --multiline-strings=false
                     Disable backtick multi-line strings.
  -b, --banner       Print the startup banner and termination message.
  -s, --statistics   Print the program-statistics summary at exit.
      --list         Print the source listing as the program compiles.
  -I, --snolib=DIR   Add DIR to the -INCLUDE and INPUT search path.
                     Repeatable; directories are searched in order.
  -h, --help         Show this help and exit.
  -v, --version      Show the version and exit.

Examples:
  snoflake hello.sno
  snoflake filter.sno --input=data.txt
  snoflake eliza.sno --interactive

Full guide: https://github.com/atdt/snoflake/blob/master/docs/manual.md`;

function version() {
    const pkg = new URL( '../package.json', import.meta.url );
    return JSON.parse( readFileSync( pkg, 'utf8' ) ).version;
}

let parsed;
try {
    parsed = parseArgs( {
        args: process.argv.slice( 2 ),
        options: {
            input: { type: 'string' },
            interactive: { type: 'boolean', short: 'i' },
            // Seeds &CASE: --case=false preserves the source's original
            // case. The SIL compiler folds identifiers to uppercase by
            // default to match historical SNOBOL4.
            case: { type: 'string' },
            'multiline-strings': { type: 'string' },
            // Snoflake suppresses the banner and termination messages by
            // default. -b restores them.
            banner: { type: 'boolean', short: 'b' },
            statistics: { type: 'boolean', short: 's' },
            list: { type: 'boolean' },
            snolib: { type: 'string', short: 'I', multiple: true },
            help: { type: 'boolean', short: 'h' },
            version: { type: 'boolean', short: 'v' },
        },
        allowPositionals: true,
        strict: true,
    } );
} catch ( e ) {
    console.error( 'snoflake: ' + e.message + '\n' );
    console.error( "Try 'snoflake --help' for the list of options." );
    process.exit( 2 );
}

const { values, positionals } = parsed;

if ( values.help ) {
    console.log( HELP );
    process.exit( 0 );
}

if ( values.version ) {
    console.log( version() );
    process.exit( 0 );
}

const file = positionals[0];
if ( file === undefined ) {
    console.error( 'snoflake: no source file given\n' );
    console.error( HELP );
    process.exit( 2 );
}

const { run } = await import( '../src/snobol.js' );
const { createHostLoader, stdinReader } = await import( '../src/host.js' );

const result = run( {
    file,
    input: values.input,
    interactive: values.interactive,
    case: values.case !== 'false',
    multilineStrings: values['multiline-strings'] !== 'false',
    banner: values.banner,
    statistics: values.statistics,
    list: values.list,
    loader: createHostLoader( { snolib: values.snolib } ),
    stdinReader,
} );

process.exitCode = result.exitCode;
