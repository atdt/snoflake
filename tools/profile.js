#!/usr/bin/env node
'use strict';

// CPU profile a Snoflake run with V8's sampler.
//
// Wraps bench-snoflake.js --mode=vm so the work happens inside a single
// process (lots of samples, no per-fixture startup noise) and writes
// human-readable artifacts under tmp/profiles/.
//
// Two runtimes:
//
//   deno (default) -- spawns
//     `deno run -A --cpu-prof --cpu-prof-flamegraph --cpu-prof-md ...`
//     and emits three sibling files sharing one basename:
//       <basename>.cpuprofile  raw V8 profile (Chrome DevTools, speedscope)
//       <basename>.svg         flamegraph
//       <basename>.md          markdown report (also tailed to stdout)
//
//   node                -- spawns `node --prof ...` and post-processes the
//     resulting isolate-*.log with `node --prof-process` into a single
//     tick-sampled text report.
//
// Usage:
//   node tools/profile.js                                # deno, default suite
//   node tools/profile.js --runtime=node                 # legacy node path
//   node tools/profile.js kalah-opening-search           # one fixture
//   node tools/profile.js tmp/probe.sno                  # ad hoc SNOBOL file
//   node tools/profile.js --iterations=10 wang-theorem-prover
//   node tools/profile.js --output=tmp/profiles/foo.md   # custom path
//
// Everything other than --runtime and --output is forwarded verbatim to
// bench-snoflake.js (try --help on it for the full option list).

import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
      ROOT = path.join( __dirname, '..' ),
      PROFILES_DIR = path.join( ROOT, 'tmp', 'profiles' ),
      BENCH = path.join( ROOT, 'tools', 'bench-snoflake.js' );

const DEFAULTS = [
    '--mode=vm',
    '--samples=3',
    '--warmup=1',
    '--iterations=3',
];

const RUNTIMES = new Set( [ 'deno', 'node' ] );

function splitArgs( argv ) {
    const forwarded = [];
    let output = null,
        runtime = 'deno';

    for ( const arg of argv ) {
        if ( arg === '--help' || arg === '-h' ) {
            usage();
            process.exit( 0 );
        }
        if ( arg.startsWith( '--output=' ) ) {
            output = path.resolve( arg.slice( '--output='.length ) );
            continue;
        }
        if ( arg.startsWith( '--runtime=' ) ) {
            runtime = arg.slice( '--runtime='.length );
            if ( !RUNTIMES.has( runtime ) ) {
                throw new Error( '--runtime must be one of: ' + [ ...RUNTIMES ].join( ', ' ) );
            }
            continue;
        }
        forwarded.push( arg );
    }

    return { forwarded, output, runtime };
}

function usage() {
    console.log( [
        'Usage: node tools/profile.js [--runtime=deno|node] [--output=PATH] [bench options ...]',
        '',
        'Captures a CPU profile of bench-snoflake.js --mode=vm. With --runtime=deno',
        '(the default) writes <basename>.{cpuprofile,svg,md} via Deno\'s V8 profiler.',
        'With --runtime=node, writes a tick-processed .txt via node --prof.',
        '',
        'Anything other than --runtime and --output is forwarded to bench-snoflake.js',
        '(try --help on it). Explicit .sno paths run as ad hoc programs.',
        '',
        'Defaults: ' + DEFAULTS.join( ' ' )
    ].join( '\n' ) );
}

function timestamp() {
    return new Date().toISOString().replace( /[:.]/g, '-' ).replace( /Z$/, '' );
}

// Split a user-supplied --output path into the (dir, basename) Deno needs.
// Strips a trailing known artifact extension so --output=foo.md and
// --output=foo both yield basename "foo".
function splitOutput( output ) {
    const dir = path.dirname( output ),
          ext = path.extname( output ),
          stripped = [ '.md', '.svg', '.cpuprofile' ].includes( ext ),
          basename = stripped ? path.basename( output, ext ) : path.basename( output );
    return { dir, basename };
}

