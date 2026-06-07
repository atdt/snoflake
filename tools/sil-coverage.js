#!/usr/bin/env node
'use strict';

// Trace which SIL instructions in the assembled SNOBOL4 image are executed by
// the program-level test fixtures, and report the parts of the runtime the
// suite never reaches.
//
//   node tools/sil-coverage.js              run every fixture, print a summary
//   node tools/sil-coverage.js --procs      also list every procedure
//   node tools/sil-coverage.js --json=PATH  also write machine-readable output
//
// What "coverage" means here. The assembled image's instruction list (see
// src/generated-snobol-image.json) is the SNOBOL4 system itself -- its compiler
// and runtime, expressed as SIL macro calls. A user's SNOBOL program is
// compiled into data the system interprets; it never adds instructions to that
// list. So the instruction array is fixed, and "covered" means a given SIL
// instruction in the SNOBOL4 stream executed at least once while the fixtures
// ran. This is distinct from coverage of the JS macro *implementations* in
// src/sil.js: a macro may be thoroughly unit-tested yet only ever invoked from
// instructions the fixtures never reach.
//
// Mapping back to source. tools/sil-source-map.js re-scans the SIL to recover
// each slot's line number, opcode, comment, and enclosing PROC so the report
// can name the routines that never run.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { createVM, image, VM } from '../src/snobol.js';
import { createHostLoader } from '../src/host.js';
import { loadCases, parseHeader } from '../test/program-fixture.js';
import { buildSourceMap } from './sil-source-map.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
    ROOT = path.join( __dirname, '..' ),
    SIL_PATH = path.join( ROOT, 'external', 'v311-snoflake.sil' ),
    PROGRAMS_DIR = path.join( ROOT, 'test', 'programs' ),
    GIMPEL_LIB_DIR = path.join( PROGRAMS_DIR, 'gimpel' ),
    TMP_DIR = path.join( ROOT, 'tmp', 'sil-coverage' );

// Per-slot execution counts, indexed by instruction slot. The slot index is
// stable across runs because every fixture loads the same image, so counts
// accumulate cleanly over the whole corpus.
const hits = new Float64Array( image.instructions.length );

// Instrument the dispatch path. compileInstructions returns one call frame
// per slot; wrapping each frame's implementation to bump its counter captures
// coverage for both the batch interpreter (VM.interpret) and the resumable
// Session loop, which share this compiled array.
const originalCompile = VM.prototype.compileInstructions;
VM.prototype.compileInstructions = function ( instructions ) {
    const compiled = originalCompile.call( this, instructions );
    for ( const [ idx, frame ] of compiled.entries() ) {
        const impl = frame[0];
        frame[0] = function ( ...args ) {
            hits[idx]++;
            return impl.apply( this, args );
        };
    }
    return compiled;
};

const gimpelLoader = createHostLoader( { snolib: [ GIMPEL_LIB_DIR ] } );

// Run one fixture through the instrumented VM. Errors (including the ones
// `@match error` fixtures provoke) are swallowed: coverage up to the failure
// point is real and belongs in the totals, exactly as it does under the test
// runner.
function runFixture( filePath ) {
    const header = parseHeader( filePath ),
        name = path.basename( filePath, '.sno' ),
        opts = { ...header.options, file: filePath, loader: gimpelLoader };

    if ( header.input !== null ) {
        const inputPath = path.join( TMP_DIR, name + '.input' );
        fs.writeFileSync( inputPath, header.input );
        opts.input = inputPath;
    }

    const sink = { write() {} };
    let errored = false;
    try {
        const vm = createVM( { ...opts, stdout: sink, stderr: sink } );
        vm.run( image );
    } catch {
        errored = true;
    }
    return errored;
}

function pct( n, d ) {
    return d === 0 ? '0.0' : ( ( 100 * n ) / d ).toFixed( 1 );
}

// Group slots by enclosing region (PROC or section TITLE), preserving source
// order. Slots before the first marker fall under a synthetic top-level bucket.
function groupByRegion( slots ) {
    const regions = new Map();
    slots.forEach( ( slot, idx ) => {
        const r = slot.region,
            key = r ? `${r.kind}:${r.name}@${r.line}` : '(top)';
        let entry = regions.get( key );
        if ( !entry ) {
            entry = {
                kind: r ? r.kind : 'section',
                name: r ? r.name : '(startup / top level)',
                line: r ? r.line : slot.line,
                comment: r ? r.comment : '',
                total: 0,
                covered: 0,
                firstSlot: idx,
            };
            regions.set( key, entry );
        }
        entry.total++;
        if ( hits[idx] > 0 ) entry.covered++;
    } );
    return [ ...regions.values() ];
}

// For each opcode, how many of its instruction slots ran. Opcodes with zero
// covered slots are runtime operations the SNOBOL4 stream never exercises
// under the suite, regardless of how well their JS macros are unit-tested.
function groupByMacro( slots ) {
    const macros = new Map();
    slots.forEach( ( slot, idx ) => {
        let entry = macros.get( slot.macro );
        if ( !entry ) {
            entry = { macro: slot.macro, total: 0, covered: 0 };
            macros.set( slot.macro, entry );
        }
        entry.total++;
        if ( hits[idx] > 0 ) entry.covered++;
    } );
    return [ ...macros.values() ];
}

