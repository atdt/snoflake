"use strict";

import assert from 'node:assert';
import { runSnoflake } from '../demo/run-snoflake.js';

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
} );
