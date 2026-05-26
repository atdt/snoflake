#!/usr/bin/env node
'use strict';

// Run program fixtures from test/programs/ under CSNOBOL4 and check their
// output against the @expect / @match directives in the fixture header.
//
// CSNOBOL4 is a useful reference implementation for sanity-checking that a
// fixture's @expect block actually matches an independent SNOBOL4. A
// disagreement is not proof that Snoflake or the fixture is wrong. See
// test/programs/README.md. This only flags fixtures worth a second look.
//
// Usage:
//   node tools/check-csnobol4.js                # check every fixture
//   node tools/check-csnobol4.js path1.sno ...  # check specific fixtures
//   node tools/check-csnobol4.js --help
//
// Exit code is 0 if every checked fixture matched, 1 otherwise.
//
// Limitations:
// - @options runtime flags are translated to CSNOBOL4 invocation flags
//   when an equivalent exists (see csnobol4FlagsForOptions). A warning
//   is printed for options CSNOBOL4 cannot honor.
// - The data-section banner extraction used by the Node test runner does not
//   apply: CSNOBOL4 with -b prints program output verbatim (no banner, no
//   "NORMAL TERMINATION" epilogue).

import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as fixture from '../test/program-fixture.js';
import process from 'node:process';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const ROOT = path.join( __dirname, '..' ),
    TMP_DIR = path.join( ROOT, 'tmp', 'check-csnobol4' ),
    GIMPEL_LIB_DIR = path.join( ROOT, 'test', 'programs', 'gimpel' );

const SNOBOL4_BIN = process.env.SNOBOL4 || 'snobol4';

// Match the runner's error-marker list so a CSNOBOL4 run that triggers any
// of these is treated the same way the Node test runner would. Matched
// case-insensitively so the same list catches snoflake (uppercase) and
// CSNOBOL4 (mixed case) error text. ' at level ' catches the IBM-spec
// runtime-error preamble emitted by both implementations.
const ERROR_MARKERS = [
    'ERROR IN SNOBOL4 SYSTEM',
    'Compilation error',
    'Execution error',
    'Aborting: exceeded',
    ' at level ',
];

// Options that almost certainly change observable behavior under Snoflake but
// have no straightforward CSNOBOL4 equivalent. Fixtures that set any of
// these get a warning so the operator knows the comparison is best-effort.
const SEMANTIC_OPTION_KEYS = [ 'debug', 'watch' ];

// Translate fixture @options into CSNOBOL4 command-line flags. Only options
// with a clean CSNOBOL4 equivalent appear here. Everything else falls into
// SEMANTIC_OPTION_KEYS and produces a WARN.
function csnobol4FlagsForOptions( opts ) {
    const flags = [];
    // -f toggles identifier folding. CSNOBOL4 defaults to folding ON, matching
    // Snoflake, so `case: false` maps to a single -f to turn it off.
    if ( opts.case === false ) {
        flags.push( '-f' );
    }
    return flags;
}

function trimTrailingNewlines( s ) {
    return s.replace( /\n+$/, '' );
}

function findErrorMarker( output ) {
    const lower = output.toLowerCase();
    for ( let i = 0; i < ERROR_MARKERS.length; i++ ) {
        if ( lower.indexOf( ERROR_MARKERS[i].toLowerCase() ) !== -1 ) {
            return ERROR_MARKERS[i];
        }
    }
    return null;
}

function semanticOptionWarnings( opts ) {
    const keys = Object.keys( opts ).filter( function ( k ) {
        return SEMANTIC_OPTION_KEYS.indexOf( k ) !== -1;
    } );
    return keys.length ? keys : null;
}

// Historical SNOBOL4 (and snoflake) treats the source file as a single
// stream: lines after the END statement are not source, they are runtime
// INPUT data, available to the program through the same unit as INPUT.
// CSNOBOL4 disables this by default (its -r flag toggles it), so a fixture
// that stores its runtime data after END is invisible to the reference
// implementation unless we splice it back onto stdin.
function postEndInput( filePath ) {
    const raw = fs.readFileSync( filePath, 'utf8' );
    const lines = raw.split( '\n' );
    // Match the source-level END statement: bare "END" with no leading
    // whitespace, optionally followed by a label/comment. Conservative on
    // purpose — anything fancier is a hand-edit.
    for ( let i = 0; i < lines.length; i++ ) {
        if ( /^END(\s|$)/.test( lines[i] ) ) {
            const rest = lines.slice( i + 1 ).join( '\n' );
            return rest === '' ? '' : rest;
        }
    }
    return '';
}

