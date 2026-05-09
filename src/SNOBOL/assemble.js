"use strict";

import SNOBOL from './base.js';

// Macros that emit memory at load time.
const DATA_MACROS = new Set( [
    'ARRAY', 'BUFFER', 'DESCR',
    'FORMAT', 'REAL', 'SPEC', 'STRING'
] );

// EQU also binds its label to the assembly cursor, but defines a symbolic
// constant rather than emitting storage, so the loader doesn't replay it.
const MEMORY_LOCATION_MACROS = new Set( [ ...DATA_MACROS, 'EQU' ] );

// Markers that occupy neither memory nor executable code. A label on one
// aliases the next statement that does.
const LOCATIONLESS_MACROS = new Set( [ 'LHERE', 'PROC', 'TITLE' ] );

const SPECIFIER_SIZE = 2 * SNOBOL.D;

// SIL operands are emitted as a callback so vm.$('LABEL') resolves at
// execution time, after forward labels have been bound. Resolving the
// callback here gives us the plain array form vm.exec consumes.
function argsFor( vm, stmt ) {
    const args = stmt[ 2 ];
    return typeof args === 'function' ? args.call( vm ) : args;
}

// Starting at a marker that occupies no memory and emits no instruction
// (LHERE/PROC/TITLE), skip any more such markers and return the source index
// of the next statement with a real memory or instruction location.
function nextLocatedStatement( program, index ) {
    let next = index + 1;

    while (
        next < program.length &&
        LOCATIONLESS_MACROS.has( program[ next ][ 1 ] )
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
    return MEMORY_LOCATION_MACROS.has( macro )
        ? vm.memPtr
        : nextInstruction;
}

// Run a SIL statement through vm.exec, resolving its operand callback first.
function execStatement( vm, stmt, label = stmt[ 0 ] ) {
    return vm.exec( label, stmt[ 1 ], argsFor( vm, stmt ), stmt[ 3 ] );
}

function encodedLength( value ) {
    return SNOBOL.str.encode( value ).length;
}

function storageSize( vm, stmt ) {
    const macro = stmt[ 1 ];

    switch ( macro ) {
    case 'DESCR':
        return SNOBOL.D;
    case 'SPEC':
        return SPECIFIER_SIZE;
    }

    const args = argsFor( vm, stmt );

    switch ( macro ) {
    case 'ARRAY':
        return args[ 0 ] * SNOBOL.D;
    case 'BUFFER':
        return args[ 0 ];
    case 'FORMAT':
    case 'STRING':
        return SPECIFIER_SIZE + encodedLength( args[ 0 ] );
    default:
        throw new Error( 'Unknown storage macro: ' + macro );
    }
}

function reserveStorage( vm, stmt ) {
    const ptr = vm.memPtr;
    vm.alloc( storageSize( vm, stmt ) );
    return ptr;
}

function emitInstruction( instructions, stmt ) {
    const location = instructions.length;
    instructions.push( stmt );
    return location;
}

function memoryLocation( vm, stmt ) {
    return stmt[ 1 ] === 'EQU'
        ? execStatement( vm, stmt )
        : reserveStorage( vm, stmt );
}

function statementLocation( vm, program, instructions, stmt, index ) {
    const macro = stmt[ 1 ];

    if ( LOCATIONLESS_MACROS.has( macro ) ) {
        return locationAtHere( vm, program, index, instructions.length );
    }

    if ( MEMORY_LOCATION_MACROS.has( macro ) ) {
        return memoryLocation( vm, stmt );
    }

    return emitInstruction( instructions, stmt );
}

function bindLabel( vm, label, location ) {
    if ( label ) {
        vm.define( label, location );
    }
}

function imageStatement( vm, stmt, label = stmt[ 0 ] ) {
    return [
        label,
        stmt[ 1 ],
        argsFor( vm, stmt ),
        stmt[ 3 ] || ''
    ];
}

function dataStatements( vm, program ) {
    // The loader replays data macros in source order with no label binding,
    // so labels here are documentation rather than directives.
    return program
        .filter( stmt => DATA_MACROS.has( stmt[ 1 ] ) )
        .map( stmt => imageStatement( vm, stmt, stmt[ 0 ] || null ) );
}

function initializeData( vm, dataStart, dataEnd, data ) {
    // Now that all labels are bound, replay storage macros from the start of
    // the reserved data region to initialize those exact addresses.
    vm.memPtr = dataStart;
    for ( const stmt of data ) {
        execStatement( vm, stmt, undefined );
    }

    if ( vm.memPtr !== dataEnd ) {
        throw new Error( 'Data replay changed assembled storage size' );
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
        bindLabel( vm, stmt[ 0 ], location );
    }

    const dataEnd = vm.memPtr,
          data = dataStatements( vm, program );

    initializeData( vm, dataStart, dataEnd, data );

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
