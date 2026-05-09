"use strict";

import SNOBOL from './base.js';

SNOBOL.D = 3;

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

// Compile each [label, macro, args, ...] image entry into a thunk that
// dispatches to the resolved sil implementation. The thunk also stamps
// vm.currentLabel, which sil.js's fileRole reads when routing I/O.
// Doing the lookup once per program rather than once per dispatch is
// worth 10-20% on CPU-heavy fixtures (kalah, n-queens, recognizer).
function compileInstructions( vm, instructions ) {
    return instructions.map( stmt => {
        const label = stmt[ 0 ],
              impl = SNOBOL.sil[ stmt[ 1 ] ],
              args = stmt[ 2 ];
        return function () {
            vm.currentLabel = label;
            impl.apply( vm, args );
        };
    } );
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

// STREAM uses these strings as dispatch tags for syntax-table actions
// (see syntax.js's syntaxTables). The SIL listing also references them as
// operand names (e.g. CLERTB SNABTB,ERROR), so they need to resolve to
// themselves through vm.$().
const STREAM_ACTIONS = [ 'CONTIN', 'ERROR', 'STOP', 'STOPSH' ];

// Bind the host environment's *constants* into the symbol table: PARMS-style
// numeric values from programSymbols, syntax-table indices, and the STREAM
// dispatch tags. No memory is touched -- ALPHA and the other host strings
// are allocated separately by SNOBOL.assemble. This runs on every reset so
// a fresh VM can drive macros that look up TTL/STACK/UNITI/&c. directly,
// without needing to first walk the assembler.
function seedConstants( vm ) {
    for ( const name in SNOBOL.programSymbols ) {
        const value = SNOBOL.programSymbols[ name ];
        if ( typeof value === 'number' ) {
            vm.symbols[ name ] = value;
        }
    }
    SNOBOL.tableNames.forEach( ( name, idx ) => {
        vm.symbols[ name ] = idx;
    } );
    for ( const action of STREAM_ACTIONS ) {
        vm.symbols[ action ] = action;
    }
}

// Hydrate the VM's symbols and memory from an image. The image's `memory`
// is the byte-for-byte assembled snapshot -- host string constants and SIL
// data declarations both live in it -- so loading is a copy.
SNOBOL.VM.prototype.loadImage = function ( image ) {
    if ( !ArrayBuffer.isView( image.memory ) ) {
        throw new Error( 'Malformed SNOBOL image' );
    }

    this.symbols = { ...image.symbols };
    if ( image.memory.length > this.mem.length ) {
        this.grow( image.memory.length );
    }
    this.mem.set( image.memory, 0 );
    this.memPtr = image.memory.length;
};

SNOBOL.VM.prototype.run = function ( image = SNOBOL.image ) {
    this.reset();
    this.loadImage( image );

    this.instructionPointer = 0;
    this.instructionPointerChanged = false;
    applyHostOutputOptions( this );
    interpret( this, compileInstructions( this, image.instructions ) );

    return !( this.instructionPointer < 0 );
};

SNOBOL.VM.prototype.d = function ( ptr ) {
    return ptr instanceof SNOBOL.Descriptor
        ? ptr
        : new SNOBOL.Descriptor( this, ptr );
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
    seedConstants( this );
};
