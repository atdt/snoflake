import assert from 'node:assert';
import { describe, it } from 'node:test';
import { createSession } from '../src/snobol.js';

// An echo loop: read a line, echo it, repeat until INPUT fails at EOF.
const ECHO = [
    'LOOP LINE = INPUT                  :F(DONE)',
    "     OUTPUT = 'YOU SAID: ' LINE     :(LOOP)",
    "DONE OUTPUT = 'BYE'",
    'END',
    '',
].join( '\n' );

function collector() {
    const out = [], err = [];
    let exitCode = null;
    return {
        out,
        err,
        get exitCode() {
            return exitCode;
        },
        onOutput: ( line ) => out.push( line ),
        onError: ( line ) => err.push( line ),
        onDone: ( code ) => {
            exitCode = code;
        },
    };
}

describe('interactive Session', function () {
    it('suspends on a read until the host sends a line', function () {
        const c = collector();
        const s = createSession( { source: ECHO, ...c } );

        s.start();
        // The first INPUT has nothing to read, so the program is paused
        // before it can echo anything.
        assert.deepEqual( c.out, [] );
        assert.equal( s.done, false );

        s.send( 'HELLO' );
        assert.deepEqual( c.out, [ 'YOU SAID: HELLO' ] );

        s.send( 'WORLD' );
        assert.deepEqual( c.out, [ 'YOU SAID: HELLO', 'YOU SAID: WORLD' ] );
        assert.equal( s.done, false );
    });

    it('runs to completion when input ends', function () {
        const c = collector();
        const s = createSession( { source: ECHO, ...c } );

        s.start();
        s.send( 'ONLY LINE' );
        s.end(); // EOF -> the INPUT read fails -> :F(DONE)

        assert.deepEqual( c.out, [ 'YOU SAID: ONLY LINE', 'BYE' ] );
        assert.equal( s.done, true );
        assert.equal( s.exitCode, 0 );
        assert.equal( c.exitCode, 0 );
    });

    it('runs a non-interactive program to completion on start', function () {
        const c = collector();
        const s = createSession( {
            source: " OUTPUT = 'NO INPUT NEEDED'\nEND\n",
            ...c,
        } );

        s.start();
        assert.deepEqual( c.out, [ 'NO INPUT NEEDED' ] );
        assert.equal( s.done, true );
    });

    it('sends extension results into the running program', function () {
        const c = collector();
        const s = createSession( {
            source: " OUTPUT = 'DOUBLE: ' DOUBLE(21)\nEND\n",
            extensions: { 'DOUBLE(INTEGER)INTEGER': ( n ) => n * 2 },
            ...c,
        } );

        s.start();
        assert.deepEqual( c.out, [ 'DOUBLE: 42' ] );
    });
});
