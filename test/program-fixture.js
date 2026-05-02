'use strict';

// Shared parser for the fixture format documented in test/programs/README.md.
// Both the mocha runner (test/test-programs.js) and the CSNOBOL4 cross-check
// helper (tools/check-csnobol4.js) consume fixtures through this module so the
// two stay in lockstep.

var fs = require( 'fs' ),
    path = require( 'path' );

var PROGRAMS_DIR = path.join( __dirname, 'programs' );

var VALID_MATCH_MODES = [ 'exact', 'substring', 'error' ];

function parseHeader( filePath ) {
    var raw = fs.readFileSync( filePath, 'utf8' );
    var lines = raw.split( '\n' );
    var header = {
        title: null,
        options: {},
        input: null,
        expect: null,
        match: 'exact',
        attribution: null
    };
    var seen = {};
    var i;

    for ( i = 0; i < lines.length; i++ ) {
        var line = lines[ i ];
        if ( line.charAt( 0 ) !== '*' ) {
            break;
        }
        var m = /^\* @(\w+)(\s.*)?$/.exec( line );
        if ( !m ) {
            continue;
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
        header.expect = isBlock ? value : value + '\n';
        return;
    }
    if ( key === 'attribution' ) {
        if ( isBlock ) {
            throw new Error( filePath + ': @attribution must be single-line' );
        }
        if ( value === '' ) {
            throw new Error( filePath + ': @attribution must not be empty' );
        }
        header.attribution = value;
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

function loadCases() {
    if ( !fs.existsSync( PROGRAMS_DIR ) ) {
        return [];
    }
    return fs.readdirSync( PROGRAMS_DIR )
        .filter( function ( name ) { return /\.sno$/.test( name ); } )
        .sort()
        .map( function ( name ) { return path.join( PROGRAMS_DIR, name ); } );
}

module.exports = {
    PROGRAMS_DIR: PROGRAMS_DIR,
    VALID_MATCH_MODES: VALID_MATCH_MODES,
    parseHeader: parseHeader,
    loadCases: loadCases
};
