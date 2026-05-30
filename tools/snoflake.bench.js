'use strict';

// Benchmark Snoflake with Deno.bench.
//
//   deno bench -A tools/snoflake.bench.js
//   deno bench -A tools/snoflake.bench.js -- kalah-opening-search n-queens
//   deno bench -A tools/snoflake.bench.js -- --all
//   deno bench --json -A tools/snoflake.bench.js > tmp/bench.json
//
// To compare a worktree against this checkout, point --baseline at it. Each
// fixture becomes a Deno.bench group with two entries, and Deno prints the
// relative speedup in its summary table:
//
//   deno bench -A tools/snoflake.bench.js -- --baseline=../snoflake-main
//
// Each benchmark builds a fresh VM and runs one fixture to completion, so the
// reported time is Snoflake's per-program construction + execution cost. Deno
// handles warmup, sampling, and the percentile statistics; this file only
// wires fixtures to the runtime. Process-level cold-start timing lives in
// tools/bench-vs-csnobol4.js, which Deno.bench is not suited to measure.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadCases, parseHeader } from '../test/program-fixture.js';
import { createHostLoader } from '../src/host.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
    ROOT = path.join( __dirname, '..' ),
    TMP_DIR = path.join( ROOT, 'tmp', 'snoflake-bench' );

const DEFAULT_FIXTURES = [
    'arbitrarily-long-integers',
    'bubble-sort',
    'hoare-quicksort',
    'input-output-streams',
    'kalah-opening-search',
    'n-queens',
    'recursive-balanced-pattern',
    'scanner-behavior',
    'string-functions',
    'syntactic-recognizer',
    'topological-sort',
    'wang-theorem-prover',
    'word-ending-analysis',
];

function parseArgs( argv ) {
    const opts = { root: ROOT, baseline: null, all: false, fixtures: [] };

    for ( const arg of argv ) {
        if ( arg === '--help' || arg === '-h' ) {
            usage();
            Deno.exit( 0 );
        } else if ( arg === '--all' ) {
            opts.all = true;
        } else if ( arg.startsWith( '--root=' ) ) {
            opts.root = path.resolve( arg.slice( '--root='.length ) );
        } else if ( arg.startsWith( '--baseline=' ) ) {
            opts.baseline = path.resolve( arg.slice( '--baseline='.length ) );
        } else if ( arg.startsWith( '--' ) ) {
            throw new Error( 'unknown option ' + arg );
        } else {
            opts.fixtures.push( arg );
        }
    }

    return opts;
}

function usage() {
    console.log( [
        'Usage: deno bench -A tools/snoflake.bench.js -- [options] [fixture ...]',
        '',
        'Options:',
        '  --all              benchmark every test/programs/*.sno fixture',
        '  --root=PATH        runtime to benchmark (default this checkout)',
        '  --baseline=PATH    second runtime to compare each fixture against',
        '',
        'Fixtures are bare names such as kalah-opening-search, or .sno paths.',
    ].join( '\n' ) );
}

function selectedFixtures( opts ) {
    if ( opts.all ) {
        return loadCases().map( ( file ) => path.basename( file, '.sno' ) );
    }
    return opts.fixtures.length ? opts.fixtures : DEFAULT_FIXTURES;
}

function fixturePath( name ) {
    if ( name.endsWith( '.sno' ) || name.includes( path.sep ) ) {
        return path.isAbsolute( name ) ? name : path.join( ROOT, name );
    }
    return path.join( ROOT, 'test', 'programs', name + '.sno' );
}

// Materialize the @input block to a file once, up front; the VM reads it by
// path. Fixtures without input return a null inputPath.
function prepareFixture( name ) {
    const filePath = fixturePath( name ),
        header = parseHeader( filePath );
    let inputPath = null;

    if ( header.input !== null ) {
        inputPath = path.join( TMP_DIR, path.basename( filePath ) + '.input' );
        fs.writeFileSync( inputPath, header.input );
    }

    return {
        name: path.basename( filePath, '.sno' ),
        filePath,
        header,
        inputPath,
    };
}

// Discard runtime output: capturing every line across thousands of bench
// iterations would only measure array growth.
const sink = { write() {} };

function makeRun( SNOBOL, loader, fixture ) {
    return function () {
        const vm = SNOBOL.createVM( {
            ...fixture.header.options,
            file: fixture.filePath,
            input: fixture.inputPath || undefined,
            loader,
            stdout: sink,
            stderr: sink,
        } );
        vm.run( SNOBOL.image );
    };
}

async function loadRuntime( root ) {
    // Cache-bust so --root and --baseline resolve to distinct module
    // instances even when one path lies inside the other.
    const url = pathToFileURL( path.join( root, 'src', 'snobol.js' ) ).href;
    return await import( url + '?bench=' + encodeURIComponent( root ) );
}

const opts = parseArgs( Deno.args );

fs.mkdirSync( TMP_DIR, { recursive: true } );

// Resolve -INCLUDE/INPUT lookups the way the program tests do, so fixtures
// that pull in the shared gimpel library benchmark correctly.
const loader = createHostLoader( {
    snolib: [ path.join( ROOT, 'test', 'programs', 'gimpel' ) ],
} );

const fixtures = selectedFixtures( opts ).map( prepareFixture );
const primary = await loadRuntime( opts.root );
const baseline = opts.baseline ? await loadRuntime( opts.baseline ) : null;

for ( const fixture of fixtures ) {
    if ( baseline ) {
        Deno.bench( {
            name: 'baseline (' + path.basename( opts.baseline ) + ')',
            group: fixture.name,
            baseline: true,
            fn: makeRun( baseline, loader, fixture ),
        } );
        Deno.bench( {
            name: 'root (' + path.basename( opts.root ) + ')',
            group: fixture.name,
            fn: makeRun( primary, loader, fixture ),
        } );
    } else {
        Deno.bench( fixture.name, makeRun( primary, loader, fixture ) );
    }
}
