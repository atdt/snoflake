#!/usr/bin/env node
'use strict';

// Rough wall-clock comparison: Snoflake (node bin/snoflake.js) vs CSNOBOL4
// (snobol4 -b) on a hand-picked set of heavier program fixtures.
//
// Usage:
//   node tools/bench-vs-csnobol4.js                                  # default fixture list
//   node tools/bench-vs-csnobol4.js name1 name2 ...                  # custom fixtures
//   node tools/bench-vs-csnobol4.js --iterations=5                   # repeats per fixture
//   node tools/bench-vs-csnobol4.js --snobol4=/opt/snobol4/bin/snobol4
//
// Reports min/median wall time per fixture and an overall ratio. Node has
// ~80-100ms of fixed interpreter startup that CSNOBOL4 does not, so small
// fixtures look worse for Snoflake than the VM's actual hot-path cost.

import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { parseHeader } from '../test/program-fixture.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
      ROOT = path.join( __dirname, '..' );

const DEFAULT_FIXTURES = [
    'kalah-opening-search',
    'wang-theorem-prover',
    'hoare-quicksort',
    'syntactic-recognizer',
    'word-ending-analysis',
    'isogram',
    'topological-sort',
    'bubble-sort',
    'tower-of-hanoi',
    'recursive-balanced-pattern'
];

function parseArgs( argv ) {
    const opts = {
        root: ROOT,
        iterations: 3,
        snobol4: 'snobol4',
        fixtures: []
    };

    for ( const arg of argv ) {
        if ( arg === '--help' || arg === '-h' ) {
            usage();
            process.exit( 0 );
        }
        if ( arg.startsWith( '--' ) ) {
            const [ key, raw = 'true' ] = arg.slice( 2 ).split( '=', 2 );
            if ( key === 'iterations' ) {
                opts.iterations = parsePositiveInt( key, raw );
            } else if ( key === 'root' ) {
                opts.root = path.resolve( raw );
            } else if ( key === 'snobol4' ) {
                opts.snobol4 = raw;
            } else {
                throw new Error( 'unknown option --' + key );
            }
            continue;
        }
        opts.fixtures.push( arg );
    }

    return opts;
}

function usage() {
    console.log( [
        'Usage: node tools/bench-vs-csnobol4.js [options] [fixture ...]',
        '',
        'Options:',
        '  --iterations=N       repeats per fixture (default 3)',
        '  --root=PATH          repository/worktree to benchmark (default current repo)',
        '  --snobol4=PATH       CSNOBOL4 executable (default `snobol4` on PATH)',
        '',
        'Fixture names may be bare names such as kalah-opening-search or paths.'
    ].join( '\n' ) );
}

function parsePositiveInt( key, raw ) {
    const n = Number( raw );
    if ( !Number.isInteger( n ) || n < 0 ) {
        throw new Error( '--' + key + ' must be a non-negative integer' );
    }
    return n;
}

function fixturePath( root, name ) {
    if ( name.endsWith( '.sno' ) || name.includes( path.sep ) ) {
        return path.isAbsolute( name ) ? name : path.join( root, name );
    }
    return path.join( root, 'test', 'programs', name + '.sno' );
}

function median( xs ) {
    const sorted = xs.slice().sort( ( a, b ) => a - b );
    const mid = sorted.length >> 1;
    return sorted.length % 2 ? sorted[ mid ] : ( sorted[ mid - 1 ] + sorted[ mid ] ) / 2;
}

function timeRun( cmd, args, input, cwd ) {
    const start = process.hrtime.bigint();
    const r = childProcess.spawnSync( cmd, args, {
        cwd: cwd,
        input: input || '',
        encoding: 'utf8',
        timeout: 60000,
        maxBuffer: 64 * 1024 * 1024
    } );
    const ns = Number( process.hrtime.bigint() - start );
    if ( r.error ) {
        throw new Error( cmd + ': ' + r.error.message );
    }
    if ( r.status !== 0 ) {
        const tail = ( r.stderr || Buffer.alloc( 0 ) ).toString( 'utf8' ).slice( -200 );
        throw new Error( cmd + ' exited ' + r.status + ': ' + tail );
    }
    return ns / 1e6;
}

