#!/usr/bin/env node
'use strict';

// Run program fixtures from test/programs/ under CSNOBOL4 and check their
// output against the @expect / @match directives in the fixture header.
//
// CSNOBOL4 is a useful reference implementation for sanity-checking that a
// fixture's @expect block actually matches an independent SNOBOL4. A
// disagreement is not proof that Snoflake (or the fixture) is wrong — see
// test/programs/README.md — but it flags fixtures worth a second look.
//
// Usage:
//   node tools/check-csnobol4.js                # check every fixture
//   node tools/check-csnobol4.js path1.sno ...  # check specific fixtures
//   node tools/check-csnobol4.js --help
//
// Exit code is 0 if every checked fixture matched, 1 otherwise.
//
// Limitations:
// - @options runtime flags (caseFold, debug, etc.) are not translated to
//   CSNOBOL4 invocation flags. A warning is printed for fixtures whose
//   options likely affect execution semantics.
// - The data-section banner extraction used by the mocha runner does not
//   apply: CSNOBOL4 with -b prints program output verbatim (no banner, no
//   "NORMAL TERMINATION" epilogue).

import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as fixture from '../test/program-fixture.js';

var __dirname = path.dirname( fileURLToPath( import.meta.url ) );
var ROOT = path.join( __dirname, '..' ),
    TMP_DIR = path.join( ROOT, 'tmp', 'check-csnobol4' );

var SNOBOL4_BIN = process.env.SNOBOL4 || 'snobol4';

// Match the runner's error-marker list so a CSNOBOL4 run that triggers any
// of these is treated the same way the mocha runner would.
var ERROR_MARKERS = [
    'ERROR IN SNOBOL4 SYSTEM',
    'Compilation error',
    'Execution error',
    'Aborting: exceeded'
];

// Options that almost certainly change observable behavior under Snoflake but
// have no straightforward CSNOBOL4 equivalent. Fixtures that set any of
// these get a warning so the operator knows the comparison is best-effort.
var SEMANTIC_OPTION_KEYS = [ 'caseFold', 'debug', 'watch' ];

function trimTrailingNewlines( s ) {
    return s.replace( /\n+$/, '' );
}

function findErrorMarker( output ) {
    for ( var i = 0; i < ERROR_MARKERS.length; i++ ) {
        if ( output.indexOf( ERROR_MARKERS[ i ] ) !== -1 ) {
            return ERROR_MARKERS[ i ];
        }
    }
    return null;
}

function semanticOptionWarnings( opts ) {
    var keys = Object.keys( opts ).filter( function ( k ) {
        return SEMANTIC_OPTION_KEYS.indexOf( k ) !== -1;
    } );
    return keys.length ? keys : null;
}

function runUnderCsnobol4( filePath, header ) {
    fs.mkdirSync( TMP_DIR, { recursive: true } );
    var inputBuf = header.input === null ? '' : header.input;
    // -b suppresses the CSNOBOL4 startup banner so stdout is exactly the
    // program's OUTPUT/PUNCH stream, which is what @expect describes.
    // Cap wall-clock and output size so a runaway fixture does not hang the
    // helper or trip ENOBUFS on stdout.
    var result = childProcess.spawnSync( SNOBOL4_BIN, [ '-b', filePath ], {
        cwd: ROOT,
        input: inputBuf,
        encoding: 'utf8',
        timeout: 10000,
        maxBuffer: 16 * 1024 * 1024,
        killSignal: 'SIGKILL'
    } );
    if ( result.error ) {
        var msg;
        if ( result.error.code === 'ENOENT' ) {
            msg = SNOBOL4_BIN + ' not found in PATH (set $SNOBOL4 to override)';
        } else if ( result.error.code === 'ETIMEDOUT' ) {
            msg = 'CSNOBOL4 timed out after 10s';
        } else if ( result.error.code === 'ENOBUFS' ) {
            msg = 'CSNOBOL4 output exceeded 16 MB buffer';
        } else {
            msg = result.error.message;
        }
        throw new Error( msg );
    }
    return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        status: result.status
    };
}

function dumpActual( filePath, run ) {
    fs.mkdirSync( TMP_DIR, { recursive: true } );
    var name = path.basename( filePath, '.sno' );
    var actualPath = path.join( TMP_DIR, name + '.actual' );
    var combined = '--- stdout ---\n' + run.stdout +
        '--- stderr ---\n' + run.stderr +
        '--- exit ' + run.status + ' ---\n';
    fs.writeFileSync( actualPath, combined );
    return actualPath;
}

