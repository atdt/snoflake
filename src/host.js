// Host filesystem adapter. This module must stay importable in browsers:
// probe globals lazily and avoid static imports from node:* or Deno packages.

function nodeFs() {
    return globalThis.process?.getBuiltinModule?.( 'fs' ) ?? null;
}

function deno() {
    return globalThis.Deno?.readFileSync ? globalThis.Deno : null;
}

function hostReadFileSync( filePath ) {
    const fs = nodeFs();
    if ( fs ) return fs.readFileSync( filePath );

    const d = deno();
    if ( d ) return d.readFileSync( filePath );

    throw new Error( 'No file loader configured for this host' );
}

function hostFileExists( filePath ) {
    const fs = nodeFs();
    if ( fs ) return fs.existsSync( filePath );

    const d = deno();
    if ( d ) {
        try {
            d.statSync( filePath );
            return true;
        } catch ( e ) {
            if ( e instanceof d.errors.NotFound ) return false;
            throw e;
        }
    }

    return false;
}

function isAbsolutePath( filePath ) {
    return filePath.startsWith( '/' ) || /^[A-Za-z]:[\\/]/.test( filePath );
}

function normalizePath( filePath ) {
    const win = filePath.includes( '\\' ),
          sep = win ? '\\' : '/',
          parts = filePath.split( /[\\/]+/ ),
          out = [];
    let prefix = '';

    if ( filePath.startsWith( '/' ) ) {
        prefix = '/';
    } else if ( /^[A-Za-z]:/.test( parts[ 0 ] ) ) {
        prefix = parts.shift() + sep;
    }

    for ( const part of parts ) {
        if ( part === '' || part === '.' ) continue;
        if ( part === '..' ) {
            if ( out.length && out[ out.length - 1 ] !== '..' ) out.pop();
            else if ( !prefix ) out.push( part );
        } else {
            out.push( part );
        }
    }

    return prefix + out.join( sep ) || '.';
}

function dirname( filePath ) {
    const normalized = normalizePath( filePath ),
          idx = Math.max( normalized.lastIndexOf( '/' ), normalized.lastIndexOf( '\\' ) );

    if ( idx <= 0 ) return normalized.startsWith( '/' ) ? '/' : '.';
    return normalized.slice( 0, idx );
}

function resolvePath( baseDir, filePath ) {
    if ( isAbsolutePath( filePath ) || /^[a-z][a-z0-9+.-]*:/i.test( filePath ) ) {
        return normalizePath( filePath );
    }

    return normalizePath( baseDir + '/' + filePath );
}

function resolveIncludePath( parentPath, includePath ) {
    if ( !parentPath ) return null;

    try {
        if ( /^[a-z][a-z0-9+.-]*:/i.test( parentPath ) ) {
            return new URL( includePath, parentPath ).href;
        }
    } catch ( e ) {
        return null;
    }

    return resolvePath( dirname( parentPath ), includePath );
}

export function createHostLoader() {
    return {
        load( filePath ) {
            return hostReadFileSync( filePath );
        },

        loadInclude( parentPath, includePath ) {
            const filePath = resolveIncludePath( parentPath, includePath );
            if ( filePath === null || !hostFileExists( filePath ) ) return null;

            try {
                return {
                    path: filePath,
                    content: this.load( filePath ),
                };
            } catch ( e ) {
                return null;
            }
        }
    };
}
