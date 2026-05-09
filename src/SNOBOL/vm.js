"use strict";

import SNOBOL from './base.js';

const IMAGE_MEMORY = Symbol( 'SNOBOL.image.memory' );

SNOBOL.D = 3;

// `args` is always a plain array; the assembler resolves the late-binding
// arg callbacks before calling exec, and runtime instructions carry
// resolved arrays directly. `impl` is the pre-bound macro implementation
// (run() appends it once per instruction); when absent (assembly path) we
// fall back to a SNOBOL.sil[macro] lookup.
SNOBOL.VM.prototype.exec = function ( label, macro, args, comment, impl ) {

    if ( this.debug ) {
        const trailer = comment ? '// ' + comment : '';
        const code = ( macro + '(' + JSON.stringify( args ) + ')' ).padEnd( 70, ' ' );
        console.log( '[%s] [%s] %s %s',
            SNOBOL.str.pad( '' + this.instructionPointer, 4 ),
            SNOBOL.str.pad( label || '', 6 ),
            code,
            trailer
        );
    }

    this.currentLabel = label;
    const returnValue = ( impl || SNOBOL.sil[ macro ] ).call( this, ...args );

    const watch = this.options.watch;
    if ( watch && watch.length > 0 ) {
        watch.forEach( function ( variable ) {
            let value;

            if ( variable === 'CSTACK' || variable === 'OSTACK' ) {
                value = this[ variable ].addr;
            } else {
                value = Object.hasOwn( this.symbols, variable ) ? this.symbols[ variable ] : 'UNDEF';
            }
            console.log(
                '→ %s: %s',
                SNOBOL.str.pad( variable, 6, 'left' ),
                value
            );
        }, this );
    }

    if ( typeof returnValue === 'boolean' ) {
        // Normalize boolean to exit code and do not terminate the process abruptly
        this.exitCode = returnValue ? 0 : 1;
        return returnValue;
    }

    return returnValue;
};


SNOBOL.VM.prototype.log = function ( ...args ) {
    if ( this.debug ) {
        console.log( ...args );
    }
};

SNOBOL.VM.prototype.jmp = function ( loc ) {
    // Omitted optional branch operands arrive as undefined (or null from the
    // PEG grammar's empty-list-slot rule); SIL specifies fall-through.
    if ( typeof loc === 'number' ) {
        this.instructionPointer = loc;
        this.instructionPointerChanged = true;
    }
};

// Host options override a few assembled SIL switches after data
// initialization. This keeps the historical SIL constants intact while
// giving the JS host control over banner, listing, and statistics output.
const HOST_OUTPUT_OPTIONS = [
    [ 'LISTCL', 'listing' ],
    [ 'BANRCL', 'banner' ],
    [ 'STATCL', 'statistics' ],
];

function applyHostOutputOptions( vm ) {
    for ( const [ symbol, option ] of HOST_OUTPUT_OPTIONS ) {
        if ( Object.hasOwn( vm.symbols, symbol ) ) {
            vm.d( symbol ).addr = vm.options[ option ] ? 1 : 0;
        }
    }
}

// Branching macros update instructionPointer themselves. Everything else
// falls through to the next compact instruction.
function interpret( vm, instructions ) {
    while ( vm.instructionPointer >= 0 && vm.instructionPointer < instructions.length ) {
        const loc = vm.instructionPointer;
        vm.instructionPointerChanged = false;
        vm.exec( ...instructions[ loc ] );
        if ( !vm.instructionPointerChanged && vm.instructionPointer === loc ) {
            vm.instructionPointer++;
        }
    }
}

function isImage( program ) {
    return program && Array.isArray( program.instructions );
}

SNOBOL.VM.prototype.seedHostSymbols = function () {
    for ( const sym in SNOBOL.programSymbols ) {
        if ( !Object.hasOwn( this.symbols, sym ) ) {
            this.define( sym, SNOBOL.programSymbols[ sym ] );
        }
    }
    SNOBOL.tableNames.forEach( ( table, idx ) => {
        if ( !Object.hasOwn( this.symbols, table ) ) {
            this.define( table, idx );
        }
    } );
};

// Allocate raw byte buffers for host-supplied string constants (ALPHA,
// AMPST, COLSTR, QTSTR). These sit at the start of memory ahead of any SIL
// data statement; they're a property of the host environment, not the SIL
// source, so the loader writes them before replaying image.data.
function allocateHostStrings( vm ) {
    for ( const sym in SNOBOL.programSymbols ) {
        const value = SNOBOL.programSymbols[ sym ];
        if ( typeof value === 'string' ) {
            const ptr = vm.alloc( value.length ),
                  encoded = SNOBOL.str.encode( value );
            vm.mem.set( encoded.subarray( 0, value.length ), ptr );
        }
    }
}

