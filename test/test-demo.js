import assert from 'node:assert';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import { runSnoflake } from '../demo/lib/runner.js';
import {
    makeAutomatonExtensions,
    presets as automataPresets,
} from '../demo/lib/automata.js';
import {
    makeTurtleExtensions,
    presets as lsystemPresets,
} from '../demo/lib/turtle.js';

describe('browser demo runner', function () {
    it('runs the preloaded style of program from an in-memory source', function () {
        const result = runSnoflake( [
            " OUTPUT = 'HELLO FROM DEMO'",
            'END',
            '',
        ].join( '\n' ) );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /HELLO FROM DEMO/ );
    });

    it('feeds runtime INPUT from in-memory text', function () {
        const result = runSnoflake(
            [
                'READ LINE = INPUT :F(END)',
                ' OUTPUT = LINE',
                ' :(READ)',
                'END',
                '',
            ].join( '\n' ),
            {
                inputText: [
                    'FIRST',
                    'SECOND',
                    '',
                ].join( '\n' ),
            },
        );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /FIRST/ );
        assert.match( result.stdout, /SECOND/ );
    });

    it('keeps the original pattern-matcher demo runnable', function () {
        const result = runSnoflake(
            fs.readFileSync( 'demo/programs/pattern-matcher.sno', 'utf8' ),
            { inputText: 'THE BLUEBIRD\nGOLDFISH\n' },
        );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /BLUE/ );
        assert.match( result.stdout, /BIRD/ );
        assert.match( result.stdout, /GOLD/ );
        assert.match( result.stdout, /FISH/ );
    });

    it('runs ELIZA as a batch companion demo with scripted input', function () {
        const result = runSnoflake(
            fs.readFileSync( 'demo/programs/eliza.sno', 'utf8' ),
            { inputText: 'I feel nervous about computers\nbye\n' },
        );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /PLEASE TELL ME ABOUT YOUR PROBLEM\./ );
        assert.match( result.stdout, /I HAVE ENJOYED TALKING WITH YOU\./ );
    });

    it('can read runtime INPUT from an injected interactive reader', function () {
        const result = runSnoflake(
            [
                'READ LINE = INPUT :F(END)',
                ' OUTPUT = LINE',
                ' :(READ)',
                'END',
                '',
            ].join( '\n' ),
            {
                interactive: true,
                stdinReader: () => bufferedLineReader( [ 'LIVE' ] ),
            },
        );

        assert.equal( result.stderr, '' );
        assert.match( result.stdout, /LIVE/ );
    });

    it('draws the Koch snowflake through the canvas bindings', function () {
        const { canvas, ops } = stubCanvas( 480, 360 );
        const generations = [];
        const result = runSnoflake(
            fs.readFileSync( 'demo/programs/lsystem.sno', 'utf8' ),
            {
                extensions: makeTurtleExtensions(
                    canvas,
                    lsystemPresets.koch,
                    ( s ) => generations.push( s ),
                ),
            },
        );

        assert.equal( result.exitCode, 0, result.stdout );
        // Four generations of F -> F-F++F-F turn 3 sides into 3 * 4^4
        // segments, drawn inside the 24-pixel margin.
        assert.equal( generations.length, 5 );
        const lines = ops.filter( ( op ) => op[0] === 'lineTo' );
        assert.equal( lines.length, 768 );
        for ( const [ , x, y ] of lines ) {
            assert.ok( x >= 24 && x <= 456 && y >= 24 && y <= 336 );
        }
    });

    it('paints rule 90 as a Sierpinski triangle of cells', function () {
        const { canvas, ops } = stubCanvas( 480, 360 );
        const result = runSnoflake(
            fs.readFileSync( 'demo/programs/cellular-automata.sno', 'utf8' ),
            {
                extensions: makeAutomatonExtensions(
                    canvas,
                    automataPresets.rule90,
                ),
            },
        );

        assert.equal( result.exitCode, 0, result.stdout );
        // ops[0] is CLEAR's full-canvas fill; each later fillRect is one
        // live cell. 80 rows from a single seed light sum(2^popcount(r))
        // cells, and a 161x80 grid fits a 480x360 canvas at cell size 2.
        const cells = ops.filter( ( op ) => op[0] === 'fillRect' ).slice( 1 );
        assert.equal( cells.length, 891 );
        assert.equal( cells[0][3], 2 );
        for ( const [ , x, y ] of cells ) {
            assert.ok( x >= 79 && x < 401 && y >= 100 && y < 260 );
        }
    });
});

function stubCanvas( width, height ) {
    const ops = [];
    const ctx = {
        beginPath: () => {},
        stroke: () => {},
        moveTo: ( x, y ) => ops.push( [ 'moveTo', x, y ] ),
        lineTo: ( x, y ) => ops.push( [ 'lineTo', x, y ] ),
        fillRect: ( x, y, w, h ) => ops.push( [ 'fillRect', x, y, w, h ] ),
    };
    const canvas = { width, height, getContext: () => ctx };
    ctx.canvas = canvas;
    return { canvas, ops };
}

function bufferedLineReader( lines ) {
    let pos = 0;
    return {
        readLine() {
            if ( pos >= lines.length ) return null;
            return new TextEncoder().encode( lines[pos++] );
        },
    };
}
