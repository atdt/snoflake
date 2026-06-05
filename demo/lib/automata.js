// Presets and bindings for the elementary CA demo.
//
// SNOBOL does the work: it decodes the Wolfram rule number, builds
// row 0, steps the automaton, and paints the cells. This module
// supplies the preset gallery, the bindings that read it, a random
// bit source, and the canvas verbs from canvas2d.js.
//
//   RULE()INTEGER            the Wolfram rule number
//   INITKIND()STRING         'seed' or 'random' for row 0
//   ROWS()INTEGER            number of rows to compute
//   RANDBIT()INTEGER         a random 0 or 1

import { makeCanvasExtensions } from './canvas2d.js';

// The gallery.  `init` is 'seed' (single 1 in the middle) or 'random'.
export const presets = {
    rule30: { label: 'Rule 30 (chaos)', rule: 30, init: 'seed' },
    rule90: { label: 'Rule 90 (Sierpinski)', rule: 90, init: 'seed' },
    rule110: { label: 'Rule 110 (gliders)', rule: 110, init: 'random' },
    rule184: { label: 'Rule 184 (traffic)', rule: 184, init: 'random' },
    rule54: { label: 'Rule 54', rule: 54, init: 'seed' },
};

export function makeAutomatonExtensions( canvas, preset ) {
    return {
        ...makeCanvasExtensions( canvas ),
        'RULE()INTEGER': () => preset.rule,
        'INITKIND()STRING': () => preset.init,
        'ROWS()INTEGER': () => 80,
        'RANDBIT()INTEGER': () => ( Math.random() < 0.5 ? 1 : 0 ),
    };
}
