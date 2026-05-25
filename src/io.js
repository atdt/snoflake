// Host-neutral I/O. Browser, Node, and test hosts pass their own stdout
// writer or loader through VM options. UnitTable wires those into the SIL
// unit-number namespace used by INPUT/OUTPUT/STREAD.
//
// Writer:
//
//     writer.write(line)
//     writer.close()
//
// Each call receives one logical line without a trailing newline. The writer
// appends the terminator. close() is idempotent and may be a no-op.
//
// Loader:
//
//     loader.load(path) -> Uint8Array | Buffer
//     loader.loadInclude(path) -> { path, content } | null
//     loader.openOutput?(path) -> Writer
//
// Loading is synchronous because STREAD runs inside the VM dispatch loop.

import { File, bufferedReader, stripTrailingBlanks } from './file.js';
import { constants } from './syntax.js';

const { UNITI } = constants;

// Normalize an INPUT/OUTPUT filename argument. An all-blank path means the
// caller defaulted the argument: return null so the redirect is a no-op and
// the unit's existing binding stays put.
function redirectPath( filePath ) {
    const path = stripTrailingBlanks( filePath );
    return path === '' ? null : path;
}

export const defaultStdout = {
    write( line ) { console.log( line ); },
    close() {}
};

export const defaultLoader = {
    load( path ) {
        throw new Error( 'No file loader configured for this host: ' + path );
    },

    loadInclude( _includePath ) {
        return null;
    }
};

// Per-unit { input?: File, output?: Writer }. Entries persist across close
// so a closed input still returns EOF on subsequent reads.
export class UnitTable {
    constructor( { options, loader, stdout, preamble } ) {
        this.options = options;
        this.loader = loader;
        this.stdout = stdout;
        this.preamble = preamble;
        this.units = new Map();
    }

    // Open a unit's input File on first access. The standard input unit
    // (UNITI) composes, in order: preamble, main source, runtime input,
    // interactive stdin. Other units start empty and pick up content only
    // when redirectInput rebinds them.
    open( unitNum ) {
        const entry = this.#ensure( unitNum );
        if ( entry.input ) return entry.input;

        const segments = [];
        const pushSegment = ( reader, padReads, path ) => {
            const seg = { reader, padReads };
            if ( path ) seg.path = path;
            segments.push( seg );
        };

        if ( unitNum === UNITI ) {
            const { source, file, input, interactive, stdinReader } = this.options;
            if ( this.preamble ) {
                pushSegment( bufferedReader( this.preamble ), true );
            }
            if ( source !== undefined ) {
                pushSegment( bufferedReader( source ), true, file );
            } else if ( file ) {
                pushSegment( bufferedReader( this.loader.load( file ) ), true, file );
            }
            if ( input ) {
                pushSegment( bufferedReader( this.loader.load( input ) ), false );
            }
            if ( interactive ) {
                if ( !stdinReader ) {
                    throw new Error( 'interactive mode requires options.stdinReader' );
                }
                pushSegment( stdinReader(), false );
            }
        }
        entry.input = new File( segments );
        return entry.input;
    }

    redirectInput( unitNum, filePath ) {
        const path = redirectPath( filePath );
        if ( path === null ) return;
        const entry = this.#ensure( unitNum );
        entry.input?.close();
        entry.input = new File( [ {
            reader: bufferedReader( this.loader.load( path ) ),
            padReads: false,
            path,
        } ] );
    }

    redirectOutput( unitNum, filePath ) {
        const path = redirectPath( filePath );
        if ( path === null ) return;
        const writer = this.loader.openOutput?.( path );
        if ( !writer ) {
            throw new Error( 'No file writer configured for this host' );
        }
        const entry = this.#ensure( unitNum );
        entry.output?.close();
        entry.output = writer;
    }

    write( unitNum, line ) {
        const writer = this.units.get( unitNum )?.output || this.stdout;
        writer.write( line );
    }

    close( unitNum ) {
        const entry = this.units.get( unitNum );
        if ( !entry ) return;
        entry.input?.close();
        entry.output?.close();
        // Keep entry.input. A closed File yields EOF. Drop the writer.
        entry.output = null;
    }

    #ensure( unitNum ) {
        let entry = this.units.get( unitNum );
        if ( !entry ) {
            entry = {};
            this.units.set( unitNum, entry );
        }
        return entry;
    }
}
