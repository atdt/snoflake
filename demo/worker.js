"use strict";

import { VM, image } from '../src/snobol.js';

const sourcePath = 'demo.sno';

function makeInteractiveReader( shared ) {
    const state = new Int32Array( shared.state ),
          line = new Uint8Array( shared.line );

    return function () {
        let drained = false;

        return {
            readLine() {
                if ( drained ) return null;

                while ( true ) {
                    const signal = Atomics.load( state, 0 );
                    if ( signal === 2 ) {
                        drained = true;
                        return null;
                    }
                    if ( signal === 1 ) {
                        const length = Atomics.load( state, 1 ),
                              value = line.slice( 0, length );

                        Atomics.store( state, 1, 0 );
                        Atomics.store( state, 0, 0 );
                        Atomics.notify( state, 0 );

                        return value;
                    }

                    Atomics.wait( state, 0, 0 );
                }
            },

            drain() {
                drained = true;
                Atomics.store( state, 0, 2 );
                Atomics.notify( state, 0 );
            }
        };
    };
}

function postLine( type, line ) {
    self.postMessage( { type, line } );
}

function run( source, stdin ) {
    const vm = new VM( {
        file: sourcePath,
        interactive: true,
        stdout: { write: line => postLine( 'stdout', line ) },
        stderr: { write: line => postLine( 'stderr', line ) },
        stdinReader: makeInteractiveReader( stdin ),
        loader: {
            load( path ) {
                if ( path !== sourcePath ) {
                    throw new Error( 'No demo file named ' + path );
                }
                return source;
            }
        }
    } );

    try {
        vm.run( image );
    } catch ( e ) {
        postLine( 'stderr', 'Execution error: ' + ( e && e.message || e ) );
    }

    self.postMessage( { type: 'done', exitCode: vm.exitCode } );
}

self.addEventListener( 'message', function ( event ) {
    const message = event.data;
    if ( message.type === 'start' ) {
        run( message.source, message.stdin );
    }
} );
