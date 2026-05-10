"use strict";

import { Descriptor, Specifier } from './datatypes.js';
import { File, bufferedReader } from './file.js';
import { nodeStdout, nodeStderr, nodeLoader } from './io.js';
import { sil } from './sil.js';
import { str } from './string.js';
import { constants, tableNames } from './syntax.js';

const WORD_SIZE = Uint32Array.BYTES_PER_ELEMENT;
const INITIAL_WORDS = 1024 * 1024;
const MAX_WORDS = 256 * 1024 * 1024;

// Scratch one-word buffer aliased as three typed views, used both by the
// typed setters (to reject values that don't survive the truncation) and by
// the isInt32/isFloat32 predicates exposed for callers that want to check
// before storing.
const probeBuf = new ArrayBuffer( 4 ),
      probeF32 = new Float32Array( probeBuf ),
      probeI32 = new Int32Array( probeBuf ),
      probeU32 = new Uint32Array( probeBuf );

function nearlyEqual( a, b ) {
    return a === b || Math.abs( a - b ) < 0.001;
}

export function isInt32( value ) {
    probeI32[ 0 ] = value;
    return probeI32[ 0 ] === value;
}

// Tests whether v survives the round-trip through 32-bit IEEE 754, using the
// same tolerance as the typed setter so callers and setters agree on what
// counts as overflow.
export function isFloat32( value ) {
    probeF32[ 0 ] = value;
    return nearlyEqual( probeF32[ 0 ], value );
}

const DEFAULT_OPTIONS = {
    // Fold SNOBOL source names and labels to uppercase during compilation.
    caseFold: true,
    // Snoflake suppresses the SNOBOL4 startup banner, success/termination
    // messages, and statistics summary by default. Toggle via -b / -s.
    banner: false,
    statistics: false,
};

// Host options override a few assembled SIL switches after data
// initialization. This keeps the historical SIL constants intact while
// giving the JS host control over banner, listing, and statistics output.
const HOST_OUTPUT_OPTIONS = [
    [ 'LISTCL', 'listing' ],
    [ 'BANRCL', 'banner' ],
    [ 'STATCL', 'statistics' ],
];

// STREAM uses these strings as dispatch tags for syntax-table actions
// (see syntax.js's syntaxTables). The SIL listing also references them as
// operand names (e.g. CLERTB SNABTB,ERROR), so they need to resolve to
// themselves through vm.$().
const STREAM_ACTIONS = [ 'CONTIN', 'ERROR', 'STOP', 'STOPSH' ];

function wordsToBytes( words ) {
    return words * WORD_SIZE;
}

