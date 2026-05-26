// The virtual machine: word-addressed memory, descriptor and specifier
// accessors, and the dispatch loop that executes the assembled SIL macros.

import { Descriptor, Specifier, isFloat32, isInt32, isUint32 } from './datatypes.js';
import { Diagnostics } from './diagnostics.js';
import { extensions as defaultExtensions, parseSignature } from './extensions.js';
import { UnitTable, defaultStdout, defaultLoader } from './io.js';
import { sil } from './sil.js';
import { writeString } from './string.js';
import { bindSyntaxTables, buildSyntaxTables } from './syntax.js';

const WORD_SIZE = Uint32Array.BYTES_PER_ELEMENT;
const INITIAL_WORDS = 512 * 1024;
const MAX_WORDS = 256 * 1024 * 1024;

function wordsToBytes( words ) {
    return words * WORD_SIZE;
}

const DEFAULT_OPTIONS = {
    case: true,
    list: false,
    banner: false,
    statistics: false,
};

// System-variable descriptors whose initial integer value is seeded from
// the matching host option after the image loads.
const HOST_SWITCHES = {
    LISTCL: 'list',
    BANRCL: 'banner',
    STATCL: 'statistics',
    CASECL: 'case',
};

// SNOBOL type names used in LOAD prototypes, keyed by extension kind.
// Void maps to STRING because SNOBOL has no void result type.
const TYPE_NAMES = { int: 'INTEGER', real: 'REAL', string: 'STRING', void: 'STRING' };

