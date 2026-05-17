#!/usr/bin/env node
'use strict';

// CPU profile a Snoflake run with V8's tick sampler.
//
// Wraps `node --prof tools/bench-snoflake.js --mode=vm ...` so the work
// happens inside a single Node process (lots of samples, no per-fixture
// startup noise), then post-processes the isolate log into a readable
// report.
//
// Usage:
//   node tools/profile.js                                # default fixture suite
//   node tools/profile.js kalah-opening-search           # one fixture
//   node tools/profile.js tmp/probe.sno                  # ad hoc SNOBOL file
//   node tools/profile.js --iterations=10 wang-theorem-prover
//   node tools/profile.js --output=tmp/profiles/foo.txt  # custom report path
//
// All options other than --output are forwarded verbatim to
// bench-snoflake.js, so anything that script accepts (--samples,
// --iterations, --warmup, --all, --root, fixture names, .sno paths, etc.)
// works here.
//
// Reads tmp/profiles/<timestamp>.txt for the post-processed report and
// prints its first 60 lines (Summary + JavaScript hot list).

import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
      ROOT = path.join( __dirname, '..' ),
      PROFILES_DIR = path.join( ROOT, 'tmp', 'profiles' ),
      BENCH = path.join( ROOT, 'tools', 'bench-snoflake.js' );

const DEFAULTS = [ '--mode=vm', '--samples=3', '--warmup=1', '--iterations=3' ];

function splitArgs( argv ) {
    const forwarded = [];
    let output = null;

    for ( const arg of argv ) {
        if ( arg === '--help' || arg === '-h' ) {
            usage();
            process.exit( 0 );
        }
        if ( arg.startsWith( '--output=' ) ) {
            output = path.resolve( arg.slice( '--output='.length ) );
            continue;
        }
        forwarded.push( arg );
    }

    return { forwarded, output };
}

function usage() {
    console.log( [
        'Usage: node tools/profile.js [--output=PATH] [bench-snoflake.js options ...]',
        '',
        'Captures a V8 tick profile of bench-snoflake.js --mode=vm and writes a',
        'tick-processed report. Anything other than --output is forwarded to',
        'bench-snoflake.js (try --help on it to see those options). Explicit',
        '.sno paths run as ad hoc programs with validation disabled by default.',
        '',
        'Defaults: ' + DEFAULTS.join( ' ' )
    ].join( '\n' ) );
}

function timestamp() {
    return new Date().toISOString().replace( /[:.]/g, '-' ).replace( /Z$/, '' );
}

function takenSnapshot( before, after ) {
    return [ ...after ].filter( name => !before.has( name ) );
}

function readIsolates( dir ) {
    if ( !fs.existsSync( dir ) ) {
        return new Set();
    }
    return new Set( fs.readdirSync( dir ).filter( name => name.startsWith( 'isolate-' ) && name.endsWith( '-v8.log' ) ) );
}

function runBench( forwarded ) {
    const result = childProcess.spawnSync(
        process.execPath,
        [ '--prof', BENCH, ...DEFAULTS, ...forwarded ],
        { cwd: PROFILES_DIR, stdio: [ 'ignore', 'ignore', 'inherit' ] }
    );
    if ( result.error ) {
        throw result.error;
    }
    if ( result.status !== 0 ) {
        throw new Error( 'bench-snoflake.js exited with status ' + result.status );
    }
}

function processIsolate( isolatePath ) {
    const result = childProcess.spawnSync(
        process.execPath,
        [ '--prof-process', isolatePath ],
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
    );
    if ( result.error ) {
        throw result.error;
    }
    if ( result.status !== 0 ) {
        throw new Error( '--prof-process exited with status ' + result.status + '\n' + result.stderr );
    }
    return result.stdout;
}

function main() {
    const { forwarded, output } = splitArgs( process.argv.slice( 2 ) );

    fs.mkdirSync( PROFILES_DIR, { recursive: true } );
    const before = readIsolates( PROFILES_DIR );

    runBench( forwarded );

    const after = readIsolates( PROFILES_DIR );
    const created = takenSnapshot( before, after );
    if ( created.length === 0 ) {
        throw new Error( 'no new isolate-*.log appeared in ' + PROFILES_DIR );
    }
    if ( created.length > 1 ) {
        console.error( 'warning: multiple new isolate logs (%d); using the largest', created.length );
    }
    created.sort( ( a, b ) => fs.statSync( path.join( PROFILES_DIR, b ) ).size
                              - fs.statSync( path.join( PROFILES_DIR, a ) ).size );
    const isolatePath = path.join( PROFILES_DIR, created[ 0 ] );

    const report = processIsolate( isolatePath );
    const reportPath = output || path.join( PROFILES_DIR, timestamp() + '.txt' );
    fs.writeFileSync( reportPath, report );

    for ( const name of created ) {
        fs.unlinkSync( path.join( PROFILES_DIR, name ) );
    }

    process.stdout.write( report.split( '\n' ).slice( 0, 60 ).join( '\n' ) + '\n' );
    console.log( '\n--- full report: ' + path.relative( ROOT, reportPath ) );
}

main();