// Replay the image's data statements against this VM. Each storage macro
// allocates at memPtr in source order, reproducing the layout captured by
// the translator. The label in each entry is documentation only; passing
// undefined as currentLabel forces DESCR/SPEC to allocate fresh instead of
// resolving the label back to its address.
function replayDataStatements( vm, data ) {
    for ( const stmt of data ) {
        vm.currentLabel = undefined;
        SNOBOL.sil[ stmt[ 1 ] ].apply( vm, stmt[ 2 ] );
    }
}

// Hydrate the VM's symbols and memory from an image. Subsequent VMs that
// share the same image object reuse a cached memory snapshot to skip the
// data-statement replay.
SNOBOL.VM.prototype.loadImage = function ( image ) {
    if ( !Array.isArray( image.data ) ) {
        throw new Error( 'Malformed SNOBOL image' );
    }

    this.symbols = { ...image.symbols };

    const cached = image[ IMAGE_MEMORY ];
    if ( cached !== undefined ) {
        if ( cached.template.length > this.mem.length ) {
            this.grow( cached.template.length );
        }
        this.mem.set( cached.template, 0 );
        this.memPtr = cached.memPtr;
    } else {
        this.memPtr = 0;
        allocateHostStrings( this );
        replayDataStatements( this, image.data );
        // Snapshot the assembled memory so subsequent VMs sharing this
        // image skip the replay and just copy a typed array.
        image[ IMAGE_MEMORY ] = {
            template: this.mem.slice( 0, this.memPtr ),
            memPtr: this.memPtr
        };
    }
};

SNOBOL.VM.prototype.run = function ( program = SNOBOL.image ) {
    let assembled;
    if ( isImage( program ) ) {
        this.reset();
        this.loadImage( program );
        assembled = program;
    } else {
        assembled = SNOBOL.assemble( this, program );
    }

    // The image stores 4-tuples [label, macro, args, comment]; runtime
    // dispatch wants the macro impl too, so append it here. Looking up
    // SNOBOL.sil[macro] once per program rather than once per dispatch
    // is worth 10-20% on CPU-heavy fixtures (kalah, n-queens, recognizer).
    const instructions = assembled.instructions.map( stmt =>
        [ ...stmt, SNOBOL.sil[ stmt[ 1 ] ] ]
    );

    this.instructionPointer = 0;
    this.instructionPointerChanged = false;
    applyHostOutputOptions( this );
    interpret( this, instructions );

    return !( this.instructionPointer < 0 );
};

// Stack pointer pseudo-descriptor: lets `vm.d('CSTACK')` and `vm.d('OSTACK')`
// be used wherever a Descriptor is expected, while delegating addr reads/writes
// to the live stack object. Other slots are inert.
class RegisterDescriptor {
    constructor( vm, name ) {
        this.name = name;
        this.width = 3;
        this._target = name === 'CSTACK' ? vm.CSTACK : vm.OSTACK;
    }

    get addr()     { return this._target.addr; }
    set addr( v )  { this._target.addr = v; }
    get flags()    { return 0; }
    set flags( v ) { /* ignore */ }
    get value()    { return 0; }
    set value( v ) { /* ignore */ }

    toString() {
        return '<' + this.name + ' A=' + this._target.addr + '>';
    }
}

SNOBOL.VM.prototype.d = function ( ptr ) {
    if ( ptr instanceof SNOBOL.Descriptor ) {
        return ptr;
    }
    if ( ptr === 'CSTACK' ) {
        return this.CSTACK_DESCRIPTOR;
    }
    if ( ptr === 'OSTACK' ) {
        return this.OSTACK_DESCRIPTOR;
    }
    return new SNOBOL.Descriptor( this, ptr );
};

SNOBOL.VM.prototype.s = function ( ptr ) {
    return ptr instanceof SNOBOL.Specifier
        ? ptr
        : new SNOBOL.Specifier( this, ptr );
};

SNOBOL.VM.prototype.reset = function () {
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
    this.CSTACK_DESCRIPTOR = new RegisterDescriptor( this, 'CSTACK' );
    this.OSTACK_DESCRIPTOR = new RegisterDescriptor( this, 'OSTACK' );
};