function runDeno( forwarded, output ) {
    const target = output ? splitOutput( output )
                          : { dir: PROFILES_DIR, basename: timestamp() };
    fs.mkdirSync( target.dir, { recursive: true } );

    const result = childProcess.spawnSync(
        'deno',
        [
            'run', '-A',
            '--cpu-prof',
            '--cpu-prof-flamegraph',
            '--cpu-prof-md',
            '--cpu-prof-interval=100',
            '--cpu-prof-dir=' + target.dir,
            '--cpu-prof-name=' + target.basename + '.cpuprofile',
            BENCH, ...DEFAULTS, ...forwarded
        ],
        { stdio: [ 'ignore', 'ignore', 'inherit' ] }
    );
    if ( result.error ) {
        if ( result.error.code === 'ENOENT' ) {
            throw new Error( 'deno not found on PATH; install Deno or use --runtime=node' );
        }
        throw result.error;
    }
    if ( result.status !== 0 ) {
        throw new Error( 'bench-snoflake.js exited with status ' + result.status );
    }

    const base = path.join( target.dir, target.basename ),
          paths = {
              cpuprofile: base + '.cpuprofile',
              svg:        base + '.svg',
              md:         base + '.md'
          };

    const md = fs.readFileSync( paths.md, 'utf8' );
    process.stdout.write( md.split( '\n' ).slice( 0, 60 ).join( '\n' ) + '\n' );
    console.log( '\n--- artifacts:' );
    for ( const [ , p ] of Object.entries( paths ) ) {
        console.log( '    ' + path.relative( ROOT, p ) );
    }
}

function readIsolates( dir ) {
    if ( !fs.existsSync( dir ) ) return new Set();
    return new Set(
        fs.readdirSync( dir ).filter( name =>
            name.startsWith( 'isolate-' ) && name.endsWith( '-v8.log' )
        )
    );
}

function runNode( forwarded, output ) {
    fs.mkdirSync( PROFILES_DIR, { recursive: true } );
    const before = readIsolates( PROFILES_DIR );

    const benchResult = childProcess.spawnSync(
        process.execPath,
        [ '--prof', BENCH, ...DEFAULTS, ...forwarded ],
        { cwd: PROFILES_DIR, stdio: [ 'ignore', 'ignore', 'inherit' ] }
    );
    if ( benchResult.error ) throw benchResult.error;
    if ( benchResult.status !== 0 ) {
        throw new Error( 'bench-snoflake.js exited with status ' + benchResult.status );
    }

    const after = readIsolates( PROFILES_DIR ),
          created = [ ...after ].filter( name => !before.has( name ) );
    if ( created.length === 0 ) {
        throw new Error( 'no new isolate-*.log appeared in ' + PROFILES_DIR );
    }
    if ( created.length > 1 ) {
        console.error( 'warning: multiple new isolate logs (%d); using the largest', created.length );
    }
    created.sort( ( a, b ) => fs.statSync( path.join( PROFILES_DIR, b ) ).size
                              - fs.statSync( path.join( PROFILES_DIR, a ) ).size );
    const isolatePath = path.join( PROFILES_DIR, created[ 0 ] );

    const procResult = childProcess.spawnSync(
        process.execPath,
        [ '--prof-process', isolatePath ],
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
    );
    if ( procResult.error ) throw procResult.error;
    if ( procResult.status !== 0 ) {
        throw new Error( '--prof-process exited with status ' + procResult.status + '\n' + procResult.stderr );
    }

    const reportPath = output || path.join( PROFILES_DIR, timestamp() + '.txt' );
    fs.writeFileSync( reportPath, procResult.stdout );
    for ( const name of created ) {
        fs.unlinkSync( path.join( PROFILES_DIR, name ) );
    }

    process.stdout.write( procResult.stdout.split( '\n' ).slice( 0, 60 ).join( '\n' ) + '\n' );
    console.log( '\n--- full report: ' + path.relative( ROOT, reportPath ) );
}

function main() {
    const { forwarded, output, runtime } = splitArgs( process.argv.slice( 2 ) );
    if ( runtime === 'deno' ) {
        runDeno( forwarded, output );
    } else {
        runNode( forwarded, output );
    }
}

main();
