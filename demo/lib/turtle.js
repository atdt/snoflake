// Presets and bindings for the L-system demo.
//
// SNOBOL does the work: it rewrites the grammar and walks the result
// as a turtle, scaling the drawing to fit. This module supplies the
// preset gallery, the bindings that read it, and the canvas verbs
// from canvas2d.js.
//
//   AXIOM()STRING            starting string
//   DEPTH()INTEGER           number of rewriting generations
//   ANGLE()REAL              turn angle, in degrees
//   STARTANGLE()REAL         initial heading, in degrees
//   LOOKUP(STRING)STRING     right-hand side for a symbol, or '' if terminal
//   EMIT(STRING)             hand a generation's string to the host

import { makeCanvasExtensions } from './canvas2d.js';

// The gallery.  Each preset's rules table maps a non-terminal symbol to
// its right-hand side; symbols outside the table (F, +, -, [, ], or
// anything else) are terminals copied through unchanged.  startAngle is
// in screen-space degrees: 0 points right, -90 points up.
export const presets = {
    koch: {
        label: 'Koch snowflake',
        axiom: 'F++F++F',
        rules: { F: 'F-F++F-F' },
        depth: 4,
        angle: 60,
        startAngle: 0,
    },
    'koch-square': {
        label: 'Square Koch curve',
        axiom: 'F',
        rules: { F: 'F+F-F-F+F' },
        depth: 3,
        angle: 90,
        startAngle: 0,
    },
    dragon: {
        label: 'Dragon curve',
        axiom: 'FX',
        rules: { X: 'X+YF+', Y: '-FX-Y' },
        depth: 11,
        angle: 90,
        startAngle: 0,
    },
    hilbert: {
        label: 'Hilbert curve',
        axiom: 'A',
        rules: {
            A: '+BF-AFA-FB+',
            B: '-AF+BFB+FA-',
        },
        depth: 5,
        angle: 90,
        startAngle: 0,
    },
    plant: {
        label: 'Fractal plant',
        axiom: 'X',
        rules: {
            X: 'F+[[X]-X]-F[-FX]+X',
            F: 'FF',
        },
        depth: 5,
        angle: 25,
        startAngle: -90,
    },
};

export function makeTurtleExtensions( canvas, preset, onEmit ) {
    return {
        ...makeCanvasExtensions( canvas ),
        'AXIOM()STRING': () => preset.axiom,
        'DEPTH()INTEGER': () => preset.depth,
        'ANGLE()REAL': () => preset.angle,
        'STARTANGLE()REAL': () => preset.startAngle,
        'LOOKUP(STRING)STRING': ( c ) => preset.rules[c] || '',
        'EMIT(STRING)': ( s ) => {
            if ( onEmit ) onEmit( s );
        },
    };
}
