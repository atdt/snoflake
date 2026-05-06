"use strict";

import SNOBOL from './base.js';

// These macros belong to the memory-location counter.  Most emit storage;
// EQU does not, but it is commonly used at data boundaries for size
// expressions such as END-START.
const MEMORY_LOCATION_MACROS = [
    'ARRAY', 'BUFFER', 'DESCR',
    'EQU', 'FORMAT', 'REAL',
    'SPEC', 'STRING'
];

// These assembly markers do not occupy either address space.  A label on one
// aliases the next located statement.
const LOCATIONLESS_MACROS = [ 'LHERE', 'PROC', 'TITLE' ];

function getArgs( f ) {
    return f
        .toString()
        .replace( /([\s\S]+return \[|\];[\s\S]+)/g, '' )
        .replace( /(vm\.\$\("|"\))/g, '' );
}

// SIL labels live in one textual namespace, but they do not all name the
// same kind of address.  Data labels are offsets in vm.mem; control labels
// are indexes in the translated instruction stream.  Keeping those address
// spaces separate lets LOC operands be the direct branch targets described by
// the macro comments, instead of memory cells that point at branch targets.
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

    // LHERE is EQU *: it names the current location counter.  If the next
    // real statement belongs to assembled data, that counter is vm.mem.length;
    // otherwise it is the next executable instruction.
    return MEMORY_LOCATION_MACROS.includes( macro )
        ? vm.mem.length
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
    // `loc` will be undefined when a procedure takes an optional
    // location argument which the caller omitted. In such cases
    // execution should fall through to the next instruction.
    //
    // Some hand-written macro helpers still branch to fixed system labels
    // by name; translated SIL operands arrive here already resolved.
    if ( typeof loc === 'string' ) {
        loc = this.resolve( loc );
    }
    if ( typeof loc === 'number' ) {
        this.instructionPointer = loc;
        this.instructionPointerChanged = true;
    }
};

// Bind host-controlled SIL switches to vm.options. The descriptors are
// assembled with their default values; flipping them here lets the host
// suppress or enable startup banner, statistics, and listing without
// touching the SIL source.
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

// Each entry returns the value its label should bind to. Side effects
// (recording a deferred initializer, emitting storage) happen here too.
const ASSEMBLERS = {
    // DESCR and SPEC reserve a slot now and run their argument expressions
    // later, once forward references are resolvable.
    DESCR: ( vm, stmt, state ) => {
        const ptr = vm.d().ptr;
        state.deferredData.push( { ip: state.sourceIndex, ptr, stmt } );
        return ptr;
    },
    SPEC: ( vm, stmt, state ) => {
        const ptr = vm.s().ptr;
        state.deferredData.push( { ip: state.sourceIndex, ptr, stmt } );
        return ptr;
    },

    // Locationless markers: the label aliases the next located statement,
    // which may be data (vm.mem.length) or an executable instruction.
    LHERE: ( vm, _stmt, state ) => locationAtHere(
        vm,
        state.program,
        state.sourceIndex,
        state.instructions.length
    ),
    PROC: ( vm, _stmt, state ) => locationAtHere(
        vm,
        state.program,
        state.sourceIndex,
        state.instructions.length
    ),

    // Storage emitters: the label points at the first emitted cell.
    STRING: ( vm, stmt ) => { const ptr = vm.mem.length; vm.exec( ...stmt ); return ptr; },

    // Compile-time expression: the result of exec is the label's value.
    EQU: ( vm, stmt ) => vm.exec( ...stmt ),
};
ASSEMBLERS.FORMAT = ASSEMBLERS.BUFFER = ASSEMBLERS.ARRAY = ASSEMBLERS.STRING;

// Load the mixed SIL listing into the VM. Data records are assembled into
// vm.mem; executable records are copied into a compact instruction stream.
// Labels keep their SIL address-space split: data labels are memory offsets,
// and control labels are instruction indexes.
function load( vm, program ) {
    const instructions = [],
          deferredData = [],
          state = { program, instructions, deferredData, sourceIndex: 0 };

    for (
        vm.instructionPointer = 0;
        vm.instructionPointer < program.length;
        vm.instructionPointer++
    ) {
        state.sourceIndex = vm.instructionPointer;
        const stmt = program[ vm.instructionPointer ];
        const [ label, macro ] = stmt;
        const assembler = ASSEMBLERS[ macro ];
        if ( assembler ) {
            if ( label ) {
                vm.define( label, assembler( vm, stmt, state ) );
            } else {
                assembler( vm, stmt, state );
            }
        } else {
            if ( label ) {
                vm.define( label, instructions.length );
            }
            instructions.push( stmt );
        }
    }

    initData( vm, deferredData );
    return instructions;
}

// Now that every label is bound, initialize only the DESCR and SPEC records
// reserved during assembly so their argument expressions resolve against the
// final symbol table.
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

// A statement that does not branch advances the instruction pointer by one.
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

    // Assembly is silent; only the execution pass should produce a trace.
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
class RegDescriptor {
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
    this.mem = [];
    this.callbacks = [];
    this.units = {};
    this.INTSPC_BUFFER = null;
    // Keep stack pointers as VM registers, not memory-backed descriptors,
    // to avoid accidental overwrites by program macros.
    this.CSTACK = { addr: 0 };
    this.OSTACK = { addr: 0 };
    this.CSTACK_DESCRIPTOR = new RegDescriptor( this, 'CSTACK' );
    this.OSTACK_DESCRIPTOR = new RegDescriptor( this, 'OSTACK' );
};
