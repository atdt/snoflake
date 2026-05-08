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

// Load the mixed SIL listing into two address spaces: assembled data in
// vm.mem, and executable statements in a compact instruction stream.
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
    return instructions.map( stmt => compactInstruction( vm, stmt ) );
}

SNOBOL.assemble = function ( vm, program ) {
    vm.seedHostSymbols();

    // Assembly is silent. Debug output should show executed SIL.
    const savedDebug = vm.debug;
    vm.debug = false;

    try {
        const instructions = assembleListing( vm, program );

        return {
            format: 1,
            symbols: { ...vm.symbols },
            memPtr: vm.memPtr,
            mem: Array.from( vm.mem.slice( 0, vm.memPtr ) ),
            instructions
        };
    } finally {
        vm.debug = savedDebug;
    }
};
