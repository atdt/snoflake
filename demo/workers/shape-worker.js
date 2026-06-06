// Worker host for the shape-grammar demo.
//
// The SNOBOL program calls EMIT(x, y, z, w, h, d, color) on every
// terminal box. We register EMIT as a host extension and stream each
// call to the main thread, where the canvas3d scene appends it.

import { image, VM } from '../../src/snobol.js';

const sourcePath = 'shape-grammar.sno';

self.addEventListener( 'message', function ( event ) {
    if ( event.data.type !== 'start' ) return;

    const source = event.data.source,
        stdout = {
            write: ( line ) => self.postMessage( { type: 'stdout', line } ),
        },
        stderr = {
            write: ( line ) => self.postMessage( { type: 'stderr', line } ),
        },
        vm = new VM( {
            file: sourcePath,
            stdout,
            stderr,
            loader: {
                load( path ) {
                    if ( path !== sourcePath ) {
                        throw new Error( 'No demo file named ' + path );
                    }
                    return source;
                },
            },
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

    try {
        vm.run( image );
        self.postMessage( { type: 'done', exitCode: vm.exitCode } );
    } catch ( e ) {
        self.postMessage( {
            type: 'stderr',
            line: 'Execution error: ' + ( e && e.message || e ),
        } );
        self.postMessage( { type: 'done', exitCode: 1 } );
    }
} );