// Returns { ok: bool, message: string|null }.
function checkAgainstExpect( header, run ) {
    var combined = run.stdout + run.stderr;
    var marker = findErrorMarker( combined );

    if ( header.match === 'error' ) {
        // The mocha runner accepts either an error marker OR a non-zero exit
        // as evidence of an "error". CSNOBOL4 reliably exits non-zero on
        // execution errors but does not print the Snoflake-specific markers,
        // so check both.
        if ( marker === null && run.status === 0 ) {
            return { ok: false, message: 'expected an error, none observed (exit 0, no marker)' };
        }
        if ( header.expect !== null ) {
            var needle = trimTrailingNewlines( header.expect );
            if ( combined.indexOf( needle ) === -1 ) {
                return { ok: false, message: 'expected substring not found in error output: ' +
                    JSON.stringify( needle ) };
            }
        }
        return { ok: true, message: null };
    }

    if ( marker !== null ) {
        return { ok: false, message: 'unexpected error marker "' + marker + '" in output' };
    }
    if ( run.status !== 0 ) {
        return { ok: false, message: 'CSNOBOL4 exited with status ' + run.status };
    }

    if ( header.match === 'substring' ) {
        var sub = trimTrailingNewlines( header.expect );
        if ( run.stdout.indexOf( sub ) === -1 ) {
            return { ok: false, message: 'expected substring not found in stdout: ' +
                JSON.stringify( sub ) };
        }
        return { ok: true, message: null };
    }

    // exact: CSNOBOL4 -b output IS the data section, no banner extraction.
    var actual = trimTrailingNewlines( run.stdout );
    var expect = trimTrailingNewlines( header.expect );
    if ( actual !== expect ) {
        return { ok: false, message:
            'stdout did not match @expect\n--- expected ---\n' + expect +
            '\n--- actual ---\n' + actual };
    }
    return { ok: true, message: null };
}

function formatExpectBlock( expectStr ) {
    // The fixture parser appends a trailing '\n' to single-line @expect and
    // block @expect alike, so the canonical "no trailing blank" form is just
    // the payload split by '\n' with the final empty element dropped.
    var stripped = expectStr.replace( /\n+$/, '' );
    var lines = stripped.split( '\n' );
    var out = [ '* @expect >>>' ];
    lines.forEach( function ( l ) {
        out.push( l === '' ? '*' : '* ' + l );
    } );
    out.push( '* <<<' );
    return out;
}

function rewriteExpect( filePath, newExpect ) {
    var raw = fs.readFileSync( filePath, 'utf8' );
    var lines = raw.split( '\n' );
    var expectStart = -1, expectEnd = -1;
    for ( var i = 0; i < lines.length; i++ ) {
        var line = lines[ i ];
        if ( line.charAt( 0 ) !== '*' ) {
            break;
        }
        var m = /^\* @(\w+)(\s.*)?$/.exec( line );
        if ( !m || m[ 1 ] !== 'expect' ) {
            continue;
        }
        var rest = ( m[ 2 ] || '' ).replace( /^\s+/, '' );
        expectStart = i;
        if ( rest === '>>>' ) {
            for ( var j = i + 1; j < lines.length; j++ ) {
                if ( lines[ j ] === '* <<<' ) {
                    expectEnd = j;
                    break;
                }
            }
            if ( expectEnd === -1 ) {
                throw new Error( filePath + ': unterminated @expect block at line ' +
                    ( expectStart + 1 ) );
            }
        } else {
            expectEnd = i;
        }
        break;
    }
    if ( expectStart === -1 ) {
        throw new Error( filePath + ': no @expect directive to update' );
    }
    var formatted = formatExpectBlock( newExpect );
    var before = lines.slice( 0, expectStart );
    var after = lines.slice( expectEnd + 1 );
    fs.writeFileSync( filePath, before.concat( formatted, after ).join( '\n' ) );
}

function checkOne( filePath, opts ) {
    opts = opts || {};
    var header;
    try {
        header = fixture.parseHeader( filePath );
    } catch ( e ) {
        return { ok: false, title: path.basename( filePath ), message: 'parse error: ' + e.message };
    }
    var warnings = semanticOptionWarnings( header.options );
    var run;
    try {
        run = runUnderCsnobol4( filePath, header );
    } catch ( e ) {
        return { ok: false, title: header.title, message: e.message, warnings: warnings };
    }
    var result = checkAgainstExpect( header, run );

    if ( opts.update && !result.ok ) {
        // Only `exact` mode has a single canonical answer we can write back.
        // For `substring` we do not know what fragment of CSNOBOL4 stdout the
        // author meant to assert on, and `error` fixtures do not record a
        // full reference output. CSNOBOL4 errors (non-zero exit) are also
        // never written back — that would silently bake in a regression.
        if ( header.match !== 'exact' ) {
            return {
                ok: false, title: header.title, warnings: warnings,
                message: result.message, actualPath: dumpActual( filePath, run ),
                updateSkipped: '@match ' + header.match + ' is not auto-updatable'
            };
        }
        var marker = findErrorMarker( run.stdout + run.stderr );
        if ( marker !== null || run.status !== 0 ) {
            return {
                ok: false, title: header.title, warnings: warnings,
                message: result.message, actualPath: dumpActual( filePath, run ),
                updateSkipped: 'CSNOBOL4 reported an error; refusing to update'
            };
        }
        try {
            rewriteExpect( filePath, run.stdout );
        } catch ( e ) {
            return {
                ok: false, title: header.title, warnings: warnings,
                message: 'rewrite failed: ' + e.message,
                actualPath: dumpActual( filePath, run )
            };
        }
        return { ok: true, title: header.title, warnings: warnings, updated: true };
    }

    var actualPath = result.ok ? null : dumpActual( filePath, run );
    return {
        ok: result.ok,
        title: header.title,
        message: result.message,
        warnings: warnings,
        actualPath: actualPath
    };
}

