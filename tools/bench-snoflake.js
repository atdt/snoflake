#!/usr/bin/env node
'use strict';

// Benchmark Snoflake across a representative loop of program fixtures.
//
// The harness is designed for comparing local optimization branches:
//   node tools/bench-snoflake.js
//   node tools/bench-snoflake.js --root=tmp/worktree-before
//   node tools/bench-snoflake.js --mode=cli --samples=5 --iterations=3
//   node tools/bench-snoflake.js --all --json=tmp/bench.json
//   node tools/bench-snoflake.js tmp/probe.sno
//
// VM mode imports Snoflake once, then times repeated VM construction +
// execution. CLI mode times cold process runs. Each sample runs every selected
// fixture in a loop, so the reported aggregate is less sensitive to a single
// tiny program or one process-startup outlier.

import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import process from 'node:process';
import { parseHeader, loadCases } from '../test/program-fixture.js';
import { createHostLoader } from '../src/host.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
      ROOT = path.join( __dirname, '..' ),
      TMP_DIR = path.join( ROOT, 'tmp', 'bench-snoflake' );

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
    'word-ending-analysis'
];

function parseArgs( argv ) {
    const opts = {
        root: ROOT,
        mode: 'vm',
        samples: 9,
        iterations: 5,
        warmup: 2,
        json: null,
        all: false,
        fixtures: []
    };

    for ( const arg of argv ) {
        if ( arg === '--help' || arg === '-h' ) {
            usage();
            process.exit( 0 );
        }
        if ( arg === '--all' ) {
            opts.all = true;
            continue;
        }
        if ( arg.startsWith( '--' ) ) {
            const [ key, raw = 'true' ] = arg.slice( 2 ).split( '=', 2 );
            if ( key === 'samples' || key === 'iterations' || key === 'warmup' ) {
                opts[ key ] = parsePositiveInt( key, raw );
            } else if ( key === 'root' ) {
                opts.root = path.resolve( raw );
            } else if ( key === 'mode' ) {
                if ( raw !== 'vm' && raw !== 'cli' ) {
                    throw new Error( '--mode must be vm or cli' );
                }
                opts.mode = raw;
            } else if ( key === 'json' ) {
                opts.json = path.resolve( raw );
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
        'Usage: node tools/bench-snoflake.js [options] [fixture ...]',
        '',
        'Options:',
        '  --mode=vm|cli        vm imports once; cli measures cold process runs (default vm)',
        '  --root=PATH          repository/worktree to benchmark (default current repo)',
        '  --samples=N          measured aggregate samples (default 9)',
        '  --iterations=N       fixture loop repetitions per sample (default 5)',
        '  --warmup=N           untimed aggregate warmups (default 2)',
        '  --all                use every test/programs/*.sno fixture',
        '  --json=PATH          also write machine-readable results',
        '',
        'Fixture names may be bare names such as kalah-opening-search.',
        'Explicit .sno paths may also be profiled.'
    ].join( '\n' ) );
}

function parsePositiveInt( key, raw ) {
    const n = Number( raw );
    if ( !Number.isInteger( n ) || n < 0 ) {
        throw new Error( '--' + key + ' must be a non-negative integer' );
    }
    return n;
}

function isExplicitPath( name ) {
    return name.endsWith( '.sno' ) ||
        name.includes( path.sep ) ||
        ( path.sep === '\\' && name.includes( '/' ) );
}

function fixturePath( root, name ) {
    if ( isExplicitPath( name ) ) {
        return {
            filePath: path.isAbsolute( name ) ? name : path.join( root, name ),
            allowAdHoc: true
        };
    }
    return {
        filePath: path.join( root, 'test', 'programs', name + '.sno' ),
        allowAdHoc: false
    };
}

function selectedFixtures( opts ) {
    if ( opts.all ) {
        return loadCases().map( file => ( {
            filePath: path.join( opts.root, 'test', 'programs', path.basename( file ) ),
            allowAdHoc: false
        } ) );
    }
    const names = opts.fixtures.length ? opts.fixtures : DEFAULT_FIXTURES;
    return names.map( name => fixturePath( opts.root, name ) );
}

function makeAdHocHeader( filePath ) {
    return {
        title: path.basename( filePath ),
        options: {},
        input: null
    };
}

function loadHeader( selected ) {
    try {
        return parseHeader( selected.filePath );
    } catch ( e ) {
        if (
            selected.allowAdHoc &&
            /\bmissing required @title\b/.test( e.message )
        ) {
            return makeAdHocHeader( selected.filePath );
        }
        throw e;
    }
}

function captureWriter() {
    const lines = [];
    return {
        lines,
        write( line ) { lines.push( line ); }
    };
}

function prepareFixtures( opts ) {
    fs.mkdirSync( TMP_DIR, { recursive: true } );

    return selectedFixtures( opts ).map( function ( selected ) {
        const filePath = selected.filePath,
              header = loadHeader( selected ),
              name = path.basename( filePath, '.sno' );
        let inputPath = null;

        if ( header.input !== null ) {
            inputPath = path.join( TMP_DIR, name + '.input' );
            fs.writeFileSync( inputPath, header.input );
        }

        return { name, filePath, header, inputPath };
    } );
}

async function createRunner( opts ) {
    if ( opts.mode === 'cli' ) {
        return fixture => runCli( opts, fixture );
    }

    const SNOBOL = await import(
        pathToFileURL( path.join( opts.root, 'src', 'snobol.js' ) ).href + '?bench=' + Date.now()
    );

    return fixture => runVm( SNOBOL, fixture );
}

const hostLoader = createHostLoader();

function runVm( SNOBOL, fixture ) {
    const stdout = captureWriter(),
          stderr = captureWriter(),
          vm = SNOBOL.createVM( {
              ...fixture.header.options,
              file: fixture.filePath,
              input: fixture.inputPath || undefined,
              loader: hostLoader,
              stdout,
              stderr
          } );

    vm.run( SNOBOL.image );
}

function optionArgs( options ) {
    const args = [];
    for ( const [ key, value ] of Object.entries( options ) ) {
        if ( value === true ) {
            args.push( '--' + key );
        } else {
            args.push( '--' + key + '=' + String( value ) );
        }
    }
    return args;
}

function runCli( opts, fixture ) {
    const args = [
        path.join( opts.root, 'bin', 'snoflake.js' ),
        '--file=' + fixture.filePath,
        ...optionArgs( fixture.header.options )
    ];

    if ( fixture.inputPath ) {
        args.push( '--input=' + fixture.inputPath );
    }

    const result = childProcess.spawnSync( process.execPath, args, {
        cwd: opts.root,
        encoding: 'utf8',
        timeout: 120000,
        maxBuffer: 64 * 1024 * 1024
    } );

    if ( result.error ) {
        throw result.error;
    }
}

function timeNs( fn ) {
    const start = process.hrtime.bigint();
    fn();
    return process.hrtime.bigint() - start;
}

function stats( values ) {
    const sorted = values.slice().sort( ( a, b ) => a - b ),
          n = sorted.length,
          mean = values.reduce( ( sum, value ) => sum + value, 0 ) / n,
          medianValue = percentile( sorted, 0.50 ),
          variance = values.reduce( ( sum, value ) => sum + ( value - mean ) ** 2, 0 ) / n;

    return {
        min: sorted[ 0 ],
        median: medianValue,
        mean,
        p90: percentile( sorted, 0.90 ),
        p99: percentile( sorted, 0.99 ),
        max: sorted[ n - 1 ],
        stddev: Math.sqrt( variance ),
        rsd: mean === 0 ? 0 : Math.sqrt( variance ) / mean
    };
}

function percentile( sorted, p ) {
    return sorted[ Math.floor( ( sorted.length - 1 ) * p ) ];
}

function ms( ns ) {
    return Number( ns ) / 1e6;
}

function fmtMs( value ) {
    return value.toFixed( 3 ).padStart( 10 );
}

function runSuiteSample( fixtures, runner, opts, sampleIndex, measured ) {
    const totals = new Map( fixtures.map( fixture => [ fixture.name, 0n ] ) );
    let aggregate = 0n;

    for ( let iteration = 0; iteration < opts.iterations; iteration++ ) {
        for ( const fixture of fixtures ) {
            const elapsed = timeNs( function () {
                runner( fixture );
            } );

            totals.set( fixture.name, totals.get( fixture.name ) + elapsed );
            aggregate += elapsed;
        }
    }

    if ( measured ) {
        console.error( 'sample %d/%d: %s ms',
            sampleIndex + 1,
            opts.samples,
            fmtMs( ms( aggregate ) ).trim()
        );
    }

    return { aggregate, totals };
}

async function main() {
    const opts = parseArgs( process.argv.slice( 2 ) ),
          fixtures = prepareFixtures( opts ),
          runner = await createRunner( opts );

    console.error( 'mode=%s root=%s', opts.mode, opts.root );
    console.error(
        'fixtures=%d iterations=%d warmup=%d samples=%d',
        fixtures.length,
        opts.iterations,
        opts.warmup,
        opts.samples,
    );

    for ( let i = 0; i < opts.warmup; i++ ) {
        runSuiteSample( fixtures, runner, opts, i, false );
    }

    const aggregateSamples = [],
          byProgram = new Map( fixtures.map( fixture => [ fixture.name, [] ] ) );

    for ( let i = 0; i < opts.samples; i++ ) {
        const sample = runSuiteSample( fixtures, runner, opts, i, true );
        aggregateSamples.push( ms( sample.aggregate ) );
        for ( const [ name, total ] of sample.totals ) {
            byProgram.get( name ).push( ms( total ) / opts.iterations );
        }
    }

    const result = {
        meta: {
            mode: opts.mode,
            root: opts.root,
            node: process.version,
            platform: os.platform() + '-' + os.arch(),
            samples: opts.samples,
            iterations: opts.iterations,
            warmup: opts.warmup,
            fixtureCount: fixtures.length
        },
        aggregate: stats( aggregateSamples ),
        programs: fixtures.map( function ( fixture ) {
            return {
                name: fixture.name,
                title: fixture.header.title,
                perRunMs: stats( byProgram.get( fixture.name ) )
            };
        } )
    };

    printReport( result );

    if ( opts.json ) {
        fs.mkdirSync( path.dirname( opts.json ), { recursive: true } );
        fs.writeFileSync( opts.json, JSON.stringify( result, null, 2 ) + '\n' );
    }
}

function printReport( result ) {
    const a = result.aggregate;

    console.log( '# Snoflake benchmark' );
    console.log();
    console.log( '- mode: `%s`', result.meta.mode );
    console.log( '- root: `%s`', result.meta.root );
    console.log( '- samples: `%d`', result.meta.samples );
    console.log( '- iterations per sample: `%d`', result.meta.iterations );
    console.log( '- fixtures: `%d`', result.meta.fixtureCount );
    console.log();
    console.log( 'Aggregate sample time, all fixture runs:' );
    console.log( '- min:    `%s ms`', fmtMs( a.min ).trim() );
    console.log( '- median: `%s ms`', fmtMs( a.median ).trim() );
    console.log( '- mean:   `%s ms`', fmtMs( a.mean ).trim() );
    console.log( '- p90:    `%s ms`', fmtMs( a.p90 ).trim() );
    console.log( '- rsd:    `%s`', a.rsd.toFixed( 3 ) );
    console.log();
    console.log( '| fixture | median ms/run | p90 | rsd |' );
    console.log( '|---|---:|---:|---:|' );
    for ( const program of result.programs ) {
        const s = program.perRunMs;
        console.log( '| `%s` | %s | %s | %s |',
            program.name,
            fmtMs( s.median ).trim(),
            fmtMs( s.p90 ).trim(),
            s.rsd.toFixed( 3 )
        );
    }
}

main().catch( function ( e ) {
    console.error( e && e.stack || e );
    process.exitCode = 1;
} );
