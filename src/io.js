// Host-neutral defaults. Browser, Node, and test hosts can pass their own
// stdout writer or loader through VM options.
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
//     loader.loadInclude(parentPath, path) -> { path, content } | null
//
// Loading is synchronous because STREAD runs inside the VM dispatch loop.

export const defaultStdout = {
    write( line ) { console.log( line ); }
};

export const defaultLoader = {
    load( _path ) {
        throw new Error( 'No file loader configured for this host' );
    },

    loadInclude( _parentPath, _filename ) {
        return null;
    }
};
