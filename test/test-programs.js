'use strict';

var assert = require( 'assert' ),
    childProcess = require( 'child_process' ),
    fs = require( 'fs' ),
    path = require( 'path' );

var ROOT = path.join( __dirname, '..' ),
    PROGRAMS_DIR = path.join( __dirname, 'programs' ),
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

var VALID_MATCH_MODES = [ 'exact', 'substring', 'error' ];

function parseHeader( filePath ) {
    var raw = fs.readFileSync( filePath, 'utf8' );
    var lines = raw.split( '\n' );
    var header = {
        title: null,
        options: {},
        input: null,
        expect: null,
        match: 'exact'
    };
    var seen = {};
    var i;

    for ( i = 0; i < lines.length; i++ ) {
        var line = lines[ i ];
        if ( line.charAt( 0 ) !== '*' ) {
            break; // header ends at the first non-comment line
        }
        var m = /^\* @(\w+)(\s.*)?$/.exec( line );
        if ( !m ) {
            continue; // plain SNOBOL comment in the header — ignore
        }
        var key = m[ 1 ];
        var rest = ( m[ 2 ] || '' ).replace( /^\s+/, '' );

        if ( seen[ key ] ) {
            throw new Error( filePath + ':' + ( i + 1 ) + ': duplicate @' + key );
        }
        seen[ key ] = true;

        var value;
        var isBlock;
        if ( rest === '>>>' ) {
            isBlock = true;
            var blockStart = i;
            var blockLines = [];
            i++;
            while ( i < lines.length ) {
                var bl = lines[ i ];
                if ( bl === '* <<<' ) {
                    break;
                }
                if ( bl === '*' ) {
                    blockLines.push( '' );
                } else if ( bl.slice( 0, 2 ) === '* ' ) {
                    blockLines.push( bl.slice( 2 ) );
                } else {
                    throw new Error( filePath + ':' + ( i + 1 ) +
                        ': malformed line in @' + key + ' block: ' + JSON.stringify( bl ) );
                }
                i++;
            }
            if ( i >= lines.length ) {
                throw new Error( filePath + ':' + ( blockStart + 1 ) +
                    ': unterminated @' + key + ' block' );
            }
            value = blockLines.join( '\n' ) + '\n';
        } else {
            isBlock = false;
            value = rest;
        }
        applyDirective( filePath, header, key, value, isBlock );
    }

    if ( header.title === null ) {
        throw new Error( filePath + ': missing required @title' );
    }
    if ( ( header.match === 'exact' || header.match === 'substring' ) && header.expect === null ) {
        throw new Error( filePath + ': @expect is required for @match ' + header.match );
    }

    return header;
}

function applyDirective( filePath, header, key, value, isBlock ) {
    if ( key === 'title' ) {
        if ( isBlock ) {
            throw new Error( filePath + ': @title must be single-line' );
        }
        if ( value === '' ) {
            throw new Error( filePath + ': @title must not be empty' );
        }
        header.title = value;
        return;
    }
    if ( key === 'options' ) {
        if ( isBlock ) {
            throw new Error( filePath + ': @options must be single-line' );
        }
        var parsed;
        try {
            parsed = JSON.parse( value );
        } catch ( e ) {
            throw new Error( filePath + ': @options is not valid JSON: ' + e.message );
        }
        if ( parsed === null || typeof parsed !== 'object' || Array.isArray( parsed ) ) {
            throw new Error( filePath + ': @options must be a JSON object' );
        }
        if ( 'file' in parsed ) {
            throw new Error( filePath + ': @options must not set "file" (reserved by runner)' );
        }
        if ( 'input' in parsed ) {
            throw new Error( filePath + ': @options must not set "input" (use @input block)' );
        }
        header.options = parsed;
        return;
    }
    if ( key === 'input' ) {
        if ( !isBlock ) {
            throw new Error( filePath + ': @input must use the multi-line block form' );
        }
        header.input = value;
        return;
    }
    if ( key === 'expect' ) {
        // Block form already has the trailing \n appended; single-line gets one
        // appended so both forms describe "one or more newline-terminated lines".
        header.expect = isBlock ? value : value + '\n';
        return;
    }
    if ( key === 'match' ) {
        if ( isBlock ) {
            throw new Error( filePath + ': @match must be single-line' );
        }
        if ( VALID_MATCH_MODES.indexOf( value ) === -1 ) {
            throw new Error( filePath + ': @match must be one of ' +
                VALID_MATCH_MODES.join( '|' ) + ' (got ' + JSON.stringify( value ) + ')' );
        }
        header.match = value;
        return;
    }
    throw new Error( filePath + ': unknown directive @' + key );
}

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

function loadCases() {
    if ( !fs.existsSync( PROGRAMS_DIR ) ) {
        return [];
    }
    return fs.readdirSync( PROGRAMS_DIR )
        .filter( function ( name ) { return /\.sno$/.test( name ); } )
        .sort()
        .map( function ( name ) { return path.join( PROGRAMS_DIR, name ); } );
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
