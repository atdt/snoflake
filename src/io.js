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

import { File, bufferedReader, stdinReader } from './file.js';
import { constants } from './syntax.js';

const { UNITI } = constants;

export const defaultStdout = {
    write( line ) { console.log( line ); },
    close() {}
};

export const defaultLoader = {
    load( path ) {
        throw new Error( 'No file loader configured for this host: ' + path );
    },

    loadInclude( includePath ) {
        void includePath;
        return null;
    }
};

// Per-unit { input?: File, output?: Writer }. Entries persist across close
// so a closed input still returns EOF on subsequent reads.
export class UnitTable {
    constructor( { options, loader, stdout } ) {
        this.options = options;
        this.loader = loader;
        this.stdout = stdout;
        this.units = new Map();
    }

    // Open a SIL unit's input File, building it on first access. A unit reads
    // the main source (an inline `source` string takes precedence over
    // loader-backed `file`), then optional runtime input, then optional
    // interactive stdin.
    open( unitNum ) {
        const entry = this.#ensure( unitNum );
        if ( entry.input ) return entry.input;

        const segments = [];
        if ( this.options.source !== undefined ) {
            segments.push( {
                reader: bufferedReader( this.options.source ),
                padReads: true,
                path: this.options.file,
            } );
        } else if ( this.options.file ) {
            segments.push( {
                reader: bufferedReader( this.loader.load( this.options.file ) ),
                padReads: true,
                path: this.options.file,
            } );
        }
        if ( this.options.input && unitNum === UNITI ) {
            segments.push( {
                reader: bufferedReader( this.loader.load( this.options.input ) ),
                padReads: false,
            } );
        }
        if ( this.options.interactive && unitNum === UNITI ) {
            const readStdin = this.options.stdinReader || stdinReader;
            segments.push( {
                reader: readStdin(),
                padReads: false,
            } );
        }
        entry.input = new File( segments );
        return entry.input;
    }

    // An empty path means the optional INPUT/OUTPUT filename argument was
    // defaulted. Leave the unit's existing binding untouched.
    redirectInput( unitNum, filePath ) {
        const path = filePath.replace( / +$/, '' );
        if ( path === '' ) return;
        const entry = this.#ensure( unitNum );
        entry.input?.close();
        entry.input = new File( [ {
            reader: bufferedReader( this.loader.load( path ) ),
            padReads: false,
            path,
        } ] );
    }

    redirectOutput( unitNum, filePath ) {
        const path = filePath.replace( / +$/, '' );
        if ( path === '' ) return;
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