export class VM {
    constructor( options = {} ) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.loader = this.options.loader || defaultLoader;
        // Host extensions merge over the defaults. Pass `null` to start
        // empty (intended for tests that need a bare runtime). Function
        // values are signature-form keys ('NAME :: (types) => type').
        // Object values are the canonical { args, result, impl } shape.
        this.extensions = options.extensions === null ? {} : { ...defaultExtensions };
        for ( const [ key, value ] of Object.entries( options.extensions || {} ) ) {
            const [ name, entry ] = typeof value === 'function'
                ? parseSignature( key, value )
                : [ key, value ];
            this.extensions[ name ] = entry;
        }
        this.reset();
    }

    reset() {
        this.exitCode = 0;
        this.ip = null;
        this.symbols = {};
        this.resetMemory();
        this.callbacks = [];
        this.units = new UnitTable( {
            options: this.options,
            loader: this.loader,
            stdout: this.options.stdout || defaultStdout,
            preamble: this.#buildPreamble(),
        } );
        // INTSPC's local conversion buffer, lazily allocated on first use.
        this.intspcBuf = null;
        this.syntaxTables = buildSyntaxTables();
        // Keep frequently-accessed values as VM registers:
        this.CSTACK = 0;  // Current stack pointer
        this.OSTACK = 0;  // Old stack pointer
        this.TSTACK = 0;  // Stack top pointer
        this.ESAICL_ADDR = -1;  // Count of compiler errors
        this.CSTNCL_ADDR = -1;  // Compiler statement counter
        this.extensionsBySlot = [];
        this.diagnostics = new Diagnostics();
    }

    run( image ) {
        this.interpret( this.prepare( image ) );
        return this.ip >= 0;
    }

    // Load an image and ready the first instruction, returning the compiled
    // instruction list.
    prepare( image ) {
        this.reset();
        this.loadImage( image );
        this.ip = 0;
        this.applyHostSwitches();
        return this.compileInstructions( image.instructions );
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
        // Cache the counter addresses INCRA watches now, so its hot path
        // compares against numbers instead of doing symbol-table lookups.
        this.ESAICL_ADDR = this.symbols.ESAICL ?? -1;
        this.CSTNCL_ADDR = this.symbols.CSTNCL ?? -1;
        // Minimal test images may omit syntax-table symbols.
        bindSyntaxTables( this.syntaxTables, ( name ) => this.symbols[ name ] ?? 0 );
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
        return instructions.map( ( stmt, idx ) => {
            const [ /*label*/, macro, args ] = stmt,
                  impl = sil[ macro ];

            if ( !impl ) {
                throw new Error( `Unknown SIL macro "${ macro }" at instruction ${ idx }` );
            }
            return impl.bind( this, ...args );
        } );
    }

    interpret( instructions ) {
        while ( this.ip >= 0 && this.ip < instructions.length ) {
            instructions[ this.ip++ ]();
        }
    }

    jmp( loc ) {
        // Undefined or null branch operands are fall-through.
        if ( typeof loc === 'number' ) {
            this.ip = loc;
        }
    }

    // SIL storage is word-addressed. These length-tracking views share one
    // resizable buffer so a field can be read as unsigned, signed, or float.
    rebindMemoryViews() {
        this.mem = new Uint32Array( this.buffer );
        this.i32 = new Int32Array( this.buffer );
        this.f32 = new Float32Array( this.buffer );
    }

    resetMemory() {
        this.memPtr = 0;
        this.buffer = new ArrayBuffer( wordsToBytes( INITIAL_WORDS ), {
            maxByteLength: wordsToBytes( MAX_WORDS )
        } );
        this.rebindMemoryViews();
    }

    // Grow memory capacity without changing memPtr.
    grow( minWords ) {
        let words = this.mem.length * 2;
        while ( words < minWords ) {
            words *= 2;
        }
        if ( words > MAX_WORDS ) {
            throw new RangeError(
                `Cannot grow VM memory beyond MAX_WORDS (${MAX_WORDS}; requested ${minWords})`,
            );
        }
        this.buffer.resize( wordsToBytes( words ) );
    }

    // Allocate words from memPtr.
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
        if ( !isUint32( value ) ) {
            throw new RangeError( `Invalid Uint32: ${ value }` );
        }
        this.mem[ ptr ] = value;
    }

    setInt( ptr, value ) {
        if ( !isInt32( value ) ) {
            throw new RangeError( `Invalid Int32: ${ value }` );
        }
        this.i32[ ptr ] = value;
    }

    setReal( ptr, value ) {
        if ( !isFloat32( value ) ) {
            throw new RangeError( `Invalid Float32: ${ value }` );
        }
        this.f32[ ptr ] = value;
    }

    // Bind a symbol. A string value allocates storage, encodes the bytes,
    // and points the symbol at that storage. A number is stored verbatim.
    define( symbol, value ) {
        if ( typeof value === 'string' ) {
            const ptr = this.alloc( value.length );
            this.symbols[ symbol ] = ptr;
            writeString( value, this.mem, ptr );
        } else {
            this.symbols[ symbol ] = value;
        }
    }

    // Look up a symbol's bound value (a storage pointer or raw number),
    // throwing if undefined. Kept to one character because the macros
    // call it constantly.
    $( key ) {
        if ( Object.hasOwn( this.symbols, key ) ) {
            return this.symbols[ key ];
        }
        throw new ReferenceError( `Unknown symbol "${ key }"` );
    }

    specify( text, $SPEC ) {
        const SPEC = this.s( $SPEC ),
              ptr = this.alloc( text.length );
        SPEC.set( ptr, 0, 0, 0, text.length );
        writeString( text, this.mem, ptr );
        return SPEC.ptr;
    }

    d( ptr ) {
        return new Descriptor( this, ptr );
    }

    s( ptr ) {
        return new Specifier( this, ptr );
    }

    // SIL source that declares each registered extension via its
    // source-language LOAD statement. -HIDE/-UNHIDE bracket the block so
    // the declarations don't appear in listings or advance &STNO.
    #buildPreamble() {
        const loads = [];
        for ( const [ name, ext ] of Object.entries( this.extensions ) ) {
            const argTypes = ext.args.map( ( k ) => TYPE_NAMES[ k ] ).join( ',' );
            const resultType = TYPE_NAMES[ ext.result ];
            loads.push( ` LOAD('${ name }(${ argTypes })${ resultType }','JS')` );
        }
        if ( !loads.length ) return '';
        return [ '-HIDE', ...loads, '-UNHIDE', '' ].join( '\n' );
    }
}
