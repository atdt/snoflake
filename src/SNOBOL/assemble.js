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

// Data macros that lay out memory at load time. EQU only defines a symbolic
// constant, so it is captured in the image's symbol table rather than replayed.
const DATA_MACROS = [
    'ARRAY', 'BUFFER', 'DESCR',
    'FORMAT', 'REAL', 'SPEC', 'STRING'
];

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

function reserveDeferredData( vm, stmt, sourceIndex, deferredData ) {
    const macro = stmt[ 1 ],
          ptr = macro === 'SPEC' ? vm.s().ptr : vm.d().ptr;

    // Reserve the cell now so later labels see the right memory layout. Fill
    // it after forward labels have been defined.
    deferredData.push( { ip: sourceIndex, ptr, stmt } );
    return ptr;
}

function execAssemblyMacro( vm, label, macro, args, comment ) {
    return vm.exec( label, macro, args, comment );
}

function emitStorage( vm, stmt ) {
    const ptr = vm.memPtr;
    execAssemblyMacro( vm, ...stmt );
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
        return execAssemblyMacro( vm, ...stmt );
    }
    return emitStorage( vm, stmt );
}

// Initialize the reserved DESCR/SPEC cells after forward labels are defined,
// so label operands resolve normally.
function initData( vm, deferredData ) {
    for ( const data of deferredData ) {
        vm.instructionPointer = data.ip;
        execAssemblyMacro(
            vm,
            data.ptr,
            data.stmt[ 1 ],
            data.stmt[ 2 ],
            data.stmt[ 3 ]
        );
    }
}

function compactInstruction( vm, stmt ) {
    return [
        stmt[ 0 ],
        stmt[ 1 ],
        argsFor( vm, stmt ),
        stmt[ 3 ] || ''
    ];
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

    for (
        vm.instructionPointer = 0;
        vm.instructionPointer < program.length;
        vm.instructionPointer++
    ) {
        const sourceIndex = vm.instructionPointer,
              stmt = program[ sourceIndex ],
              [ label, macro ] = stmt;

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
    return {
        instructions: instructions.map( stmt => compactInstruction( vm, stmt ) ),
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
