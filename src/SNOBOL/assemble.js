"use strict";

import SNOBOL from './base.js';

// Macros that emit memory at load time.
const DATA_MACROS = [
    'ARRAY', 'BUFFER', 'DESCR',
    'FORMAT', 'REAL', 'SPEC', 'STRING'
];

// EQU also binds its label to the assembly cursor, but defines a symbolic
// constant rather than emitting storage, so the loader doesn't replay it.
const MEMORY_LOCATION_MACROS = [ ...DATA_MACROS, 'EQU' ];

// Markers that occupy neither memory nor executable code. A label on one
// aliases the next statement that does.
const LOCATIONLESS_MACROS = [ 'LHERE', 'PROC', 'TITLE' ];

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

// Run a SIL statement through vm.exec, resolving its operand callback first.
// `label` defaults to the statement's own label, but initData overrides it
// with the deferred cell's ptr so DESCR/SPEC fill that exact cell.
function execStatement( vm, stmt, label = stmt[ 0 ] ) {
    return vm.exec( label, stmt[ 1 ], argsFor( vm, stmt ), stmt[ 3 ] );
}

function reserveDeferredData( vm, stmt, deferredData ) {
    const ptr = stmt[ 1 ] === 'SPEC' ? vm.s().ptr : vm.d().ptr;

    // Reserve the cell now so later labels see the right memory layout. Fill
    // it after forward labels have been defined.
    deferredData.push( { ptr, stmt } );
    return ptr;
}

function emitStorage( vm, stmt ) {
    const ptr = vm.memPtr;
    execStatement( vm, stmt );
    return ptr;
}

// Assemble one statement from the memory side of SIL and return the memory
// value its label should name. DESCR/SPEC reserve space here, but wait to
// fill their fields until forward labels have been defined.
function assembleData( vm, stmt, deferredData ) {
    const macro = stmt[ 1 ];

    if ( macro === 'DESCR' || macro === 'SPEC' ) {
        return reserveDeferredData( vm, stmt, deferredData );
    }
    if ( macro === 'EQU' ) {
        return execStatement( vm, stmt );
    }
    return emitStorage( vm, stmt );
}

// Initialize the reserved DESCR/SPEC cells now that forward labels are
// defined. Passing the reserved ptr as the label makes the macro fill that
// exact cell instead of allocating a fresh one.
function initData( vm, deferredData ) {
    for ( const { ptr, stmt } of deferredData ) {
        execStatement( vm, stmt, ptr );
    }
}

// After full assembly, capture every data-emitting statement with operands
// resolved. The label is preserved as documentation: the loader replays in
// source order with no label binding, so each macro allocates fresh and
// addresses match the symbol table built during assembly.
function captureData( vm, program ) {
    const data = [];

    for ( let i = 0; i < program.length; i++ ) {
        const stmt = program[ i ];
        if ( DATA_MACROS.includes( stmt[ 1 ] ) ) {
            data.push( [
                stmt[ 0 ] || null,
                stmt[ 1 ],
                argsFor( vm, stmt ),
                stmt[ 3 ] || ''
            ] );
        }
    }

    return data;
}

// Walk the SIL listing once: bind labels, execute storage macros to grow
// memPtr correctly, and produce a resolved instruction stream. Memory
// content is recovered separately from `captureData` so the image carries
// data statements rather than a byte image.
function assembleListing( vm, program ) {
    const instructions = [],
          deferredData = [];

    for ( let i = 0; i < program.length; i++ ) {
        const stmt = program[ i ],
              [ label, macro ] = stmt;

        if ( LOCATIONLESS_MACROS.includes( macro ) ) {
            if ( label ) {
                vm.define( label, locationAtHere( vm, program, i, instructions.length ) );
            }
            continue;
        }

        if ( MEMORY_LOCATION_MACROS.includes( macro ) ) {
            const value = assembleData( vm, stmt, deferredData );
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
    return {
        instructions: instructions.map( stmt => [
            stmt[ 0 ], stmt[ 1 ], argsFor( vm, stmt ), stmt[ 3 ] || ''
        ] ),
        data: captureData( vm, program )
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
