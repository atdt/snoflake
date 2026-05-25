import assert from 'node:assert';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { runSnoflake } from '../demo/lib/runner.js';

describe( 'browser demo runner', function () {
    it( 'runs the preloaded style of program from an in-memory source', function () {
        const result = runSnoflake( [
            " OUTPUT = 'HELLO FROM DEMO'",
            "END",
            ""
        ].join( '\n' ) );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /HELLO FROM DEMO/ );
    } );

    it( 'feeds runtime INPUT from in-memory text', function () {
        const result = runSnoflake( [
            "READ LINE = INPUT :F(END)",
            " OUTPUT = LINE",
            " :(READ)",
            "END",
            ""
        ].join( '\n' ), {
            inputText: [
                "FIRST",
                "SECOND",
                ""
            ].join( '\n' )
        } );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /FIRST/ );
        assert.match( result.stdout, /SECOND/ );
    } );

    it( 'keeps the original pattern-matcher demo runnable', function () {
        const result = runSnoflake(
            fs.readFileSync( 'demo/programs/pattern-matcher.sno', 'utf8' ),
            { inputText: 'THE BLUEBIRD\nGOLDFISH\n' }
        );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /BLUE/ );
        assert.match( result.stdout, /BIRD/ );
        assert.match( result.stdout, /GOLD/ );
        assert.match( result.stdout, /FISH/ );
    } );

    it( 'runs ELIZA as a batch companion demo with scripted input', function () {
        const result = runSnoflake(
            fs.readFileSync( 'demo/programs/eliza.sno', 'utf8' ),
            { inputText: 'I feel nervous about computers\nbye\n' }
        );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /PLEASE TELL ME ABOUT YOUR PROBLEM\./ );
        assert.match( result.stdout, /I HAVE ENJOYED TALKING WITH YOU\./ );
    } );

    it( 'can read runtime INPUT from an injected interactive reader', function () {
        const result = runSnoflake( [
            "READ LINE = INPUT :F(END)",
            " OUTPUT = LINE",
            " :(READ)",
            "END",
            ""
        ].join( '\n' ), {
            interactive: true,
            stdinReader: () => bufferedLineReader( [ 'LIVE' ] ),
        } );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /LIVE/ );
    } );
} );

function bufferedLineReader( lines ) {
    let pos = 0;
    return {
        readLine() {
            if ( pos >= lines.length ) return null;
            return new TextEncoder().encode( lines[ pos++ ] );
        },
    };
}
