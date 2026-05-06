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
const LOCATIONLESS_MACROS = [ 'LHERE', 'PROC', 'TITLE' ],
      ASSEMBLY_MACROS = MEMORY_LOCATION_MACROS.concat( LOCATIONLESS_MACROS ),
      ASSEMBLY_MACROS_SET = new Set( ASSEMBLY_MACROS );

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

function locationAtHere( vm, program, index ) {
    const next = nextLocatedStatement( program, index );
    const macro = next < program.length && program[ next ][ 1 ];

    // LHERE is EQU *: it names the current location counter.  If the next
    // real statement belongs to assembled data, that counter is vm.mem.length;
    // otherwise it is the next executable instruction.
    return MEMORY_LOCATION_MACROS.includes( macro )
        ? vm.mem.length
        : next;
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
// (recording a deferred pointer, emitting storage) happen here too. A
// macro absent from this table is treated as an executable instruction:
// its label, if any, binds to the instruction's own index.
const ASSEMBLERS = {
    // DESCR and SPEC reserve a slot now and run their argument expressions
    // later in fixupData, once forward references are resolvable.
    DESCR: ( vm, ip, _stmt, ptrs ) => ( ptrs[ ip ] = vm.d().ptr ),
    SPEC:  ( vm, ip, _stmt, ptrs ) => ( ptrs[ ip ] = vm.s().ptr ),

    // Locationless markers: the label aliases the next located statement,
    // which may be data (vm.mem.length) or an executable instruction.
    LHERE: ( vm, ip, _stmt, _ptrs, program ) => locationAtHere( vm, program, ip ),
    PROC:  ( vm, ip, _stmt, _ptrs, program ) => nextLocatedStatement( program, ip ),

    // Storage emitters: the label points at the first emitted cell.
    STRING: ( vm, _ip, stmt ) => { const ptr = vm.mem.length; vm.exec( ...stmt ); return ptr; },

    // Compile-time expression: the result of exec is the label's value.
    EQU: ( vm, _ip, stmt ) => vm.exec( ...stmt ),
};
ASSEMBLERS.FORMAT = ASSEMBLERS.BUFFER = ASSEMBLERS.ARRAY = ASSEMBLERS.STRING;

// Pass 1: walk the program binding labels and assembling data. DESCR and
// SPEC are pre-allocated but not executed here, because their argument
// expressions may reference symbols that later statements define.
// Returns a map from instruction index to the descriptor/specifier pointer
// reserved for that statement, for the fixup pass to consume.
function assemble( vm, program ) {
    const dataAssemblyPtrs = Object.create( null );

    for (
        vm.instructionPointer = 0;
        vm.instructionPointer < program.length;
        vm.instructionPointer++
    ) {
        const stmt = program[ vm.instructionPointer ];
        const [ label, macro ] = stmt;
        const assembler = ASSEMBLERS[ macro ];
        const value = assembler
            ? assembler( vm, vm.instructionPointer, stmt, dataAssemblyPtrs, program )
            : vm.instructionPointer;
        if ( label ) {
            vm.define( label, value );
        }
    }

    return dataAssemblyPtrs;
}

// Pass 2: now that every label is bound, run DESCR and SPEC at the pointers
// reserved in pass 1 so their argument expressions resolve against the
// final symbol table.
function fixupData( vm, program, dataAssemblyPtrs ) {
    for (
        vm.instructionPointer = 0;
        vm.instructionPointer < program.length;
        vm.instructionPointer++
    ) {
        const stmt = program[ vm.instructionPointer ];
        const macro = stmt[ 1 ];
        if ( macro === 'DESCR' || macro === 'SPEC' ) {
            const ptr = dataAssemblyPtrs[ vm.instructionPointer ];
            vm.exec( ptr, macro, stmt[ 2 ], stmt[ 3 ] );
        }
    }
}

// Pass 3: execute. Assembly macros are skipped — their work was done above.
// A statement that does not branch advances the instruction pointer by one.
function interpret( vm, program ) {
    while ( vm.instructionPointer >= 0 && vm.instructionPointer < program.length ) {
        const loc = vm.instructionPointer;
        const stmt = program[ loc ];
        const macro = stmt[ 1 ];
        if ( !ASSEMBLY_MACROS_SET.has( macro ) ) {
            vm.instructionPointerChanged = false;
            vm.exec( ...stmt );
        }
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
    const dataAssemblyPtrs = assemble( this, program );
    fixupData( this, program, dataAssemblyPtrs );
    this.debug = savedDebug;

    this.instructionPointer = 0;
    this.instructionPointerChanged = false;
    applyHostOutputOptions( this );
    interpret( this, program );

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
