// Small Node adapters for the VM defaults. Browser and test hosts pass their
// own stdout writer or loader through VM options.
//
// Writer:
//
//     writer.write(line)
//
// Each call receives one logical line without a trailing newline. The adapter
// decides how to terminate it.
//
// Loader:
//
//     loader.load(path) -> Uint8Array | Buffer
//
// Loading is synchronous because STREAD runs inside the VM dispatch loop.

export const nodeStdout = {
    write( line ) { console.log( line ); }
};

export const nodeLoader = {
    load( path ) {
        const fs = globalThis.process &&
            globalThis.process.getBuiltinModule &&
            globalThis.process.getBuiltinModule( 'fs' );

        if ( !fs ) {
            throw new Error( 'No file loader configured for this host' );
        }

        return fs.readFileSync( path );
    }
};