export class VM {
    constructor( options ) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        // I/O adapters: defaults target Node (console + node:fs); a host
        // can inject its own writers and loader to redirect program output
        // or supply pre-loaded sources. See ./io.js.
        this.stdout = this.options.stdout || nodeStdout;
        this.stderr = this.options.stderr || nodeStderr;
        this.loader = this.options.loader || nodeLoader;
        this.exitCode = 0;
        this.reset();
    }

    reset() {
        this.instructionPointer = null;
        this.symbols = {};
        this.resetMemory();
        this.callbacks = [];
        this.units = {};
        this.INTSPC_BUFFER = null;
        // Keep stack pointers as VM registers, not memory-backed descriptors,
        // to avoid accidental overwrites by program macros.
        this.CSTACK = { addr: 0 };
        this.OSTACK = { addr: 0 };
        seedConstants( this );
    }

    // SIL storage is word-addressed. These length-tracking views share one
    // resizable buffer so a field can be read as unsigned, signed, or float.
    refreshMemoryViews() {
        this.mem = new Uint32Array( this.buffer );
        this.i32 = new Int32Array( this.buffer );
        this.f32 = new Float32Array( this.buffer );
    }

    resetMemory() {
        this.memPtr = 0;
        this.buffer = new ArrayBuffer( wordsToBytes( INITIAL_WORDS ), {
            maxByteLength: wordsToBytes( MAX_WORDS )
        } );
        this.refreshMemoryViews();
    }

    // Grow capacity only. this.memPtr remains the logical end of assembled memory.
    grow( minWords ) {
        let words = this.mem.length * 2;
        while ( words < minWords ) {
            words *= 2;
        }
        this.buffer.resize( wordsToBytes( words ) );
    }

    // Allocate zero-filled words from the logical frontier, not from typed-array
    // length. mem.length is capacity and may be much larger than initialized data.
    alloc( size, value = 0 ) {
        if ( this.memPtr + size > this.mem.length ) {
            this.grow( this.memPtr + size );
        }
        const ptr = this.memPtr;
        if ( value !== 0 ) {
            this.mem.fill( value, ptr, ptr + size );
        }
        this.memPtr += size;
        return ptr;
    }

    getUint( ptr )        { return this.mem[ ptr ]; }
    getInt( ptr )         { return this.i32[ ptr ]; }
    getReal( ptr )        { return this.f32[ ptr ]; }

    setUint( ptr, value ) {
        probeU32[ 0 ] = value;
        if ( probeU32[ 0 ] !== value ) {
            throw new RangeError( 'Invalid Uint32: ' + JSON.stringify( value ) );
        }
        this.mem[ ptr ] = probeU32[ 0 ];
    }

    setInt( ptr, value ) {
        probeI32[ 0 ] = value;
        if ( probeI32[ 0 ] !== value ) {
            throw new RangeError( 'Invalid Int32: ' + JSON.stringify( value ) );
        }
        this.i32[ ptr ] = probeI32[ 0 ];
    }

    setReal( ptr, value ) {
        probeF32[ 0 ] = value;
        if ( !nearlyEqual( probeF32[ 0 ], value ) ) {
            throw new RangeError( 'Invalid Float32: ' + JSON.stringify( value ) );
        }
        this.f32[ ptr ] = probeF32[ 0 ];
    }

    define( symbol, value ) {
        if ( typeof value === 'string' ) {
            const ptr = this.alloc( value.length ),
                  encoded = str.encode( value );
            this.symbols[ symbol ] = ptr;
            this.mem.set( encoded.subarray( 0, value.length ), ptr );
        } else {
            this.symbols[ symbol ] = value;
        }
    }

    resolve( key ) {
        if ( Object.hasOwn( this.symbols, key ) ) {
            return this.symbols[ key ];
        }
        throw new ReferenceError( key );
    }

    // Terse alias: SIL macros lean on $(NAME) for symbol lookup so heavily
    // that the verbose form would dominate sil.js. Same behavior as resolve.
    $( key ) { return this.resolve( key ); }

    specify( s, $SPEC ) {
        const SPEC = this.s( $SPEC ), encoded = str.encode( s );
        const ptr = this.alloc( encoded.length );
        SPEC.update( ptr, 0, 0, 0, s.toString().length );
        this.mem.set( encoded, ptr );
        return SPEC.ptr;
    }

    d( ptr ) {
        return ptr instanceof Descriptor ? ptr : new Descriptor( this, ptr );
    }

    s( ptr ) {
        return ptr instanceof Specifier ? ptr : new Specifier( this, ptr );
    }

    // Resolve a SIL unit number to its backing File, building it on first
    // access. Snoflake gives each unit a stream of one or more byte
    // segments: the SIL source program (`--file`, card-padded) followed by
    // optional runtime input (`--input`, length-preserving) on UNITI.
    // An interactive stdin segment will plug in here when added.
    openUnit( unitNum ) {
        if ( this.units[ unitNum ] ) return this.units[ unitNum ];

        const segments = [];
        if ( this.options.file ) {
            segments.push( {
                reader: bufferedReader( loadBytes( this, this.options.file ) ),
                padReads: true,
            } );
        }
        if ( this.options.input && unitNum === this.symbols.UNITI ) {
            segments.push( {
                reader: bufferedReader( loadBytes( this, this.options.input ) ),
                padReads: false,
            } );
        }
        return this.units[ unitNum ] = new File( segments );
    }

    jmp( loc ) {
        // Omitted optional branch operands arrive as undefined (or null from the
        // PEG grammar's empty-list-slot rule); SIL specifies fall-through.
        if ( typeof loc === 'number' ) {
            this.instructionPointer = loc;
            this.instructionPointerChanged = true;
        }
    }

    // Hydrate the VM's symbols and memory from an image. The image's `memory`
    // is the byte-for-byte assembled snapshot -- host string constants and SIL
    // data declarations both live in it -- so loading is a copy.
    loadImage( image ) {
        if ( !image || !ArrayBuffer.isView( image.memory ) ) {
            throw new Error( 'Malformed SNOBOL image' );
        }

        this.symbols = { ...image.symbols };
        if ( image.memory.length > this.mem.length ) {
            this.grow( image.memory.length );
        }
        this.mem.set( image.memory, 0 );
        this.memPtr = image.memory.length;
    }

    run( image ) {
        this.reset();
        this.loadImage( image );

        this.instructionPointer = 0;
        this.instructionPointerChanged = false;
        applyHostOutputOptions( this );
        interpret( this, compileInstructions( this, image.instructions ) );

        return !( this.instructionPointer < 0 );
    }

    // Emit one logical record to a print unit. SIL OUTPUT and STPRNT both call
    // this; today every unit goes to stdout. Per the SIL spec, OUTPUT (UNITO)
    // and PUNCH (UNITP) are distinct destinations and user programs may bind
    // other unit numbers to files; when that lands, dispatch on `unit` here.
    printLinePrinterRecord( record, unit, carriageControl ) {
        const stdout = this.stdout;
        record.split( '\n' ).forEach( function ( line ) {
            if ( line.length === 0 ) {
                stdout.write( '' );
                return;
            }

            if ( carriageControl === false ) {
                stdout.write( line.replace( / +/g, '' ) );
                return;
            }

            const control = line.charAt( 0 );
            const content = line.slice( 1 ).replace( / +/g, '' );

            // SNOBOL4 inherited FORTRAN-style carriage control from line printers:
            // the first character of each record is not text, but spacing
            // metadata.  A literal terminal rendering of "double space" and
            // "new page" is too airy because the SIL formats also contain explicit
            // slash records, so we strip the control and preserve only real record
            // breaks produced by the format.
            switch ( control ) {
                case '1':
                case '0':
                case '+':
                case ' ':
                    stdout.write( content );
                    break;
                default:
                    stdout.write( line.replace( / +/g, '' ) );
            }
        } );
    }
}

