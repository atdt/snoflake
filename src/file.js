import { str } from './string.js';

const textDecoder = new TextDecoder( 'utf-8' );

// A line reader has the few operations the VM needs. Buffered files can
// rewind. Stdin cannot. Readers that can be closed early expose drain().
//
//     readLine() -> Uint8Array | null   // null at EOF
//     rewind?()
//     drain?()
//
export function bufferedReader( bytes ) {
    let pos = 0;
    return {
        readLine() {
            if ( pos >= bytes.length ) return null;
            let end = bytes.indexOf( 10, pos );
            let next;
            if ( end === -1 ) { end = bytes.length; next = end; }
            else { next = end + 1; }
            // Trim a trailing CR on CRLF line endings.
            if ( end > pos && bytes[ end - 1 ] === 13 ) end--;
            const line = bytes.slice( pos, end );
            pos = next;
            return line;
        },
        rewind() { pos = 0; },
        drain() { pos = bytes.length; },
    };
}

// The default stdin reader is synchronous because STREAD runs inside the VM
// dispatch loop. Hosts that need async input should inject their own reader.
export function stdinReader() {
    let drained = false;
    return {
        readLine() {
            if ( drained ) return null;

            const line = readLineFromStdinSync();
            if ( line === null ) {
                drained = true;
                return null;
            }
            return line;
        },
        drain() { drained = true; },
    };
}

// Read one byte at a time so we stop exactly at the next line break. Reading
// more would steal bytes that belong to later STREAD calls.
function readLineFromStdinSync() {
    const fs = globalThis.process &&
        globalThis.process.getBuiltinModule &&
        globalThis.process.getBuiltinModule( 'fs' );

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

        if ( n === 0 ) return chunks.length ? Uint8Array.from( chunks ) : null;
        if ( buf[ 0 ] === 10 ) return Uint8Array.from( chunks );
        if ( buf[ 0 ] !== 13 ) chunks.push( buf[ 0 ] );
    }
}

// A File is one logical input unit. It may be backed by several segments.
// Source comes first, then runtime input, then interactive stdin. Source uses
// fixed-width card records. Runtime input and stdin keep their real length.
export class File {
    constructor( segments ) {
        this.segments = segments;
        this.idx = 0;
    }

    readRecord( length ) {
        while ( this.idx < this.segments.length ) {
            const { reader, padReads } = this.segments[ this.idx ];
            const line = reader.readLine();
            if ( line !== null ) {
                const text = textDecoder.decode( line );
                // Long records are cut to the caller's buffer. Card-mode
                // records are padded to it.
                if ( text.length > length ) {
                    return { eof: false, text: text.slice( 0, length ), padded: false };
                }
                if ( padReads ) {
                    return { eof: false, text: str.pad( text, length, 'left' ), padded: true };
                }
                return { eof: false, text, padded: false };
            }
            this.idx++;
        }
        return { eof: true, text: '', padded: false };
    }

    rewind() {
        this.idx = 0;
        for ( const { reader } of this.segments ) {
            reader.rewind?.();
        }
    }

    close() {
        for ( const { reader } of this.segments ) {
            reader.drain?.();
        }
        this.idx = this.segments.length;
    }
}
