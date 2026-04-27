"use strict";

var assert = require( 'assert' ),
    childProcess = require( 'child_process' ),
    fs = require( 'fs' ),
    path = require( 'path' );

var root = path.join( __dirname, '..' ),
    tmp = path.join( root, 'tmp' );

function runSource( name, lines ) {
    var file = path.join( tmp, name + '.sno' );

    fs.mkdirSync( tmp, { recursive: true } );
    fs.writeFileSync( file, lines.concat( '' ).join( '\n' ) );

    return childProcess.execFileSync( process.execPath, [
        'run.js',
        '--file=tmp/' + path.basename( file ),
        '--maxSteps=100000',
        '--maxMillis=1000'
    ], {
        cwd: root,
        encoding: 'utf8'
    } );
}

describe( 'SNOBOL Character Pattern Functions', function () {
    it( 'matches ANY, NOTANY, SPAN, and BREAK examples', function () {
        var output = runSource( 'test-character-patterns', [
            " 'ABC' ANY('A') . OUTPUT",
            " 'ABC' NOTANY('BC') . OUTPUT",
            " 'UUA' SPAN('U') . OUTPUT",
            " 'ACB' SPAN('AC') . OUTPUT",
            " 'SAMPLE,TEN' BREAK(',') . OUTPUT",
            " 'SAMPLE,TEN,' BREAK(',') LEN(1) BREAK(',') . OUTPUT",
            " 'X-43Y' BREAK('-') (LEN(1) SPAN('0123456789')) . OUTPUT",
            'END'
        ] );

        assert( output.includes( '\nA\nA\nUU\nAC\nSAMPLE\nTEN\n-43\n' ) );
        assert( !output.includes( 'ERROR IN SNOBOL4 SYSTEM' ) );
        assert( !output.includes( 'ReferenceError' ) );
        assert( !output.includes( 'Aborting: exceeded' ) );
    } );
} );
