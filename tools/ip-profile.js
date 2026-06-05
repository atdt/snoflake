#!/usr/bin/env node
'use strict';

// Per-ip execution profile: count how many times each SIL instruction slot in
// the assembled SNOBOL4 stream runs for a single program (default sudoku.sno).
//
//   node tools/ip-profile.js [program.sno] [--top=N]
//
// Reuses the coverage tool's instrumentation idea (wrap each compiled bound
// call to bump a per-slot counter) but runs one program and reports raw
// execution counts, hottest first, with the slot mapped back to its SIL line,
// opcode, label, and enclosing PROC. Full per-ip detail is written to
// tmp/ip-profile/counts.tsv.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { createVM, image, VM } from '../src/snobol.js';
import { createHostLoader } from '../src/host.js';
import { buildSourceMap } from './sil-source-map.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
    ROOT = path.join( __dirname, '..' ),
    SIL_PATH = path.join( ROOT, 'external', 'v311-snoflake.sil' ),
    OUT_DIR = path.join( ROOT, 'tmp', 'ip-profile' );

const counts = new Float64Array( image.instructions.length );

const originalCompile = VM.prototype.compileInstructions;
VM.prototype.compileInstructions = function ( instructions ) {
    const compiled = originalCompile.call( this, instructions );
    for ( const [ idx, frame ] of compiled.entries() ) {
        const impl = frame[0];
        frame[0] = function ( ...args ) {
            counts[idx]++;
            return impl.apply( this, args );
        };
    }
    return compiled;
};

function main() {
    const argv = process.argv.slice( 2 ),
        topArg = argv.find( ( a ) => a.startsWith( '--top=' ) ),
        TOP = topArg ? Number( topArg.split( '=' )[1] ) : 40,
        progArg = argv.find( ( a ) => !a.startsWith( '--' ) ),
        program = progArg
            ? path.resolve( ROOT, progArg )
            : path.join( ROOT, 'sudoku.sno' );

    // The report names each slot's enclosing region. Slots before the first
    // PROC or TITLE marker fall under a synthetic top-level bucket.
    const slots = buildSourceMap( fs.readFileSync( SIL_PATH, 'utf8' ), image )
        .map( ( s ) => ( {
            ...s,
            label: s.label ?? '',
            proc: s.region ? s.region.name : '(top)',
        } ) );

    fs.mkdirSync( OUT_DIR, { recursive: true } );
    const sink = { write() {} };
    const vm = createVM( {
        file: program,
        loader: createHostLoader(),
        stdout: sink,
        stderr: sink,
    } );
    vm.run( image );

    let totalExec = 0,
        executedSlots = 0;
    for ( let i = 0; i < counts.length; i++ ) {
        totalExec += counts[i];
        if ( counts[i] > 0 ) executedSlots++;
    }

    // Full per-ip detail, ip order.
    const tsv = [ 'ip\tcount\tline\tproc\tlabel\tmacro\tcomment' ];
    for ( let i = 0; i < counts.length; i++ ) {
        const s = slots[i];
        tsv.push(
            `${i}\t${counts[i]}\t${s.line}\t${s.proc}\t${s.label}\t` +
                `${s.macro}\t${s.comment}`,
        );
    }
    fs.writeFileSync(
        path.join( OUT_DIR, 'counts.tsv' ),
        tsv.join( '\n' ) + '\n',
    );

    // Aggregate by opcode.
    const byMacro = new Map();
    for ( let i = 0; i < counts.length; i++ ) {
        const macro = slots[i].macro;
        byMacro.set( macro, ( byMacro.get( macro ) ?? 0 ) + counts[i] );
    }
    const macroRows = [ ...byMacro.entries() ]
        .filter( ( [ , n ] ) => n > 0 )
        .sort( ( a, b ) => b[1] - a[1] );

    // Hottest individual ips.
    const order = Array.from( counts.keys() )
        .filter( ( i ) => counts[i] > 0 )
        .sort( ( a, b ) => counts[b] - counts[a] );

    const fmt = ( n ) => n.toLocaleString( 'en-US' );
    const out = [];
    out.push( `Per-ip execution profile: ${path.relative( ROOT, program )}` );
    out.push( '='.repeat( 60 ) );
    out.push( `Total instructions executed: ${fmt( totalExec )}` );
    out.push(
        `Distinct slots executed:     ${fmt( executedSlots )} of ` +
            `${fmt( counts.length )} ` +
            `(${( ( 100 * executedSlots ) / counts.length ).toFixed( 1 )}%)`,
    );
    out.push( '' );

    out.push( `Top ${TOP} hottest instruction slots:` );
    out.push(
        '   ip      count  %tot   line  proc       macro    comment',
    );
    for ( const i of order.slice( 0, TOP ) ) {
        const s = slots[i],
            pctTot = ( ( 100 * counts[i] ) / totalExec ).toFixed( 1 );
        out.push(
            `${String( i ).padStart( 5 )}  ` +
                `${fmt( counts[i] ).padStart( 11 )}  ` +
                `${pctTot.padStart( 4 )}  ` +
                `${String( s.line ).padStart( 5 )}  ` +
                `${s.proc.padEnd( 9 )}  ` +
                `${s.macro.padEnd( 7 )}  ${s.comment}`,
        );
    }
    out.push( '' );

    out.push( 'Execution count by opcode (all slots summed):' );
    out.push( '   count  %tot  macro' );
    for ( const [ macro, n ] of macroRows.slice( 0, 30 ) ) {
        out.push(
            `${fmt( n ).padStart( 11 )}  ` +
                `${( ( 100 * n ) / totalExec ).toFixed( 1 ).padStart( 4 )}  ` +
                `${macro}`,
        );
    }
    out.push( '' );
    out.push(
        `Full per-ip detail: ${path.relative( ROOT, OUT_DIR )}/counts.tsv`,
    );

    process.stdout.write( out.join( '\n' ) + '\n' );
}

main();
