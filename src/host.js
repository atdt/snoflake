// Host filesystem adapter for Node and Node-like runtimes.

import fs from 'node:fs';
import path from 'node:path';

const LF = 10,
    CR = 13;

// Synchronous because STREAD runs inside the VM dispatch loop. Hosts that
// need async input should supply their own reader through VM options.
export function stdinReader() {
    let closed = false;

    return {
        readLine() {
            if ( closed ) return null;

            const line = readLineFromStdinSync();
            if ( line === null ) {
                closed = true;
                return null;
            }
            return line;
        },

        close() {
            closed = true;
        },
    };
}

// Read one byte at a time so we stop exactly at the next line break. Reading
// more would steal bytes that belong to later STREAD calls.
function readLineFromStdinSync() {
    const buf = new Uint8Array( 1 ),
        chunks = [];

    while ( true ) {
        let n;
        try {
            n = fs.readSync( 0, buf, 0, 1, null );
        } catch ( e ) {
            if ( e.code === 'EAGAIN' ) continue;
            throw e;
        }

        if ( n === 0 ) {
            if ( chunks.length === 0 ) return null;
            return Uint8Array.from( chunks );
        }
        if ( buf[0] === LF ) return Uint8Array.from( chunks );
        if ( buf[0] !== CR ) {
            chunks.push( buf[0] );
        }
    }
}

// Read a file, returning null when the path does not exist (or is not a
// directory along the way). Other I/O errors propagate so callers see real
// permission/IO problems instead of a silent miss.
function tryReadFile( p ) {
    try {
        return fs.readFileSync( p );
    } catch ( e ) {
        if ( e.code === 'ENOENT' || e.code === 'ENOTDIR' ) return null;
        throw e;
    }
}

export function createHostLoader( options = {} ) {
    const snolibDirs = options.snolib ?? [];

    return {
        load( filePath ) {
            // Resolve a relative path against the SNOLIB dirs before falling
            // back to the host cwd, matching -INCLUDE lookup. A fixture can
            // then reference a shared data file (e.g. PHRASES.IN) regardless
            // of the test runner's cwd. Absolute paths are honored verbatim.
            if ( !path.isAbsolute( filePath ) ) {
                for ( const dir of snolibDirs ) {
                    const buf = tryReadFile( path.join( dir, filePath ) );
                    if ( buf !== null ) return buf;
                }
            }
            return fs.readFileSync( filePath );
        },

        openOutput( filePath ) {
            let fd = fs.openSync( filePath, 'w' );
            return {
                write( line ) {
                    if ( fd === null ) {
                        throw new Error(
                            `Write to closed output: ${filePath}`,
                        );
                    }
                    fs.writeSync( fd, line + '\n' );
                },
                close() {
                    if ( fd !== null ) {
                        fs.closeSync( fd );
                        fd = null;
                    }
                },
            };
        },

        loadInclude( includePath ) {
            // Try the path as given (cwd or absolute), then each -I/SNOLIB
            // directory in turn.
            for ( const dir of [ '', ...snolibDirs ] ) {
                const filePath = dir
                    ? path.join( dir, includePath )
                    : includePath;
                const buf = tryReadFile( filePath );
                if ( buf !== null ) return { path: filePath, content: buf };
            }
            return null;
        },
    };
}
