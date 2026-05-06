"use strict";

import SNOBOL from './base.js';

// These assembly-time statements bind labels in the memory address space.
// Most emit storage. EQU is included because SIL uses it in size expressions
// such as END-START.
const MEMORY_LOCATION_MACROS = [
    'ARRAY', 'BUFFER', 'DESCR',
    'EQU', 'FORMAT', 'REAL',
    'SPEC', 'STRING'
];

// These assembly markers occupy neither memory nor executable code. A label
// on one aliases the next statement that does.
const LOCATIONLESS_MACROS = [ 'LHERE', 'PROC', 'TITLE' ];

function getArgs( f ) {
    return f
        .toString()
        .replace( /([\s\S]+return \[|\];[\s\S]+)/g, '' )
        .replace( /(vm\.\$\("|"\))/g, '' );
}

// Starting at a marker that occupies no memory and emits no instruction
// (LHERE/PROC/TITLE), skip any more such markers and return the source index
// of the next statement with a real memory or instruction location.
function nextLocatedStatement( program, index ) {
    let next = index + 1;

    while (
        next < program.length &&
        LOCATIONLESS_MACROS.includes( program[ next ][ 1 ] )
    ) {
        next++;
    }

    return next;
}

function locationAtHere( vm, program, index, nextInstruction ) {
    const next = nextLocatedStatement( program, index );
    const macro = next < program.length && program[ next ][ 1 ];

    // LHERE/PROC mean "the current location". The active counter is memory
    // when the next located statement is data, and code otherwise.
    return MEMORY_LOCATION_MACROS.includes( macro )
        ? vm.memPtr
        : nextInstruction;
}

SNOBOL.D = 3;

SNOBOL.VM.prototype.exec = function ( label, macro, argsCallback, comment ) {

    if ( this.debug ) {
        comment = comment ? '// ' + comment : '';
        const code = ( macro + '(' + getArgs( argsCallback ) + ')' ).padEnd( 70, ' ' );
        console.log( '[%s] [%s] %s %s',
            SNOBOL.str.pad( '' + this.instructionPointer, 4 ),
            SNOBOL.str.pad( label || '', 6 ),
            code,
            comment
        );
    }

    const args = argsCallback.call( this );

    this.currentLabel = label;
    const returnValue = SNOBOL.sil[ macro ].call( this, ...args );

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
    // Omitted optional branch operands arrive as undefined. SIL specifies
    // fall-through in that case.
    //
    // A few hand-written macro helpers still branch to fixed system labels
    // by name. Translated SIL operands are already resolved.
    if ( typeof loc === 'string' ) {
        loc = this.resolve( loc );
    }
    if ( typeof loc === 'number' ) {
        this.instructionPointer = loc;
        this.instructionPointerChanged = true;
    }
};

// Host options override a few assembled SIL switches after data initialization.
// This keeps the historical SIL constants intact while giving the JS host
// control over banner, listing, and statistics output.
function applyHostOutputOptions( vm ) {
    if ( Object.hasOwn( vm.symbols, 'LISTCL' ) ) {
        vm.d( 'LISTCL' ).addr = vm.options.listing ? 1 : 0;
    }
    if ( Object.hasOwn( vm.symbols, 'BANRCL' ) ) {
        vm.d( 'BANRCL' ).addr = vm.options.banner ? 1 : 0;
    }
    if ( Object.hasOwn( vm.symbols, 'STATCL' ) ) {
        vm.d( 'STATCL' ).addr = vm.options.statistics ? 1 : 0;
    }
}

function reserveDeferredData( vm, stmt, sourceIndex, deferredData ) {
    const macro = stmt[ 1 ],
          ptr = macro === 'SPEC' ? vm.s().ptr : vm.d().ptr;

    // Reserve the cell now so later labels see the right memory layout. Fill
    // it after forward labels have been defined.
    deferredData.push( { ip: sourceIndex, ptr, stmt } );
    return ptr;
}

function emitStorage( vm, stmt ) {
    const ptr = vm.memPtr;
    vm.exec( ...stmt );
    return ptr;
}

// Assemble one statement from the memory side of SIL and return the memory
// value its label should name. DESCR/SPEC reserve space here, but wait to
// fill their fields until forward labels have been defined.
function assembleData( vm, stmt, sourceIndex, deferredData ) {
    const macro = stmt[ 1 ];

    if ( macro === 'DESCR' || macro === 'SPEC' ) {
        return reserveDeferredData( vm, stmt, sourceIndex, deferredData );
    }
    if ( macro === 'EQU' ) {
        return vm.exec( ...stmt );
    }
    return emitStorage( vm, stmt );
}

// Load the mixed SIL listing into two address spaces: assembled data in
// vm.mem, and executable statements in a compact instruction stream.
function load( vm, program ) {
    const instructions = [],
          deferredData = [];

    for (
        vm.instructionPointer = 0;
        vm.instructionPointer < program.length;
        vm.instructionPointer++
    ) {
        const sourceIndex = vm.instructionPointer;
        const stmt = program[ vm.instructionPointer ];
        const [ label, macro ] = stmt;

        if ( LOCATIONLESS_MACROS.includes( macro ) ) {
            if ( label ) {
                vm.define( label, locationAtHere( vm, program, sourceIndex, instructions.length ) );
            }
            continue;
        }

        if ( MEMORY_LOCATION_MACROS.includes( macro ) ) {
            const value = assembleData( vm, stmt, sourceIndex, deferredData );
            if ( label ) {
                vm.define( label, value );
            }
            continue;
        }

        if ( label ) {
            vm.define( label, instructions.length );
        }
        instructions.push( stmt );
    }

    initData( vm, deferredData );
    return instructions;
}

// Initialize the reserved DESCR/SPEC cells after forward labels are defined,
// so label operands resolve normally.
function initData( vm, deferredData ) {
    for ( const data of deferredData ) {
        vm.instructionPointer = data.ip;
        vm.exec(
            data.ptr,
            data.stmt[ 1 ],
            data.stmt[ 2 ],
            data.stmt[ 3 ]
        );
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

SNOBOL.VM.prototype.run = function ( program ) {
    for ( const sym in SNOBOL.programSymbols ) {
        this.define( sym, SNOBOL.programSymbols[sym] );
    }
    SNOBOL.tableNames.forEach( (table, idx) => this.define( table, idx ) );

    // Assembly is silent. Debug output should show executed SIL.
    const savedDebug = this.debug;
    this.debug = false;
    const instructions = load( this, program );
    this.debug = savedDebug;

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
