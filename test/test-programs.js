'use strict';

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import SNOBOL from '../src/snobol.js';
import { parseHeader, loadCases } from './program-fixture.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const ROOT = path.join( __dirname, '..' ),
      TMP_DIR = path.join( ROOT, 'tmp', 'test-programs' );

// Recognized error markers. Used both for the negative check in
// exact/substring modes and the positive check in error mode. Adding a
// marker is a deliberate runner change, not something tests can introduce
// ad hoc; see test/programs/README.md.
const ERROR_MARKERS = [
      'ERROR IN SNOBOL4 SYSTEM',
      'Compilation error',
      'Execution error'
];

const DATA_BANNER = 'NO ERRORS DETECTED IN SOURCE PROGRAM',
      DATA_EPILOGUE = 'NORMAL TERMINATION AT LEVEL';

function captureWriter() {
    const lines = [];
    return {
        lines: lines,
        write: function ( line ) { lines.push( line ); }
    };
}

// Mirror the CLI's stdout shape: each writer.write(line) corresponds to one
// console.log(line) in the CLI, which appends '\n'. Rejoining with '\n' and
// adding a trailing '\n' reproduces the byte stream the subprocess used to
// produce, so extractDataSection's anchor logic still works unchanged.
function joinLines( lines ) {
    return lines.length === 0 ? '' : lines.join( '\n' ) + '\n';
}

function findErrorMarker( output ) {
    for ( let i = 0; i < ERROR_MARKERS.length; i++ ) {
        if ( output.indexOf( ERROR_MARKERS[ i ] ) !== -1 ) {
            return ERROR_MARKERS[ i ];
        }
    }
    return null;
}

function extractDataSection( output ) {
    const bannerIdx = output.indexOf( DATA_BANNER );
    if ( bannerIdx === -1 ) {
        return null;
    }
    let start = bannerIdx + DATA_BANNER.length;
    // Runtime emits "<banner>\n\n" before the data. Skip exactly those two
    // newlines so a leading blank line in the program output is preserved.
    if ( output.charAt( start ) !== '\n' ) {
        return null;
    }
    start++;
    if ( output.charAt( start ) !== '\n' ) {
        return null;
    }
    start++;
    // Anchor on the LAST occurrence of the epilogue so a program that
    // happens to print "NORMAL TERMINATION AT LEVEL" itself does not
    // truncate the data section.
    const epilogueIdx = output.lastIndexOf( DATA_EPILOGUE );
    if ( epilogueIdx === -1 || epilogueIdx < start ) {
        return null;
    }
    return output.slice( start, epilogueIdx );
}

function trimTrailingNewlines( s ) {
    return s.replace( /\n+$/, '' );
}

function runProgram( filePath, header ) {
    fs.mkdirSync( TMP_DIR, { recursive: true } );
    const name = path.basename( filePath, '.sno' );
    const opts = { ...header.options, file: filePath };
    if ( header.input !== null ) {
        const inputPath = path.join( TMP_DIR, name + '.input' );
        fs.writeFileSync( inputPath, header.input );
        opts.input = inputPath;
    }

    const stdout = captureWriter();
    const stderr = captureWriter();
    const vm = new SNOBOL.VM( { ...opts, stdout: stdout, stderr: stderr } );
    vm.reset();
    try {
        vm.run( SNOBOL.interp( vm ) );
    } catch ( e ) {
        // Treat thrown runtime errors as recognized error output so the
        // assertion logic ('Execution error' marker) can react instead of
        // failing the whole mocha process.
        stderr.write( 'Execution error: ' + ( e && e.stack || e ) );
    }
    return joinLines( stdout.lines ) + joinLines( stderr.lines );
}

function dumpActual( filePath, output ) {
    fs.mkdirSync( TMP_DIR, { recursive: true } );
    const actualPath = path.join( TMP_DIR, path.basename( filePath, '.sno' ) + '.actual' );
    fs.writeFileSync( actualPath, output );
    return actualPath;
}

function fail( filePath, output, message ) {
    const actualPath = dumpActual( filePath, output );
    assert.fail( message + '\n  full output: ' + actualPath );
}

function assertProgram( filePath, header, output ) {
    const marker = findErrorMarker( output );

    if ( header.match === 'error' ) {
        if ( marker === null ) {
            fail( filePath, output, 'expected an error marker, none found' );
        }
        if ( header.expect !== null ) {
            const needle = trimTrailingNewlines( header.expect );
            if ( output.indexOf( needle ) === -1 ) {
                fail( filePath, output,
                    'expected substring not found in error output: ' + JSON.stringify( needle ) );
            }
        }
        return;
    }

    if ( marker !== null ) {
        fail( filePath, output, 'unexpected error marker "' + marker + '" in output' );
    }

    if ( header.match === 'substring' ) {
        const sub = trimTrailingNewlines( header.expect );
        if ( output.indexOf( sub ) === -1 ) {
            fail( filePath, output,
                'expected substring not found in output: ' + JSON.stringify( sub ) );
        }
        return;
    }

    // exact
    const section = extractDataSection( output );
    if ( section === null ) {
        fail( filePath, output, 'could not locate data section between banner and epilogue' );
    }
    const actual = trimTrailingNewlines( section );
    const expect = trimTrailingNewlines( header.expect );
    if ( actual !== expect ) {
        fail( filePath, output,
            'data section did not match @expect\n--- expected ---\n' + expect +
            '\n--- actual ---\n' + actual );
    }
}

describe( 'Program-level tests', function () {
    loadCases().forEach( function ( filePath ) {
        let header;
        let parseError;
        try {
            header = parseHeader( filePath );
        } catch ( e ) {
            parseError = e;
        }
        const label = header ? header.title : 'parses ' + path.basename( filePath );
        it( label, function () {
            if ( parseError ) {
                throw parseError;
            }
            const output = runProgram( filePath, header );
            assertProgram( filePath, header, output );
        } );
    } );
} );