function bench( opts, name ) {
    const filePath = fixturePath( opts.root, name );
    const header = parseHeader( filePath );
    const input = header.input || '';
    const snoflake = path.join( opts.root, 'bin', 'snoflake.js' );

    const csTimes = [];
    const sfTimes = [];
    for ( let i = 0; i < opts.iterations; i++ ) {
        csTimes.push(
            timeRun( opts.snobol4, [ '-b', filePath ], input, opts.root ),
        );
        sfTimes.push(
            timeRun(
                process.execPath,
                [ snoflake, filePath ],
                input,
                opts.root,
            ),
        );
    }
    return {
        name: name,
        csMin: Math.min( ...csTimes ),
        csMed: median( csTimes ),
        sfMin: Math.min( ...sfTimes ),
        sfMed: median( sfTimes ),
    };
}

function fmt( ms ) {
    return ( ms < 1000
        ? ms.toFixed( 0 ) + ' ms'
        : ( ms / 1000 ).toFixed( 2 ) + ' s' ).padStart( 9 );
}

function main() {
    const opts = parseArgs( process.argv.slice( 2 ) );
    const fixtures = opts.fixtures.length ? opts.fixtures : DEFAULT_FIXTURES;
    const snoflake = path.join( opts.root, 'bin', 'snoflake.js' );

    // Calibrate node startup with an empty program so the operator can mentally
    // subtract it from Snoflake's wall time.
    const emptyPath = path.join( opts.root, 'tmp', 'bench-empty.sno' );
    fs.mkdirSync( path.dirname( emptyPath ), { recursive: true } );
    fs.writeFileSync( emptyPath, 'END\n' );
    const startupTimes = [];
    const csStartup = [];
    for ( let i = 0; i < opts.iterations; i++ ) {
        startupTimes.push( timeRun( process.execPath, [ snoflake, emptyPath ], '', opts.root ) );
        csStartup.push( timeRun( opts.snobol4, [ '-b', emptyPath ], '', opts.root ) );
    }

    console.log( 'iterations: %d', opts.iterations );
    console.log( 'empty-program wall time (≈ startup + assembly):' );
    console.log( '  csnobol4 -b END.sno : %s (min)', fmt( Math.min( ...csStartup ) ) );
    console.log( '  snoflake END.sno    : %s (min)', fmt( Math.min( ...startupTimes ) ) );
    console.log();

    const header = [ 'fixture', 'csnobol4 (min)', 'snoflake (min)', 'ratio' ];
    const widths = [ 32, 14, 14, 8 ];
    function row( cells ) {
        return cells.map( ( c, i ) => String( c ).padEnd( widths[ i ] ) ).join( '  ' );
    }
    console.log( row( header ) );
    console.log( row( widths.map( w => '-'.repeat( w ) ) ) );

    const totals = { cs: 0, sf: 0 };
    for ( const name of fixtures ) {
        try {
            const r = bench( opts, name );
            totals.cs += r.csMin;
            totals.sf += r.sfMin;
            console.log( row( [
                r.name,
                fmt( r.csMin ),
                fmt( r.sfMin ),
                ( r.sfMin / r.csMin ).toFixed( 1 ) + 'x'
            ] ) );
        } catch ( e ) {
            console.log( row( [ name, 'ERR', 'ERR', '-' ] ) + '  ' + e.message );
        }
    }
    console.log();
    console.log(
        'aggregate (sum of mins): csnobol4 %s  snoflake %s  ratio %sx',
        fmt( totals.cs ),
        fmt( totals.sf ),
        ( totals.sf / totals.cs ).toFixed( 1 ),
    );
}

main();
