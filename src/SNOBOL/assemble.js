"use strict";

import SNOBOL from './base.js';

const LABEL = 0,
      MACRO = 1,
      OPERANDS = 2,
      COMMENT = 3,
      SPECIFIER_SIZE = 2 * SNOBOL.D;

// SIL operands are emitted as `function (vm) { return [...]; }` so that
// vm.$('LABEL') resolves after forward labels have been bound. Invoke the
// callback against this assembly's scratch vm to get a plain array.
function argsFor( vm, stmt ) {
    const args = stmt[ OPERANDS ];
    return typeof args === 'function' ? args( vm ) : args;
}

function encodedLength( value ) {
    return SNOBOL.str.encode( value ).length;
}

// Storage declarations have two assembly phases. First, reserve exactly the
// words they will occupy so labels can be bound. Later, replay the same
// declarations after all labels are known so relocatable operands resolve.
const STORAGE_MACROS = new Set( [
    'ARRAY', 'BUFFER', 'DESCR',
    'FORMAT', 'SPEC', 'STRING'
] );

// EQU also binds its label to the assembly cursor, but defines a symbolic
// constant rather than emitting storage, so the loader doesn't replay it.
const MEMORY_LOCATION_MACROS = new Set( [ ...STORAGE_MACROS, 'EQU' ] );

// Markers that occupy neither memory nor executable code. A label on one
// aliases the next statement that does.
const LOCATIONLESS_MACROS = new Set( [ 'LHERE', 'PROC', 'TITLE' ] );

// Starting at a marker that occupies no memory and emits no instruction
// (LHERE/PROC/TITLE), skip any more such markers and return the source index
// of the next statement with a real memory or instruction location.
function nextLocatedStatement( program, index ) {
    let next = index + 1;

    while (
        next < program.length &&
        LOCATIONLESS_MACROS.has( program[ next ][ MACRO ] )
    ) {
        next++;
    }

    return next;
}

function markerLocation( vm, program, index, nextInstruction ) {
    const next = nextLocatedStatement( program, index );
    const macro = next < program.length && program[ next ][ MACRO ];

    // LHERE/PROC mean "the current location". The active counter is memory
    // when the next located statement is storage, and code otherwise.
    return MEMORY_LOCATION_MACROS.has( macro )
        ? vm.memPtr
        : nextInstruction;
}

function reserveStorage( vm, stmt ) {
    const ptr = vm.memPtr,
          macro = stmt[ MACRO ];

    switch ( macro ) {
    case 'ARRAY':
        vm.alloc( argsFor( vm, stmt )[ 0 ] * SNOBOL.D );
        break;
    case 'BUFFER':
        vm.alloc( argsFor( vm, stmt )[ 0 ] );
        break;
    case 'DESCR':
        vm.alloc( SNOBOL.D );
        break;
    case 'FORMAT':
    case 'STRING':
        vm.alloc( SPECIFIER_SIZE + encodedLength( argsFor( vm, stmt )[ 0 ] ) );
        break;
    case 'SPEC':
        vm.alloc( SPECIFIER_SIZE );
        break;
    default:
        throw new Error( 'Unknown storage macro: ' + macro );
    }

    return ptr;
}

function emitInstruction( instructions, stmt ) {
    const location = instructions.length;
    instructions.push( stmt );
    return location;
}

function storageOrConstantLocation( vm, stmt ) {
    return stmt[ MACRO ] === 'EQU'
        ? SNOBOL.sil.EQU.apply( vm, argsFor( vm, stmt ) )
        : reserveStorage( vm, stmt );
}

function statementLocation( vm, program, instructions, stmt, index ) {
    const macro = stmt[ MACRO ];

    if ( LOCATIONLESS_MACROS.has( macro ) ) {
        return markerLocation( vm, program, index, instructions.length );
    }

    if ( MEMORY_LOCATION_MACROS.has( macro ) ) {
        return storageOrConstantLocation( vm, stmt );
    }

    return emitInstruction( instructions, stmt );
}

function bindLabel( vm, label, location ) {
    if ( label ) {
        vm.define( label, location );
    }
}

function imageStatement( vm, stmt ) {
    return [
        stmt[ LABEL ],
        stmt[ MACRO ],
        argsFor( vm, stmt ),
        stmt[ COMMENT ] || ''
    ];
}

function initializeReservedStorage( vm, program, dataStart, dataEnd ) {
    // Now that all labels are bound, replay storage macros from the start of
    // the reserved data region so relocatable operands resolve into the same
    // cells reserved during the first pass.
    vm.memPtr = dataStart;
    try {
        for ( const stmt of program ) {
            if ( STORAGE_MACROS.has( stmt[ MACRO ] ) ) {
                SNOBOL.sil[ stmt[ MACRO ] ].apply( vm, argsFor( vm, stmt ) );
            }
        }
        if ( vm.memPtr !== dataEnd ) {
            throw new Error( 'Data replay changed assembled storage size' );
        }
    } catch ( e ) {
        vm.memPtr = dataEnd;
        throw e;
    }
}

// Walk the SIL listing twice: first to bind labels and reserve storage,
// then to populate the reserved cells with operand-resolved values.
// Returns a resolved instruction stream. The caller snapshots vm.mem.
function assembleListing( vm, program ) {
    const instructions = [],
          dataStart = vm.memPtr;

    for ( let i = 0; i < program.length; i++ ) {
        const stmt = program[ i ],
              location = statementLocation( vm, program, instructions, stmt, i );
        bindLabel( vm, stmt[ LABEL ], location );
    }

    initializeReservedStorage( vm, program, dataStart, vm.memPtr );

    return instructions.map( stmt => imageStatement( vm, stmt ) );
}

// Assembly is a pure function from a SIL listing to an image. It runs on
// a throwaway scratch VM whose mem/symbols become the snapshot shipped to
// the runtime; the caller never sees that scratch state.
SNOBOL.assemble = function ( program ) {
    const vm = new SNOBOL.VM();
    vm.seedHostSymbols();
    const instructions = assembleListing( vm, program );

    return {
        symbols: { ...vm.symbols },
        memory: vm.mem.slice( 0, vm.memPtr ),
        instructions
    };
};
