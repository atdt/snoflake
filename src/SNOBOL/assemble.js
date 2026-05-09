"use strict";

import SNOBOL from './base.js';

const LABEL = 0,
      MACRO = 1,
      OPERANDS = 2,
      COMMENT = 3,
      SPECIFIER_SIZE = 2 * SNOBOL.D;

// SIL operands are emitted as a callback so vm.$('LABEL') resolves at
// execution time, after forward labels have been bound. Resolving the
// callback here gives us the plain array form vm.exec consumes.
function argsFor( vm, stmt ) {
    const args = stmt[ OPERANDS ];
    return typeof args === 'function' ? args.call( vm ) : args;
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

// Run a SIL statement through vm.exec, resolving its operand callback first.
function execStatement( vm, stmt, label = stmt[ LABEL ] ) {
    return vm.exec( label, stmt[ MACRO ], argsFor( vm, stmt ), stmt[ COMMENT ] );
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
        ? execStatement( vm, stmt )
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

function imageStatement( vm, stmt, label = stmt[ LABEL ] ) {
    return [
        label,
        stmt[ MACRO ],
        argsFor( vm, stmt ),
        stmt[ COMMENT ] || ''
    ];
}

function imageDataStatements( vm, program ) {
    // The loader replays data macros in source order with no label binding,
    // so labels here are documentation rather than directives.
    return program
        .filter( stmt => STORAGE_MACROS.has( stmt[ MACRO ] ) )
        .map( stmt => imageStatement( vm, stmt, stmt[ LABEL ] || null ) );
}

function initializeReservedStorage( vm, dataStart, dataEnd, data ) {
    // Now that all labels are bound, replay storage macros from the start of
    // the reserved data region to initialize those exact addresses.
    vm.memPtr = dataStart;
    try {
        for ( const stmt of data ) {
            execStatement( vm, stmt, undefined );
        }

        if ( vm.memPtr !== dataEnd ) {
            throw new Error( 'Data replay changed assembled storage size' );
        }
    } catch ( e ) {
        vm.memPtr = dataEnd;
        throw e;
    }
}

// Walk the SIL listing once: bind labels, reserve storage, and produce a
// resolved instruction stream. Memory content is serialized as data statements
// rather than a byte image.
function assembleListing( vm, program ) {
    const instructions = [],
          dataStart = vm.memPtr;

    for ( let i = 0; i < program.length; i++ ) {
        const stmt = program[ i ],
              location = statementLocation( vm, program, instructions, stmt, i );
        bindLabel( vm, stmt[ LABEL ], location );
    }

    const dataEnd = vm.memPtr,
          data = imageDataStatements( vm, program );

    initializeReservedStorage( vm, dataStart, dataEnd, data );

    return {
        instructions: instructions.map( stmt => imageStatement( vm, stmt ) ),
        data
    };
}

SNOBOL.assemble = function ( vm, program ) {
    vm.seedHostSymbols();

    // Assembly is silent. Debug output should show executed SIL.
    const savedDebug = vm.debug;
    vm.debug = false;

    try {
        const { instructions, data } = assembleListing( vm, program );

        return {
            symbols: { ...vm.symbols },
            data,
            instructions
        };
    } finally {
        vm.debug = savedDebug;
    }
};
