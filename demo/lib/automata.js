// Host-side support for the elementary CA demo.
//
// SNOBOL holds the rewrite engine; this module supplies the rule
// tables, the initial row, and a pixel renderer for the final grid.
//
// The SNOBOL program calls:
//
//   RULE()        -> string   8-char table, position k -> next cell
//                             for neighborhood k (000..111)
//   INIT()        -> string   the row 0 bits
//   HEIGHT()      -> int      number of rows to compute
//   EMIT(row)     -> void     hand a completed row to the host
//   RENDER()      -> void     paint the accumulated rows on the canvas

// The gallery.  `init` is 'seed' (single 1 in the middle) or 'random'.
export const presets = {
    rule30:  { label: 'Rule 30 (chaos)',         rule: 30,  init: 'seed' },
    rule90:  { label: 'Rule 90 (Sierpinski)',    rule: 90,  init: 'seed' },
    rule110: { label: 'Rule 110 (gliders)',      rule: 110, init: 'random' },
    rule184: { label: 'Rule 184 (traffic)',      rule: 184, init: 'random' },
    rule54:  { label: 'Rule 54',                 rule: 54,  init: 'seed' },
};

// WIDTH = 2*HEIGHT + 1 so a single seed never hits the dead-cell
// boundary: the triangle's leading edges grow 1 cell per row in each
// direction, and we want a clean envelope across the full run.
const HEIGHT = 80, WIDTH = 2 * HEIGHT + 1;

// Encode a Wolfram rule number as the 8-char lookup table SNOBOL reads:
// position k = bit k of the rule number, so RULE[0] is the next-state
// for neighborhood 000 and RULE[7] for neighborhood 111.
function ruleString( n ) {
    let s = '';
    for ( let k = 0; k < 8; k++ ) s += ( ( n >> k ) & 1 ) ? '1' : '0';
    return s;
}

function initRow( kind ) {
    if ( kind === 'seed' ) {
        const half = ( WIDTH - 1 ) >> 1;
        return '0'.repeat( half ) + '1' + '0'.repeat( WIDTH - half - 1 );
    }
    let s = '';
    for ( let i = 0; i < WIDTH; i++ ) s += Math.random() < 0.5 ? '1' : '0';
    return s;
}

function paintGrid( canvas, rows ) {
    const ctx = canvas.getContext( '2d' );
    ctx.fillStyle = '#0a0e11';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
    if ( !rows.length ) return;

    const w    = rows[ 0 ].length,
          h    = rows.length,
          cell = Math.max( 1, Math.floor( Math.min(
              canvas.width  / w,
              canvas.height / h,
          ) ) ),
          offX = Math.floor( ( canvas.width  - w * cell ) / 2 ),
          offY = Math.floor( ( canvas.height - h * cell ) / 2 );

    ctx.fillStyle = '#9fd3c7';
    for ( let r = 0; r < h; r++ ) {
        const row = rows[ r ];
        for ( let c = 0; c < w; c++ ) {
            if ( row.charCodeAt( c ) === 49 /* '1' */ ) {
                ctx.fillRect( offX + c * cell, offY + r * cell, cell, cell );
            }
        }
    }
}

export function makeAutomatonExtensions( canvas, preset ) {
    const rows = [];

    return {
        'RULE()STRING':    () => ruleString( preset.rule ),
        'INIT()STRING':    () => initRow( preset.init ),
        'HEIGHT()INTEGER': () => HEIGHT,
        'EMIT(STRING)':    ( s ) => { rows.push( s ); },
        'RENDER()':        () => paintGrid( canvas, rows ),
    };
}
