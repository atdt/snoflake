// Turtle-graphics extensions for the L-system demo.
//
// SNOBOL holds the grammar and does the string rewriting; this module
// supplies the JS side -- the gallery of presets and the turtle that
// the rewritten string drives.
//
// The SNOBOL program calls:
//
//   AXIOM()STRING            starting string
//   DEPTH()INTEGER           number of rewriting generations
//   STEP()REAL               turtle step length, in segment units
//   ANGLE()REAL              turn angle, in degrees
//   LOOKUP(STRING)STRING     right-hand side for a symbol, or '' if terminal
//   EMIT(STRING)             hand a generation's string to the host
//
//   BEGIN()                  reset turtle state
//   MOVE(REAL)               draw forward
//   TURN(REAL)               rotate heading
//   PUSH()                   save position and heading
//   POP()                    restore them
//   RENDER()                 fit segments to the canvas and stroke

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

// Build a turtle bound to `canvas` and a registry of SNOBOL-callable
// extensions that drives it.  The turtle accumulates segments in memory
// during the SNOBOL run; RENDER computes the bounding box and strokes
// them scaled to fit, so each preset auto-frames itself.
export function makeTurtleExtensions( canvas, preset, onEmit ) {
    const RAD = Math.PI / 180,
          ctx = canvas.getContext( '2d' );

    let segments = [],
        stack    = [],
        x        = 0,
        y        = 0,
        heading  = 0;

    function begin() {
        segments = [];
        stack    = [];
        x        = 0;
        y        = 0;
        heading  = preset.startAngle * RAD;
    }

    function move( dist ) {
        const nx = x + dist * Math.cos( heading ),
              ny = y + dist * Math.sin( heading );
        segments.push( [ x, y, nx, ny ] );
        x = nx;
        y = ny;
    }

    function turn( deg ) {
        heading += deg * RAD;
    }

    function push() {
        stack.push( [ x, y, heading ] );
    }

    function pop() {
        const top = stack.pop();
        if ( top ) [ x, y, heading ] = top;
    }

    function render() {
        ctx.fillStyle = '#0a0e11';
        ctx.fillRect( 0, 0, canvas.width, canvas.height );
        if ( !segments.length ) return;

        // Fit segments into the canvas with a small margin.
        const pad  = 24,
              w    = canvas.width  - 2 * pad,
              h    = canvas.height - 2 * pad;

        let minX = Infinity, minY = Infinity,
            maxX = -Infinity, maxY = -Infinity;
        for ( const [ x1, y1, x2, y2 ] of segments ) {
            if ( x1 < minX ) minX = x1;
            if ( y1 < minY ) minY = y1;
            if ( x1 > maxX ) maxX = x1;
            if ( y1 > maxY ) maxY = y1;
            if ( x2 < minX ) minX = x2;
            if ( y2 < minY ) minY = y2;
            if ( x2 > maxX ) maxX = x2;
            if ( y2 > maxY ) maxY = y2;
        }

        const spanX = Math.max( maxX - minX, 1e-9 ),
              spanY = Math.max( maxY - minY, 1e-9 ),
              scale = Math.min( w / spanX, h / spanY ),
              offX  = pad + ( w - spanX * scale ) / 2 - minX * scale,
              offY  = pad + ( h - spanY * scale ) / 2 - minY * scale;

        ctx.strokeStyle = '#9fd3c7';
        ctx.lineWidth   = 1;
        ctx.lineCap     = 'round';
        ctx.beginPath();
        for ( const [ x1, y1, x2, y2 ] of segments ) {
            ctx.moveTo( offX + x1 * scale, offY + y1 * scale );
            ctx.lineTo( offX + x2 * scale, offY + y2 * scale );
        }
        ctx.stroke();
    }

    return {
        // Grammar parameters.
        'AXIOM()STRING':        () => preset.axiom,
        'DEPTH()INTEGER':       () => preset.depth,
        'STEP()REAL':           () => 1.0,
        'ANGLE()REAL':          () => preset.angle,
        'LOOKUP(STRING)STRING': ( c ) => preset.rules[ c ] || '',
        'EMIT(STRING)':         ( s ) => { if ( onEmit ) onEmit( s ); },

        // Turtle commands.
        'BEGIN()':     begin,
        'MOVE(REAL)':  move,
        'TURN(REAL)':  turn,
        'PUSH()':      push,
        'POP()':       pop,
        'RENDER()':    render,
    };
}
