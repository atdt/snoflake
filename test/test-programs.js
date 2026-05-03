'use strict';

import assert from 'node:assert';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHeader, loadCases } from './program-fixture.js';

var __dirname = path.dirname( fileURLToPath( import.meta.url ) );
var ROOT = path.join( __dirname, '..' ),
    TMP_DIR = path.join( ROOT, 'tmp', 'test-programs' );

// Recognized error markers. Used both for the negative check in
// exact/substring modes and the positive check in error mode. Adding a
// marker is a deliberate runner change, not something tests can introduce
// ad hoc; see test/programs/README.md.
var ERROR_MARKERS = [
    'ERROR IN SNOBOL4 SYSTEM',
    'Compilation error',
    'Execution error',
    'Aborting: exceeded'
];

var DEFAULT_OPTIONS = { maxSteps: 5000000, maxMillis: 0 };

var DATA_BANNER = 'NO ERRORS DETECTED IN SOURCE PROGRAM';
var DATA_EPILOGUE = 'NORMAL TERMINATION AT LEVEL';

function optionsToArgv( opts ) {
    return Object.keys( opts ).map( function ( k ) {
        var v = opts[ k ];
        if ( v === true ) {
            return '--' + k;
        }
        if ( Array.isArray( v ) ) {
            return '--' + k + '=' + v.join( ',' );
        }
        return '--' + k + '=' + v;
    } );
}

function findErrorMarker( output ) {
    for ( var i = 0; i < ERROR_MARKERS.length; i++ ) {
        if ( output.indexOf( ERROR_MARKERS[ i ] ) !== -1 ) {
            return ERROR_MARKERS[ i ];
        }
    }
    return null;
}

function extractDataSection( output ) {
    var bannerIdx = output.indexOf( DATA_BANNER );
    if ( bannerIdx === -1 ) {
        return null;
    }
    var start = bannerIdx + DATA_BANNER.length;
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
    var epilogueIdx = output.lastIndexOf( DATA_EPILOGUE );
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
    var name = path.basename( filePath, '.sno' );
    var opts = { ...DEFAULT_OPTIONS, ...header.options, file: filePath };
    if ( header.input !== null ) {
        var inputPath = path.join( TMP_DIR, name + '.input' );
        fs.writeFileSync( inputPath, header.input );
        opts.input = inputPath;
    }
    var argv = [ 'run.js' ].concat( optionsToArgv( opts ) );
    var result = childProcess.spawnSync( process.execPath, argv, {
        cwd: ROOT,
        encoding: 'utf8'
    } );
    if ( result.error ) {
        throw result.error;
    }
    return ( result.stdout || '' ) + ( result.stderr || '' );
}

function dumpActual( filePath, output ) {
    fs.mkdirSync( TMP_DIR, { recursive: true } );
    var actualPath = path.join( TMP_DIR, path.basename( filePath, '.sno' ) + '.actual' );
    fs.writeFileSync( actualPath, output );
    return actualPath;
}

function fail( filePath, output, message ) {
    var actualPath = dumpActual( filePath, output );
    assert.fail( message + '\n  full output: ' + actualPath );
}

function assertProgram( filePath, header, output ) {
    var marker = findErrorMarker( output );

    if ( header.match === 'error' ) {
        if ( marker === null ) {
            fail( filePath, output, 'expected an error marker, none found' );
        }
        if ( header.expect !== null ) {
            var needle = trimTrailingNewlines( header.expect );
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
        var sub = trimTrailingNewlines( header.expect );
        if ( output.indexOf( sub ) === -1 ) {
            fail( filePath, output,
                'expected substring not found in output: ' + JSON.stringify( sub ) );
        }
        return;
    }

    // exact
    var section = extractDataSection( output );
    if ( section === null ) {
        fail( filePath, output, 'could not locate data section between banner and epilogue' );
    }
    var actual = trimTrailingNewlines( section );
    var expect = trimTrailingNewlines( header.expect );
    if ( actual !== expect ) {
        fail( filePath, output,
            'data section did not match @expect\n--- expected ---\n' + expect +
            '\n--- actual ---\n' + actual );
    }
}

describe( 'Program-level tests', function () {
    loadCases().forEach( function ( filePath ) {
        var header;
        var parseError;
        try {
            header = parseHeader( filePath );
        } catch ( e ) {
            parseError = e;
        }
        var label = header ? header.title : 'parses ' + path.basename( filePath );
        it( label, function () {
            if ( parseError ) {
                throw parseError;
            }
            var output = runProgram( filePath, header );
            assertProgram( filePath, header, output );
        } );
    } );
} );
