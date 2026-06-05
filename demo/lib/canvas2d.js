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
