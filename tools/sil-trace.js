#!/usr/bin/env node
'use strict';

// Run a SNOBOL program and emit the original SIL source line behind every
// instruction the VM executes. The program's own output stays on stdout and
// the trace goes to stderr, so the two streams separate cleanly:
//
//   node tools/sil-trace.js prog.sno 2>trace.txt
//   node tools/sil-trace.js prog.sno --input=data.txt | diff - expected.txt
//
// As a library, runWithTrace() wraps run() from src/snobol.js with the same
// options and return shape, plus an onTrace callback for capturing the trace:
//
//   import { runWithTrace } from './tools/sil-trace.js';
//   const log = [];
//   runWithTrace( { source: 'x = 1\nEND', onTrace: ( s ) => log.push( s ) } );
//
// Each trace line is the verbatim text of external/v311-snoflake.sil, prefixed
// with its source line number, so a stretch of trace reads like a walk through
// the SIL. The image is assembled from the SIL on every call rather than
// loaded from src/generated-snobol-image.js, so a work-in-progress SIL edit
// traces faithfully without a prior `make build`. The slot-to-source mapping
// comes from tools/sil-source-map.js.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createVM, VM } from '../src/snobol.js';
import { assemble } from '../src/assemble.js';
import {
    normalizeListOperands,
    parse as parseSil,
} from '../build/sil-parser.js';
import { createHostLoader, stdinReader } from '../src/host.js';
import { buildSourceMap } from './sil-source-map.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
    ROOT = path.join( __dirname, '..' ),
    SIL_PATH = path.join( ROOT, 'external', 'v311-snoflake.sil' );

// Render a trace slot the way the CLI prints it: padded source line number,
// then the verbatim SIL text.
export function formatTraceLine( slot ) {
    return String( slot.line ).padStart( 6 ) + '  ' + slot.text;
}

// Run a SNOBOL program with SIL tracing. Accepts every option run() does (see
// src/snobol.js) plus onTrace, a callback invoked with { line, text } for each
// instruction just before it executes; it defaults to writing the CLI format
// to stderr. Returns { vm, exitCode }, like run(). The image is freshly
// assembled from the SIL, so it reflects any uncommitted edits there.
export function runWithTrace( options = {} ) {
    const { onTrace, ...runOptions } = options,
        emit = onTrace ??
            ( ( slot ) =>
                process.stderr.write( formatTraceLine( slot ) + '\n' ) );

    const silText = fs.readFileSync( SIL_PATH, 'utf8' ),
        image = assemble( normalizeListOperands( parseSil( silText ) ) ),
        slots = buildSourceMap( silText, image );

    // Instrument the dispatch path. compileInstructions returns one call
    // frame per slot; wrapping each frame's implementation to emit its source
    // line first turns the run into a stream of the SIL it executes. The
    // patch is restored afterward so importing this module does not leave the
    // VM instrumented.
    const originalCompile = VM.prototype.compileInstructions;
    VM.prototype.compileInstructions = function ( instructions ) {
        const compiled = originalCompile.call( this, instructions );
        for ( const [ idx, frame ] of compiled.entries() ) {
            const impl = frame[0],
                slot = slots[idx];
            frame[0] = function ( ...args ) {
                emit( slot );
                return impl.apply( this, args );
            };
        }
        return compiled;
    };

    try {
        const vm = createVM( runOptions );
        vm.run( image );
        return { vm, exitCode: vm.exitCode };
    } finally {
        VM.prototype.compileInstructions = originalCompile;
    }
}

function main() {
    const { values, positionals } = parseArgs( {
        options: {
            input: { type: 'string' },
            snolib: { type: 'string', short: 'I', multiple: true },
            case: { type: 'string' },
            'multiline-strings': { type: 'string' },
        },
        allowPositionals: true,
        strict: true,
    } );

    const file = positionals[0];
    if ( file === undefined ) {
        process.stderr.write(
            'Usage: node tools/sil-trace.js [options] file.sno\n',
        );
        process.exit( 2 );
    }

    const { exitCode } = runWithTrace( {
        file,
        input: values.input,
        case: values.case !== 'false',
        multilineStrings: values['multiline-strings'] !== 'false',
        loader: createHostLoader( { snolib: values.snolib } ),
        stdinReader,
    } );
    process.exitCode = exitCode;
}

const isMain = import.meta.main ??
    ( import.meta.url === pathToFileURL( process.argv[1] ?? '' ).href );
if ( isMain ) main();