function writeReports( slots, regions, macros, ranAt ) {
    fs.mkdirSync( TMP_DIR, { recursive: true } );

    // Per-slot detail, for drilling into a specific routine.
    const detail = slots.map( ( slot, idx ) => ( {
        slot: idx,
        line: slot.line,
        region: slot.region ? slot.region.name : null,
        label: slot.label,
        macro: slot.macro,
        hits: hits[idx],
        comment: slot.comment,
    } ) );
    fs.writeFileSync(
        path.join( TMP_DIR, 'coverage.json' ),
        JSON.stringify( { ranAt, regions, macros, slots: detail }, null, 2 ),
    );

    // An annotated listing: every uncovered instruction, in source order,
    // tagged with its region so cold stretches read at a glance.
    const cold = detail.filter( ( d ) => d.hits === 0 );
    const lines = cold.map( ( d ) =>
        ( `${String( d.line ).padStart( 5 )}  ` +
            `${( d.region || '-' ).padEnd( 16 )} ` +
            `${d.macro.padEnd( 8 )} ${d.comment}` ).trimEnd()
    );
    fs.writeFileSync(
        path.join( TMP_DIR, 'uncovered.txt' ),
        `Uncovered SIL instructions (${cold.length})\n` +
            'line   region           macro    comment\n' +
            lines.join( '\n' ) + '\n',
    );
}

// Tag a region with its kind so procedures and sections are distinguishable
// in the listing (sections always run; a dead "region" is always a PROC).
function tag( r ) {
    return ( r.kind === 'proc' ? 'P ' : 'S ' ) + r.name;
}

function main() {
    const argv = process.argv.slice( 2 ),
        showAll = argv.includes( '--procs' ),
        jsonArg = argv.find( ( a ) => a.startsWith( '--json' ) );

    const slots = buildSourceMap( fs.readFileSync( SIL_PATH, 'utf8' ), image );
    fs.mkdirSync( TMP_DIR, { recursive: true } );

    const fixtures = loadCases();
    let errored = 0;
    for ( const filePath of fixtures ) {
        if ( runFixture( filePath ) ) errored++;
    }

    const total = slots.length,
        covered = hits.reduce( ( n, h ) => n + ( h > 0 ? 1 : 0 ), 0 ),
        regions = groupByRegion( slots ),
        macros = groupByMacro( slots );

    const ranAt = new Date().toISOString();
    writeReports( slots, regions, macros, ranAt );
    if ( jsonArg ) {
        const dest = jsonArg.includes( '=' )
            ? jsonArg.split( '=' )[1]
            : path.join( TMP_DIR, 'coverage.json' );
        fs.writeFileSync(
            dest,
            JSON.stringify(
                { ranAt, total, covered, regions, macros },
                null,
                2,
            ),
        );
    }

    const deadRegions = regions
            .filter( ( r ) => r.covered === 0 )
            .sort( ( a, b ) => a.firstSlot - b.firstSlot ),
        partialRegions = regions
            .filter( ( r ) => r.covered > 0 && r.covered < r.total )
            .sort( ( a, b ) =>
                a.covered / a.total - b.covered / b.total ||
                b.total - a.total
            ),
        deadMacros = macros
            .filter( ( m ) => m.covered === 0 )
            .sort( ( a, b ) => b.total - a.total );

    const out = [];
    out.push( 'SIL instruction coverage by the program fixtures' );
    out.push( '================================================' );
    out.push(
        `Fixtures:      ${fixtures.length} run ` +
            `(${errored} raised a host exception)`,
    );
    out.push(
        `Instructions:  ${total} total in the SNOBOL4 stream`,
    );
    out.push(
        `  covered:     ${covered} (${pct( covered, total )}%)`,
    );
    out.push(
        `  uncovered:   ${total - covered} (${pct( total - covered, total )}%)`,
    );
    out.push(
        `Regions:       ${regions.length} total (PROCs + sections), ` +
            `${deadRegions.length} never entered`,
    );
    out.push( '' );

    out.push( `Regions never entered (${deadRegions.length}):` );
    out.push( '  line   region              n  comment' );
    for ( const r of deadRegions ) {
        out.push(
            `  ${String( r.line ).padStart( 5 )}  ${tag( r ).padEnd( 18 )} ` +
                `${String( r.total ).padStart( 3 )}  ${r.comment}`,
        );
    }
    out.push( '' );

    const partialShown = showAll
        ? partialRegions
        : partialRegions.slice( 0, 20 );
    out.push(
        `Partially covered regions` +
            ( showAll ? '' : ` (worst ${partialShown.length})` ) + ':',
    );
    out.push( '  cover%  hit/tot  line   region              comment' );
    for ( const r of partialShown ) {
        out.push(
            `  ${pct( r.covered, r.total ).padStart( 5 )}%  ` +
                `${String( r.covered ).padStart( 3 )}/` +
                `${String( r.total ).padEnd( 3 )}  ` +
                `${String( r.line ).padStart( 5 )}  ${tag( r ).padEnd( 18 )} ` +
                `${r.comment}`,
        );
    }
    out.push( '' );

    out.push(
        `SIL opcodes never executed in the stream (${deadMacros.length} of ` +
            `${macros.length}):`,
    );
    out.push(
        '  ' +
            ( deadMacros.length
                ? deadMacros
                    .map( ( m ) => `${m.macro}(${m.total})` )
                    .join( ', ' )
                : '(none)' ),
    );
    out.push( '' );
    out.push(
        `Full detail: ${path.relative( ROOT, TMP_DIR )}/coverage.json, ` +
            `uncovered.txt`,
    );

    process.stdout.write( out.join( '\n' ) + '\n' );
}

main();