function resolveFixtureArgs( args ) {
    if ( args.length === 0 ) {
        return fixture.loadCases();
    }
    return args.map( function ( a ) {
        if ( fs.existsSync( a ) ) {
            return path.resolve( a );
        }
        var candidate = path.join( fixture.PROGRAMS_DIR, a );
        if ( fs.existsSync( candidate ) ) {
            return candidate;
        }
        if ( !/\.sno$/.test( a ) ) {
            var withExt = path.join( fixture.PROGRAMS_DIR, a + '.sno' );
            if ( fs.existsSync( withExt ) ) {
                return withExt;
            }
        }
        throw new Error( 'fixture not found: ' + a );
    } );
}

function printHelp() {
    process.stdout.write(
        'Usage: node tools/check-csnobol4.js [--update] [fixture.sno ...]\n' +
        '\n' +
        'Run each fixture under CSNOBOL4 (snobol4 -b) and compare the captured\n' +
        'output to the @expect / @match directives parsed from the fixture\n' +
        'header. With no arguments, every fixture under test/programs/ is\n' +
        'checked.\n' +
        '\n' +
        'Options:\n' +
        '  --update  Rewrite the @expect block of any mismatched fixture with\n' +
        '            CSNOBOL4\'s actual stdout. Only applies to @match exact\n' +
        '            fixtures whose CSNOBOL4 run did not error.\n' +
        '\n' +
        'Environment:\n' +
        '  SNOBOL4   path to the snobol4 binary (default: "snobol4")\n' +
        '\n' +
        'Exit status: 0 if every checked fixture matched (or was updated),\n' +
        '             1 otherwise.\n'
    );
}

function main( argv ) {
    if ( argv.indexOf( '--help' ) !== -1 || argv.indexOf( '-h' ) !== -1 ) {
        printHelp();
        return 0;
    }
    var update = false;
    var positional = [];
    argv.forEach( function ( a ) {
        if ( a === '--update' ) {
            update = true;
        } else if ( a.charAt( 0 ) === '-' ) {
            throw new Error( 'unknown flag: ' + a );
        } else {
            positional.push( a );
        }
    } );
    var files;
    try {
        files = resolveFixtureArgs( positional );
    } catch ( e ) {
        process.stderr.write( e.message + '\n' );
        return 2;
    }
    if ( files.length === 0 ) {
        process.stderr.write( 'no fixtures to check\n' );
        return 2;
    }
    var passed = 0, failed = 0, updated = 0;
    files.forEach( function ( filePath ) {
        var rel = path.relative( ROOT, filePath );
        var r = checkOne( filePath, { update: update } );
        if ( r.warnings && r.warnings.length ) {
            process.stdout.write( 'WARN ' + rel + ': @options affects semantics (' +
                r.warnings.join( ', ' ) + '); CSNOBOL4 ignores these\n' );
        }
        if ( r.updated ) {
            updated++;
            process.stdout.write( 'UPDATE ' + rel + ' — ' + r.title + '\n' );
            return;
        }
        if ( r.ok ) {
            passed++;
            process.stdout.write( 'PASS ' + rel + ' — ' + r.title + '\n' );
            return;
        }
        failed++;
        process.stdout.write( 'FAIL ' + rel + ' — ' + ( r.title || '' ) + '\n' );
        process.stdout.write( '     ' + r.message.replace( /\n/g, '\n     ' ) + '\n' );
        if ( r.updateSkipped ) {
            process.stdout.write( '     update skipped: ' + r.updateSkipped + '\n' );
        }
        if ( r.actualPath ) {
            process.stdout.write( '     full output: ' +
                path.relative( ROOT, r.actualPath ) + '\n' );
        }
    } );
    var summary = passed + ' passed, ' + failed + ' failed';
    if ( update ) {
        summary += ', ' + updated + ' updated';
    }
    summary += ', ' + files.length + ' total\n';
    process.stdout.write( '\n' + summary );
    return failed === 0 ? 0 : 1;
}

if ( import.meta.url === pathToFileURL( process.argv[ 1 ] ).href ) {
    process.exit( main( process.argv.slice( 2 ) ) );
}

export { checkOne, main };
