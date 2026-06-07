// Runs the editor's program in a worker so the page stays responsive. It posts
// 'ready' once the module has loaded, so the host can hold the first run until
// then. The input pane is served as the program's input file, so INPUT reads
// it line by line. The extra file panes are served by pane name, so -INCLUDE
// and INPUT()/OUTPUT() redirects reach them.

import * as SNOBOL from '../../src/snobol.js';

self.postMessage( { type: 'ready' } );

self.onmessage = ( event ) => {
    const { source, input, files } = event.data,
        write = ( line ) => self.postMessage( { type: 'line', line } );

    try {
        SNOBOL.run( {
            source,
            input: 'input.txt',
            loader: {
                load( path ) {
                    if ( path === 'input.txt' ) return input;
                    if ( Object.hasOwn( files, path ) ) return files[path];
                    throw new Error( 'No such file: ' + path );
                },
                loadInclude( path ) {
                    return Object.hasOwn( files, path )
                        ? { path, content: files[path] }
                        : null;
                },
            },
            // A host-provided builtin: Date.now() is epoch time, so programs
            // can seed an RNG with TIMESTAMP() and vary each run. Registered
            // extensions are LOADed for every program.
            extensions: {
                'TIMESTAMP()INTEGER': () => Date.now(),
            },
            stdout: { write },
            stderr: { write },
        } );
        self.postMessage( { type: 'done' } );
    } catch ( e ) {
        self.postMessage( {
            type: 'error',
            message: String( e?.message || e ),
        } );
    }
};
