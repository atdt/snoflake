// Host filesystem adapter for Node and Node-like runtimes.

import fs from 'node:fs';
import path from 'node:path';

export function createHostLoader( options = {} ) {
    const snolibDirs = options.snolib ?? [];

    return {
        load( filePath ) {
            // Resolve a relative path against the SNOLIB search dirs before
            // falling back to the host cwd. This gives runtime INPUT(...,
            // 'NAME') the same lookup semantics as -INCLUDE so a fixture can
            // reference shared data files (e.g. PHRASES.IN) without knowing
            // where the test runner placed the cwd. Absolute paths are
            // honored verbatim.
            if ( !path.isAbsolute( filePath ) ) {
                for ( const dir of snolibDirs ) {
                    const candidate = path.join( dir, filePath );
                    try {
                        return fs.readFileSync( candidate );
                    } catch ( e ) {
                        if ( e.code !== 'ENOENT' && e.code !== 'ENOTDIR' ) {
                            throw e;
                        }
                    }
                }
            }
            return fs.readFileSync( filePath );
        },

        openOutput( filePath ) {
            let fd = fs.openSync( filePath, 'w' );
            return {
                write( line ) { fs.writeSync( fd, line + '\n' ); },
                close() {
                    if ( fd !== null ) {
                        fs.closeSync( fd );
                        fd = null;
                    }
                },
            };
        },

        loadInclude( includePath ) {
            // Try the path as given, then each -I/SNOLIB directory in turn.
            for ( const dir of [ '', ...snolibDirs ] ) {
                const filePath = dir ? path.join( dir, includePath ) : includePath;
                try {
                    return { path: filePath, content: this.load( filePath ) };
                } catch ( e ) {
                    if ( e.code !== 'ENOENT' && e.code !== 'ENOTDIR' ) throw e;
                }
            }
            return null;
        }
    };
}
