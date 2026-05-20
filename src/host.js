// Host filesystem adapter for Node and Node-like runtimes.

import fs from 'node:fs';
import path from 'node:path';

export function createHostLoader( options = {} ) {
    const snolibDirs = options.snolib ?? [];

    return {
        load( filePath ) {
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