// Bind the host environment's *constants* into the symbol table: PARMS-style
// numeric values from `constants`, syntax-table indices, and the STREAM
// dispatch tags. No memory is touched -- ALPHA and the other host strings
// are allocated separately by ./assemble.js. This runs on every reset so
// a fresh VM can drive macros that look up TTL/STACK/UNITI/&c. directly,
// without needing to first walk the assembler.
function seedConstants( vm ) {
    for ( const name in constants ) {
        vm.symbols[ name ] = constants[ name ];
    }
    tableNames.forEach( ( name, idx ) => {
        vm.symbols[ name ] = idx;
    } );
    for ( const action of STREAM_ACTIONS ) {
        vm.symbols[ action ] = action;
    }
}

function applyHostOutputOptions( vm ) {
    for ( const [ symbol, option ] of HOST_OUTPUT_OPTIONS ) {
        if ( Object.hasOwn( vm.symbols, symbol ) ) {
            vm.d( symbol ).addr = vm.options[ option ] ? 1 : 0;
        }
    }
}

// Compile each [label, macro, args] image entry into a thunk that
// dispatches to the resolved sil implementation. Resolving the macro
// once per program rather than once per dispatch is worth 10-20% on
// CPU-heavy fixtures (kalah, n-queens, recognizer).
function compileInstructions( vm, instructions ) {
    return instructions.map( stmt => {
        const impl = sil[ stmt[ 1 ] ],
              args = stmt[ 2 ];
        return function () {
            impl.apply( vm, args );
        };
    } );
}

// Coerce loader output to a Uint8Array view. The Node loader returns a
// Buffer (already a Uint8Array); browser/test loaders may return a plain
// Uint8Array or a string.
function loadBytes( vm, path ) {
    const content = vm.loader.load( path );
    if ( typeof content === 'string' ) return new TextEncoder().encode( content );
    if ( content instanceof Uint8Array ) return content;
    throw new TypeError( 'Loader must return a string or Uint8Array' );
}

// Branching macros update instructionPointer themselves. Everything else
// falls through to the next compact instruction.
function interpret( vm, instructions ) {
    while ( vm.instructionPointer >= 0 && vm.instructionPointer < instructions.length ) {
        const loc = vm.instructionPointer;
        vm.instructionPointerChanged = false;
        instructions[ loc ]();
        if ( !vm.instructionPointerChanged && vm.instructionPointer === loc ) {
            vm.instructionPointer++;
        }
    }
}
