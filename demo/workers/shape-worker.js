// Worker host for the shape-grammar demo.
//
// The SNOBOL program does the layout; it calls out to JavaScript for
// the things a string-rewriting language has no business doing itself:
//
//   EMIT    streams a finished box to the canvas3d scene
//   FLOORS  returns a random building height, skewed toward mid-rises
//   TINT    returns one of the curtain-wall glass colours

import { run } from '../../src/snobol.js';

self.addEventListener( 'message', function ( event ) {
    if ( event.data.type !== 'start' ) return;

    const post = ( type, line ) => self.postMessage( { type, line } );

    try {
        const { exitCode } = run( {
            source: event.data.source,
            sourcePath: 'shape-grammar.sno',
            stdout: { write: ( line ) => post( 'stdout', line ) },
            stderr: { write: ( line ) => post( 'stderr', line ) },
            extensions: {
                // The renderer's only entry point.
                'EMIT(INTEGER,INTEGER,INTEGER,INTEGER,INTEGER,INTEGER,STRING)':
                    ( x, y, z, w, h, d, color ) => {
                        self.postMessage( {
                            type: 'box',
                            box: { x, y, z, w, h, d, color },
                        } );
                    },
                // Squaring a uniform sample skews low: many mid-rises,
                // a few towers.
                'FLOORS()INTEGER': () => {
                    const r = Math.floor( Math.random() * 34 );
                    return Math.floor( r * r / 72 ) + 2;
                },
                // One of the four glass tints defined in canvas3d.js.
                'TINT()STRING': () =>
                    'GLS' + ( 1 + Math.floor( Math.random() * 4 ) ),
            },
        } );
        self.postMessage( { type: 'done', exitCode } );
    } catch ( e ) {
        post( 'stderr', 'Execution error: ' + ( e?.message || e ) );
        self.postMessage( { type: 'done', exitCode: 1 } );
    }
} );
