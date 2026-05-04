"use strict";

import SNOBOL from './base.js';

// I/O adapters that decouple the runtime from Node-specific globals so the
// VM can be embedded in non-Node hosts (browsers, web workers, test
// harnesses that want to capture output in-process).
//
// Writer interface — used by SIL macros and File.write to emit program
// output and runtime diagnostics:
//
//     writer.write(line)
//
// Each call delivers one logical line, without a trailing newline. The
// adapter is responsible for line termination appropriate to its sink. The
// Node adapter delegates to console.log / console.error, which append '\n';
// a browser adapter might do `pre.append(line + '\n')`.
//
// Loader interface — used by SNOBOL.File to read source and input data:
//
//     loader.load(path) -> Uint8Array | Buffer
//
// Synchronous, because File.readRecord is called from inside the dispatch
// loop. Browser adapters typically preload sources into a map keyed by path.

SNOBOL.io = {
    nodeStdout: {
        write( line ) { console.log( line ); }
    },
    nodeStderr: {
        write( line ) { console.error( line ); }
    },
    nodeLoader: {
        load( path ) {
            const fs = globalThis.process &&
                globalThis.process.getBuiltinModule &&
                globalThis.process.getBuiltinModule( 'fs' );

            if ( !fs ) {
                throw new Error( 'No file loader configured for this host' );
            }

            return fs.readFileSync( path );
        }
    }
};
