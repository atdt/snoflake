import { Descriptor, Specifier } from './datatypes.js';
import { File, bufferedReader, stdinReader } from './file.js';
import { nodeStdout, nodeLoader } from './io.js';
import { sil } from './sil.js';
import { str } from './string.js';
import { bindSyntaxTables, constants } from './syntax.js';

const { UNITI } = constants;

const WORD_SIZE = Uint32Array.BYTES_PER_ELEMENT;
const INITIAL_WORDS = 1024 * 1024;
const MAX_WORDS = 256 * 1024 * 1024;

// Scratch one-word buffer viewed as uint, int, and float for range checks.
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

// Check whether a value survives a Float32 round trip.
export function isFloat32( value ) {
    probeF32[ 0 ] = value;
    return nearlyEqual( probeF32[ 0 ], value );
}

const DEFAULT_OPTIONS = {
    caseFold: true,
    // Suppress the SNOBOL4 startup banner, success/termination messages, and statistics summary.
    banner: false,
    statistics: false,
};

const HOST_SWITCHES = {
    LISTCL: 'listing',
    BANRCL: 'banner',
    STATCL: 'statistics',
};

function wordsToBytes( words ) {
    return words * WORD_SIZE;
}

export class VM {
    constructor( options ) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.stdout = this.options.stdout || nodeStdout;
        this.loader = this.options.loader || nodeLoader;
        this.reset();
    }

    reset() {
        this.exitCode = 0;
        this.instructionPointer = null;
        this.symbols = {};
        this.resetMemory();
        this.callbacks = [];
        this.units = {};
        this.INTSPC_BUFFER = null;
        // Keep current (CSTACK) and old (OSTACK) stack pointers as VM registers.
        this.CSTACK = 0;
        this.OSTACK = 0;
    }

    run( image ) {
        this.reset();
        this.loadImage( image );

        this.instructionPointer = 0;
        this.applyHostSwitches();
        this.interpret( this.compileInstructions( image.instructions ) );

        return this.instructionPointer >= 0;
    }

    // Load the image's symbols and assembled memory snapshot.
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
        // Minimal test images may omit syntax-table symbols.
        bindSyntaxTables( ( name ) => this.symbols[ name ] ?? 0 );
    }

    applyHostSwitches() {
        // LISTCL, BANRCL, and STATCL are descriptors in the loaded image.
        // After loading, overwrite them from the VM options for this run.
        for ( const symbol in HOST_SWITCHES ) {
            if ( Object.hasOwn( this.symbols, symbol ) ) {
                const option = HOST_SWITCHES[ symbol ],
                      enabled = this.options[ option ] ? 1 : 0;
                this.d( symbol ).addr = enabled;
            }
        }
    }

    // Compile each [label, macro, args] image entry into a bound call.
    compileInstructions( instructions ) {
        return instructions.map( stmt => {
            const [ , macro, args ] = stmt,
                  impl = sil[ macro ];

            return impl.bind( this, ...args );
        } );
    }

    interpret( instructions ) {
        while ( this.instructionPointer >= 0 && this.instructionPointer < instructions.length ) {
            instructions[ this.instructionPointer++ ]();
        }
    }

    jmp( loc ) {
        // Undefined or null branch operands are fall-through.
        if ( typeof loc === 'number' ) {
            this.instructionPointer = loc;
        }
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

    // Grow memory capacity without changing memPtr.
    grow( minWords ) {
        let words = this.mem.length * 2;
        while ( words < minWords ) {
            words *= 2;
        }
        this.buffer.resize( wordsToBytes( words ) );
    }

    // Allocate zero-filled words from memPtr.
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
        const text = s.toString(),
              SPEC = this.s( $SPEC ),
              encoded = str.encode( text );
        const ptr = this.alloc( encoded.length );
        SPEC.update( ptr, 0, 0, 0, text.length );
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
    // access. A unit reads source first, then optional runtime input, then
    // optional interactive stdin.
    openUnit( unitNum ) {
        if ( this.units[ unitNum ] ) return this.units[ unitNum ];

        const segments = [];
        if ( this.options.file ) {
            segments.push( {
                reader: bufferedReader( this.loader.load( this.options.file ) ),
                padReads: true,
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
        return this.units[ unitNum ] = new File( segments );
    }
}