function runUnderCsnobol4( filePath, header ) {
    fs.mkdirSync( TMP_DIR, { recursive: true } );
    // Pre-create a writable tmp/ subdirectory inside the CSNOBOL4 cwd so a
    // fixture that opens OUTPUT(...,'tmp/SCRATCH') (e.g. ASM uses 'tmp/ASMTEMP'
    // for the pass-1 intermediate listing) can open its file.  The dir is
    // gitignored via the repo-wide tmp/ rule.
    fs.mkdirSync( path.join( GIMPEL_LIB_DIR, 'tmp' ), { recursive: true } );
    const postEnd = postEndInput( filePath );
    const headerInput = header.input === null ? '' : header.input;
    // Mirror snoflake's stream layout: post-END source, then the @input
    // block. The empty-string short-circuit keeps fixtures without post-END
    // data byte-identical to the previous behavior.
    const inputBuf = postEnd === '' ? headerInput : postEnd + headerInput;
    const env = { ...process.env };
    env.SNOLIB = env.SNOLIB
        ? env.SNOLIB + path.delimiter + GIMPEL_LIB_DIR
        : GIMPEL_LIB_DIR;
    // -b suppresses the CSNOBOL4 startup banner so stdout is exactly the
    // program's OUTPUT/PUNCH stream, which is what @expect describes.
    // Cap wall-clock and output size so a runaway fixture does not hang the
    // helper or trip ENOBUFS on stdout.
    //
    // Run with cwd = GIMPEL_LIB_DIR so fixtures that open shared data files
    // via INPUT(...,'NAME') (e.g. PHRASES.IN) find them. CSNOBOL4 resolves
    // runtime INPUT() filenames against cwd, not against SNOLIB. The source
    // file is passed as an absolute path so the change of cwd does not break
    // its lookup.
    const args = [ '-b' ].concat( csnobol4FlagsForOptions( header.options ), [
        path.resolve( filePath ),
    ] );
    const result = childProcess.spawnSync( SNOBOL4_BIN, args, {
        cwd: GIMPEL_LIB_DIR,
        env,
        input: inputBuf,
        encoding: 'utf8',
        timeout: 10000,
        maxBuffer: 16 * 1024 * 1024,
        killSignal: 'SIGKILL',
    } );
    if ( result.error ) {
        let msg;
        if ( result.error.code === 'ENOENT' ) {
            msg = SNOBOL4_BIN +
                ' not found in PATH (set $SNOBOL4 to override)';
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
        status: result.status,
    };
}

function dumpActual( filePath, run ) {
    fs.mkdirSync( TMP_DIR, { recursive: true } );
    const name = path.basename( filePath, '.sno' );
    const actualPath = path.join( TMP_DIR, name + '.actual' );
    const combined = '--- stdout ---\n' + run.stdout +
        '--- stderr ---\n' + run.stderr +
        '--- exit ' + run.status + ' ---\n';
    fs.writeFileSync( actualPath, combined );
    return actualPath;
}

// Returns { ok: bool, message: string|null }.
function checkAgainstExpect( header, run ) {
    const combined = run.stdout + run.stderr;
    const marker = findErrorMarker( combined );

    if ( header.match === 'error' ) {
        // The Node test runner accepts either an error marker OR a non-zero exit
        // as evidence of an "error". CSNOBOL4 reliably exits non-zero on
        // execution errors but does not print the Snoflake-specific markers,
        // so check both.
        if ( marker === null && run.status === 0 ) {
            return {
                ok: false,
                message: 'expected an error, none observed (exit 0, no marker)',
            };
        }
        if ( header.expect !== null ) {
            // Case-insensitive: error-message text is implementation-formatted
            // (snoflake uppercase, CSNOBOL4 mixed case), and the fixture
            // describes the semantic content, not the formatting.
            const needle = trimTrailingNewlines( header.expect ).toLowerCase();
            if ( combined.toLowerCase().indexOf( needle ) === -1 ) {
                return {
                    ok: false,
                    message: 'expected substring not found in error output: ' +
                        JSON.stringify( needle ),
                };
            }
        }
        return { ok: true, message: null };
    }

    if ( marker !== null ) {
        return {
            ok: false,
            message: 'unexpected error marker "' + marker + '" in output',
        };
    }
    if ( run.status !== 0 ) {
        return {
            ok: false,
            message: 'CSNOBOL4 exited with status ' + run.status,
        };
    }

    if ( header.match === 'substring' ) {
        const sub = trimTrailingNewlines( header.expect );
        if ( run.stdout.indexOf( sub ) === -1 ) {
            return {
                ok: false,
                message: 'expected substring not found in stdout: ' +
                    JSON.stringify( sub ),
            };
        }
        return { ok: true, message: null };
    }

    // exact: CSNOBOL4 -b output IS the data section, no banner extraction.
    const actual = trimTrailingNewlines( run.stdout );
    const expect = trimTrailingNewlines( header.expect );
    if ( actual !== expect ) {
        return {
            ok: false,
            message: 'stdout did not match @expect\n--- expected ---\n' +
                expect +
                '\n--- actual ---\n' + actual,
        };
    }
    return { ok: true, message: null };
}

function formatExpectBlock( expectStr ) {
    // The fixture parser appends a trailing '\n' to single-line @expect and
    // block @expect alike, so the canonical "no trailing blank" form is just
    // the payload split by '\n' with the final empty element dropped.
    const stripped = expectStr.replace( /\n+$/, '' );
    const lines = stripped.split( '\n' );
    const out = [ '* @expect >>>' ];
    lines.forEach( function ( l ) {
        out.push( l === '' ? '*' : '* ' + l );
    } );
    out.push( '* <<<' );
    return out;
}

function rewriteExpect( filePath, newExpect ) {
    const raw = fs.readFileSync( filePath, 'utf8' );
    const lines = raw.split( '\n' );
    let expectStart = -1, expectEnd = -1;
    for ( let i = 0; i < lines.length; i++ ) {
        const line = lines[i];
        if ( line.charAt( 0 ) !== '*' ) {
            break;
        }
        const m = /^\* @(\w+)(\s.*)?$/.exec( line );
        if ( !m || m[1] !== 'expect' ) {
            continue;
        }
        const rest = ( m[2] || '' ).replace( /^\s+/, '' );
        expectStart = i;
        if ( rest === '>>>' ) {
            for ( let j = i + 1; j < lines.length; j++ ) {
                if ( lines[j] === '* <<<' ) {
                    expectEnd = j;
                    break;
                }
            }
            if ( expectEnd === -1 ) {
                throw new Error(
                    filePath + ': unterminated @expect block at line ' +
                        ( expectStart + 1 ),
                );
            }
        } else {
            expectEnd = i;
        }
        break;
    }
    if ( expectStart === -1 ) {
        throw new Error( filePath + ': no @expect directive to update' );
    }
    const formatted = formatExpectBlock( newExpect );
    const before = lines.slice( 0, expectStart );
    const after = lines.slice( expectEnd + 1 );
    fs.writeFileSync(
        filePath,
        before.concat( formatted, after ).join( '\n' ),
    );
}

function checkOne( filePath, opts ) {
    opts = opts || {};
    let header;
    try {
        header = fixture.parseHeader( filePath );
    } catch ( e ) {
        return {
            ok: false,
            title: path.basename( filePath ),
            message: 'parse error: ' + e.message,
        };
    }
    const warnings = semanticOptionWarnings( header.options );
    let run;
    try {
        run = runUnderCsnobol4( filePath, header );
    } catch ( e ) {
        return {
            ok: false,
            title: header.title,
            message: e.message,
            warnings: warnings,
        };
    }
    const result = checkAgainstExpect( header, run );

    if ( opts.update && !result.ok ) {
        // Only `exact` mode has a single canonical answer we can write back.
        // For `substring` we do not know what fragment of CSNOBOL4 stdout the
        // author meant to assert on, and `error` fixtures do not record a
        // full reference output. CSNOBOL4 errors (non-zero exit) are also
        // never written back. That would silently bake in a regression.
        if ( header.match !== 'exact' ) {
            return {
                ok: false,
                title: header.title,
                warnings: warnings,
                message: result.message,
                actualPath: dumpActual( filePath, run ),
                updateSkipped: '@match ' + header.match +
                    ' is not auto-updatable',
            };
        }
        const marker = findErrorMarker( run.stdout + run.stderr );
        if ( marker !== null || run.status !== 0 ) {
            return {
                ok: false,
                title: header.title,
                warnings: warnings,
                message: result.message,
                actualPath: dumpActual( filePath, run ),
                updateSkipped: 'CSNOBOL4 reported an error; refusing to update',
            };
        }
        try {
            rewriteExpect( filePath, run.stdout );
        } catch ( e ) {
            return {
                ok: false,
                title: header.title,
                warnings: warnings,
                message: 'rewrite failed: ' + e.message,
                actualPath: dumpActual( filePath, run ),
            };
        }
        return {
            ok: true,
            title: header.title,
            warnings: warnings,
            updated: true,
        };
    }

    const actualPath = result.ok ? null : dumpActual( filePath, run );
    return {
        ok: result.ok,
        title: header.title,
        message: result.message,
        warnings: warnings,
        actualPath: actualPath,
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
        const candidate = path.join( fixture.PROGRAMS_DIR, a );
        if ( fs.existsSync( candidate ) ) {
            return candidate;
        }
        if ( !a.endsWith( '.sno' ) ) {
            const withExt = path.join( fixture.PROGRAMS_DIR, a + '.sno' );
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
            "            CSNOBOL4's actual stdout. Only applies to @match exact\n" +
            '            fixtures whose CSNOBOL4 run did not error.\n' +
            '\n' +
            'Environment:\n' +
            '  SNOBOL4   path to the snobol4 binary (default: "snobol4")\n' +
            '\n' +
            'Exit status: 0 if every checked fixture matched (or was updated),\n' +
            '             1 otherwise.\n',
    );
}

function main( argv ) {
    if ( argv.indexOf( '--help' ) !== -1 || argv.indexOf( '-h' ) !== -1 ) {
        printHelp();
        return 0;
    }
    let update = false;
    const positional = [];
    argv.forEach( function ( a ) {
        if ( a === '--update' ) {
            update = true;
        } else if ( a.charAt( 0 ) === '-' ) {
            throw new Error( 'unknown flag: ' + a );
        } else {
            positional.push( a );
        }
    } );
    let files;
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
    let passed = 0, failed = 0, updated = 0;
    files.forEach( function ( filePath ) {
        const rel = path.relative( ROOT, filePath );
        const r = checkOne( filePath, { update: update } );
        if ( r.warnings && r.warnings.length ) {
            process.stdout.write(
                'WARN ' + rel + ': @options affects semantics (' +
                    r.warnings.join( ', ' ) + '); CSNOBOL4 ignores these\n',
            );
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
        process.stdout.write(
            'FAIL ' + rel + ' — ' + ( r.title || '' ) + '\n',
        );
        process.stdout.write(
            '     ' + r.message.replace( /\n/g, '\n     ' ) + '\n',
        );
        if ( r.updateSkipped ) {
            process.stdout.write(
                '     update skipped: ' + r.updateSkipped + '\n',
            );
        }
        if ( r.actualPath ) {
            process.stdout.write(
                '     full output: ' +
                    path.relative( ROOT, r.actualPath ) + '\n',
            );
        }
    } );
    let summary = passed + ' passed, ' + failed + ' failed';
    if ( update ) {
        summary += ', ' + updated + ' updated';
    }
    summary += ', ' + files.length + ' total\n';
    process.stdout.write( '\n' + summary );
    return failed === 0 ? 0 : 1;
}

if ( import.meta.url === pathToFileURL( process.argv[1] ).href ) {
    process.exit( main( process.argv.slice( 2 ) ) );
}

export { checkOne, main };
