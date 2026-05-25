const LF = 10,
      CR = 13;

const textDecoder = new TextDecoder( 'utf-8' );
const textEncoder = new TextEncoder();

// FORTRAN/SIL filename arguments are space-padded to their field width.
export const stripTrailingBlanks = s => s.replace( / +$/, '' );

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
            text: text.padEnd( length ),
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
    // File takes ownership of `segments`: include() mutates it via splice.
    constructor( segments ) {
        this.segments = segments;
        this.idx = 0;
        // Paths of source files pulled in via -INCLUDE. The set spans all
        // segments, so a re-INCLUDE of the same file is a no-op.
        this.includedFiles = new Set();
    }

    include( content, path ) {
        // Insert at this.idx so the included source is read next, ahead of
        // the remaining lines of the current segment.
        this.segments.splice( this.idx, 0, {
            reader: bufferedReader( content ),
            padReads: true,
            path,
        } );
    }

    includeSource( filename, loader ) {
        const includePath = stripTrailingBlanks( filename ),
              included = loader.loadInclude?.( includePath ) ?? null;

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
