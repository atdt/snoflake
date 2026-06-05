// The virtual machine: word-addressed memory, descriptor and specifier
// accessors, and the dispatch loop that executes the assembled SIL macros.

import { D, Descriptor, Specifier } from './datatypes.js';
import { Diagnostics } from './diagnostics.js';
import {
    extensions as defaultExtensions,
    formatPrototype,
    parsePrototype,
} from './extensions.js';
import { defaultLoader, defaultStdout, UnitTable } from './io.js';
import { sil } from './sil.js';
import { writeString } from './string.js';
import { bindSyntaxTables, buildSyntaxTables } from './syntax.js';

const WORD_SIZE = Float64Array.BYTES_PER_ELEMENT;
const INITIAL_WORDS = 512 * 1024;
const MAX_WORDS = 256 * 1024 * 1024;

function wordsToBytes( words ) {
    return words * WORD_SIZE;
}

// Each host keyword maps a VM option to the SIL descriptor holding its runtime
// value, plus the default applied when the option is unset.
const HOST_KEYWORDS = {
    case: { symbol: 'CASECL', defaultValue: true },
    list: { symbol: 'LISTCL', defaultValue: false },
    banner: { symbol: 'BANRCL', defaultValue: false },
    multilineStrings: { symbol: 'MULTILN', defaultValue: true },
    statistics: { symbol: 'STATCL', defaultValue: false },
    stlimit: { symbol: 'EXLMCL', defaultValue: -1 }, // -1 means unlimited
};

export class VM {
    constructor( options = {} ) {
        this.options = { ...options };
        this.loader = this.options.loader || defaultLoader;
        // Extensions are function prototypes ('NAME(TYPES)RESULT') mapped to
        // their implementation, and host extensions merge over the defaults.
        // Pass `null` to start empty, a bare runtime intended for tests.
        this.extensions = {};
        if ( options.extensions !== null ) {
            for (
                const registry of [ defaultExtensions, options.extensions ]
            ) {
                for (
                    const [ key, impl ] of Object.entries( registry || {} )
                ) {
                    const [ name, entry ] = parsePrototype( key, impl );
                    this.extensions[name] = entry;
                }
            }
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
        this.CSTACK = 0; // Current stack pointer
        this.TSTACK = 0; // Stack top pointer
        this.ESAICL_ADDR = -1; // Count of compiler errors
        this.CSTNCL_ADDR = -1; // Compiler statement counter
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
        this.applyHostKeywords();
        return this.compileInstructions( image.instructions );
    }

    // Load the image's symbols and assembled memory snapshot.
    loadImage( image ) {
        if ( !image || !ArrayBuffer.isView( image.memory ) ) {
            throw new Error( 'Malformed SNOBOL image' );
        }

        // Share the image's symbol table; execution only reads it.
        this.symbols = image.symbols;
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
        bindSyntaxTables(
            this.syntaxTables,
            ( name ) => this.symbols[name] ?? 0,
        );
    }

    applyHostKeywords() {
        // The image loads each keyword descriptor with its SIL default;
        // override it from the host option, or the keyword's own default when
        // the option is unset.
        for ( const option in HOST_KEYWORDS ) {
            const { symbol, defaultValue } = HOST_KEYWORDS[option],
                value = this.options[option] ?? defaultValue;
            if ( Object.hasOwn( this.symbols, symbol ) ) {
                this.d( symbol ).addr = Number( value );
            }
        }
    }

    // Compile each [macro, args] image entry into a call frame: the macro's
    // implementation followed by six argument slots, the widest macro arity.
    compileInstructions( instructions ) {
        return instructions.map( ( [ macro, args ], idx ) => {
            const impl = sil[macro];
            if ( !impl ) {
                throw new Error(
                    `Unknown SIL macro "${macro}" at instruction ${idx}`,
                );
            }
            const [ a, b, c, d, e, f ] = args;
            return [ impl, a, b, c, d, e, f ];
        } );
    }

    interpret( instructions ) {
        while ( this.ip >= 0 && this.ip < instructions.length ) {
            const frame = instructions[this.ip++];
            frame[0].call(
                this,
                frame[1],
                frame[2],
                frame[3],
                frame[4],
                frame[5],
                frame[6],
            );
        }
    }

    jmp( loc ) {
        // Undefined or null branch operands are fall-through.
        if ( typeof loc === 'number' ) {
            // Branch targets read from memory arrive as Float64 cell values.
            // Coercing keeps ip a small integer, which keeps the dispatch
            // loop's array indexing on the engine's fast path.
            this.ip = loc | 0;
        }
    }

    resetMemory() {
        this.memPtr = 0;
        this.buffer = new ArrayBuffer( wordsToBytes( INITIAL_WORDS ), {
            maxByteLength: wordsToBytes( MAX_WORDS ),
        } );
        // SIL storage is word-addressed. Each word is a Float64 cell holding
        // a number, so one length-tracking view serves every field read.
        this.mem = new Float64Array( this.buffer );
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

    // Bind a symbol. A string value allocates storage, encodes the bytes,
    // and points the symbol at that storage. A number is stored verbatim.
    define( symbol, value ) {
        if ( typeof value === 'string' ) {
            const ptr = this.alloc( value.length );
            this.symbols[symbol] = ptr;
            writeString( value, this.mem, ptr );
        } else {
            this.symbols[symbol] = value;
        }
    }

    // Look up a symbol's bound value (a storage pointer or raw number),
    // throwing if undefined. Kept to one character because the macros
    // call it constantly.
    $( key ) {
        if ( Object.hasOwn( this.symbols, key ) ) {
            return this.symbols[key];
        }
        throw new ReferenceError( `Unknown symbol "${key}"` );
    }

    specify( text, $SPEC = this.alloc( 2 * D ) ) {
        const SPEC = this.s( $SPEC ),
            ptr = this.alloc( text.length );
        SPEC.set( ptr, 0, 0, 0, text.length );
        writeString( text, this.mem, ptr );
        return SPEC.ptr;
    }

    // Return a Descriptor view over the cells at `ref`. `ref` is a
    // storage pointer, or a symbol name that resolves to one.
    d( ref ) {
        const ptr = typeof ref === 'string' ? this.$( ref ) : ref;
        return new Descriptor( this, ptr );
    }

    s( ref ) {
        const ptr = typeof ref === 'string' ? this.$( ref ) : ref;
        return new Specifier( this, ptr );
    }

    // SIL source that declares each registered extension via its
    // source-language LOAD statement. -HIDE/-UNHIDE bracket the block so
    // the declarations don't appear in listings or advance &STNO.
    #buildPreamble() {
        const loads = Object.entries( this.extensions ).map(
            ( [ name, ext ] ) => ` LOAD('${formatPrototype( name, ext )}')`,
        );
        if ( !loads.length ) return '';
        return [ '-HIDE', ...loads, '-UNHIDE', '' ].join( '\n' );
    }
}
