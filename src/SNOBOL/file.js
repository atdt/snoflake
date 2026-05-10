"use strict";

import { str } from './string.js';

const textDecoder = new TextDecoder( 'utf-8' );

// LineReader interface (duck-typed):
//
//     readLine() -> Uint8Array | null   // null at EOF
//     rewind?()                         // optional; absent on streaming sources
//     drain?()                          // optional; signals "no more lines"
//
// `bufferedReader` is the only implementation today; an interactive stdin
// reader will follow the same shape when interactive mode lands.
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

// A File is one logical input unit. It composes one or more segments, read
// in order. Each segment carries its own padding policy: card-formatted
// segments (the SIL source file) right-pad each record to the requested
// length; stream segments (a host-supplied --input file, eventually stdin)
// preserve the actual record length so callers can detect short lines.
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
                let text = textDecoder.decode( line );
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

    read( length ) {
        return this.readRecord( length ).text;
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
