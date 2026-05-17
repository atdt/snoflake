import { str } from './string.js';

const LF = 10,
      CR = 13;

const textDecoder = new TextDecoder( 'utf-8' );
const textEncoder = new TextEncoder();

// A line reader has the few operations the VM needs. Buffered files can
// rewind. Stdin cannot. close() releases any held state and forces
// subsequent readLine calls to return EOF.
//
//     readLine() -> Uint8Array | null   // null at EOF
//     rewind?()
//     close?()
//
// Loaders may return a string or a Uint8Array. bufferedReader accepts both
// so callers don't have to coerce.
export function bufferedReader( content ) {
    const bytes = typeof content === 'string'
        ? textEncoder.encode( content )
        : content;
    let pos = 0;

    return {
        readLine() {
            if ( pos >= bytes.length ) return null;

            const newline = bytes.indexOf( LF, pos );
            let end, next;
            if ( newline === -1 ) {
                end = bytes.length;
                next = bytes.length;
            } else {
                end = newline;
                next = newline + 1;
            }

            // Trim a trailing CR on CRLF line endings.
            if ( end > pos && bytes[ end - 1 ] === CR ) {
                end--;
            }

            const line = bytes.slice( pos, end );
            pos = next;
            return line;
        },

        rewind() { pos = 0; },
        close() { pos = bytes.length; },
    };
}

// The default stdin reader is synchronous because STREAD runs inside the VM
// dispatch loop. Hosts that need async input should inject their own reader.
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

        close() { closed = true; },
    };
}

// Read one byte at a time so we stop exactly at the next line break. Reading
// more would steal bytes that belong to later STREAD calls.
function readLineFromStdinSync() {
    const fs = globalThis.process?.getBuiltinModule?.( 'fs' );
    if ( !fs ) {
        throw new Error( 'No stdin reader configured for this host' );
    }

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
        if ( buf[ 0 ] === LF ) return Uint8Array.from( chunks );
        if ( buf[ 0 ] !== CR ) {
            chunks.push( buf[ 0 ] );
        }
    }
}

// Long records are cut to the caller's buffer. Card-mode records are
// padded to it. Stream-mode records keep their natural length.
function fitRecord( text, length, padReads ) {
    if ( text.length > length ) {
        return {
            text: text.slice( 0, length ),
            padded: false,
        };
    }
    if ( padReads ) {
        return {
            text: str.pad( text, length, 'left' ),
            padded: true,
        };
    }
    return { text, padded: false };
}

// A File is one logical input unit. It may be backed by several segments.
// Source comes first, then runtime input, then interactive stdin. Source uses
// fixed-width card records. Runtime input and stdin keep their real length.
//
// Segment shape: { reader, padReads: boolean, path?: string }.
export class File {
    constructor( segments ) {
        this.segments = segments;
        this.idx = 0;
        // Paths of source files pulled in via -INCLUDE. The set spans all
        // segments, so a re-INCLUDE of the same file is a no-op.
        this.includedFiles = new Set();
    }

    include( content, path ) {
        this.segments.splice( this.idx, 0, {
            reader: bufferedReader( content ),
            padReads: true,
            path,
        } );
    }

    includeSource( filename, loader ) {
        const parentPath = this.segments[ this.idx ]?.path,
              includePath = filename.replace( / +$/, '' ),
              included = loader.loadInclude?.( parentPath, includePath ) ?? null;

        if ( included === null ) {
            throw new Error( 'Cannot open INCLUDE file: ' + includePath );
        }

        // Idempotent -INCLUDE: silently skip files already pulled in.
        if ( this.includedFiles.has( included.path ) ) {
            return;
        }

        this.include( included.content, included.path );
        this.includedFiles.add( included.path );
    }

    readRecord( length ) {
        while ( this.idx < this.segments.length ) {
            const { reader, padReads } = this.segments[ this.idx ],
                  line = reader.readLine();

            if ( line === null ) {
                this.idx++;
                continue;
            }

            const text = textDecoder.decode( line );
            return { eof: false, ...fitRecord( text, length, padReads ) };
        }

        return { eof: true };
    }

    rewind() {
        this.idx = 0;
        for ( const { reader } of this.segments ) {
            reader.rewind?.();
        }
    }

    close() {
        for ( const { reader } of this.segments ) {
            reader.close?.();
        }
        // Subsequent readRecord returns EOF.
        this.idx = this.segments.length;
    }
}
