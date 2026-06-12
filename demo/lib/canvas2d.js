// Narrow <canvas> bindings shared by the drawing demos.
//
// The verbs are thin wrappers over the 2-D context of the demo's
// canvas. What to draw -- shapes, colors, scaling -- is the SNOBOL
// program's business.
//
//   WIDTH()INTEGER                 canvas size in pixels
//   HEIGHT()INTEGER
//   COLOR(STRING)                  set the fill and stroke color
//   CLEAR()                        fill the whole canvas
//   FILLRECT(REAL,REAL,REAL,REAL)
//   MOVETO(REAL,REAL)              start or break a path
//   LINETO(REAL,REAL)              extend the path
//   STROKE()                       stroke the path and reset it

export function makeCanvasExtensions( canvas ) {
    const ctx = canvas.getContext( '2d' );
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.beginPath();

    return {
        'WIDTH()INTEGER': () => canvas.width,
        'HEIGHT()INTEGER': () => canvas.height,
        'COLOR(STRING)': ( color ) => {
            ctx.fillStyle = ctx.strokeStyle = color;
        },
        'CLEAR()': () => ctx.fillRect( 0, 0, canvas.width, canvas.height ),
        'FILLRECT(REAL,REAL,REAL,REAL)': ( x, y, w, h ) =>
            ctx.fillRect( x, y, w, h ),
        'MOVETO(REAL,REAL)': ( x, y ) => ctx.moveTo( x, y ),
        'LINETO(REAL,REAL)': ( x, y ) => ctx.lineTo( x, y ),
        'STROKE()': () => {
            ctx.stroke();
            ctx.beginPath();
        },
    };
}

// A stand-in canvas for running the demos off the main thread, where there
// is no real one. Its context records every call and assignment in order;
// replay() applies that list to a live canvas. WIDTH/HEIGHT answer from the
// size passed here, since CLEAR and the program read it back.
export function recordingCanvas( width, height ) {
    const commands = [],
        ctx = new Proxy( {}, {
            get: ( _target, op ) => ( ...args ) =>
                commands.push( [ 'call', op, args ] ),
            set: ( _target, op, value ) => {
                commands.push( [ 'set', op, value ] );
                return true;
            },
        } );
    return { canvas: { width, height, getContext: () => ctx }, commands };
}

export function replay( canvas, commands ) {
    const ctx = canvas.getContext( '2d' );
    for ( const [ kind, op, payload ] of commands ) {
        if ( kind === 'set' ) ctx[op] = payload;
        else ctx[op]( ...payload );
    }
}
