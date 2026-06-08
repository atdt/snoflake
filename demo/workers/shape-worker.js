// Worker host for the shape-grammar demo.
//
// The SNOBOL program calls EMIT(x, y, z, w, h, d, color) on every
// terminal box. We register EMIT as a host extension and stream each
// call to the main thread, where the canvas3d scene appends it.

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
            },
        } );
        self.postMessage( { type: 'done', exitCode } );
    } catch ( e ) {
        post( 'stderr', 'Execution error: ' + ( e?.message || e ) );
        self.postMessage( { type: 'done', exitCode: 1 } );
    }
} );
