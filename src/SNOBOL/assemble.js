"use strict";

import { D } from './datatypes.js';
import { VM } from './vm.js';
import { sil } from './sil.js';
import { str } from './string.js';
import { hostStrings, streamActions, syntaxTables } from './syntax.js';

const SPECIFIER_SIZE = 2 * D;

// Macros that emit data into the runtime image. They reserve their cells
// in pass 1 and write resolved operands into them in pass 2.
const STORAGE_MACROS = new Set( [ 'ARRAY', 'BUFFER', 'DESCR', 'FORMAT', 'SPEC', 'STRING' ] );

// Markers that occupy neither memory nor an instruction slot. A label on a
// marker resolves to whatever the next real statement reserves.
const MARKER_MACROS = new Set( [ 'LHERE', 'PROC', 'TITLE' ] );

// Assembly is a pure function from a SIL listing to a runtime image. It
// runs on a throwaway scratch VM whose mem/symbols become the snapshot
// shipped to the runtime; the caller never sees that scratch state.
//
// Pass 1 walks the listing, reserves storage, and binds labels. Operand
// values aren't computed yet -- forward labels haven't resolved -- so
// reserveStorage looks only at sizes, not contents.
//
// Pass 2 replays storage macros so their now-resolvable operands land in
// the cells reserved by pass 1. Instruction operands resolve only once,
// when they're emitted into the image.
export function assemble( program ) {
    const vm = new VM();

    // MDATA host strings (ALPHA, AMPST, COLSTR, QTSTR) live at the start
    // of memory in the assembled image. Allocating them here -- rather
    // than as part of vm.reset -- keeps a fresh runtime VM byte-empty:
    // tests that drive macros directly against an empty memory layout
    // don't pay for strings they don't reference.
    for ( const name in hostStrings ) {
        vm.define( name, hostStrings[ name ] );
    }

    const instructions = [],
          dataStart = vm.memPtr;

    for ( let i = 0; i < program.length; i++ ) {
        const stmt = program[ i ];
        let location;
        if ( STORAGE_MACROS.has( stmt.macro ) ) {
            location = reserveStorage( vm, stmt );
        } else if ( stmt.macro === 'EQU' ) {
            location = sil.EQU.apply( vm, argsFor( vm, stmt ) );
        } else if ( MARKER_MACROS.has( stmt.macro ) ) {
            location = markerLocation( program, i, vm.memPtr, instructions.length );
        } else {
            location = instructions.length;
            instructions.push( stmt );
        }
        if ( stmt.label ) vm.define( stmt.label, location );
    }

    const dataEnd = vm.memPtr;
    vm.memPtr = dataStart;
    try {
        for ( const stmt of program ) {
            if ( STORAGE_MACROS.has( stmt.macro ) ) {
                sil[ stmt.macro ].apply( vm, argsFor( vm, stmt ) );
            }
        }
        if ( vm.memPtr !== dataEnd ) {
            throw new Error( 'Data replay changed assembled storage size' );
        }
    } finally {
        vm.memPtr = dataEnd;
    }

    return {
        symbols: { ...vm.symbols },
        memory: vm.mem.slice( 0, vm.memPtr ),
        instructions: instructions.map( stmt => [
            stmt.label,
            stmt.macro,
            argsFor( vm, stmt )
        ] ),
    };
}

// LHERE/PROC/TITLE all resolve to "wherever the next real statement is".
// Skip past consecutive markers and dispatch on what comes next: storage
// or EQU means a memory cell; an instruction (or end of program) means
// the next instruction slot.
function markerLocation( program, i, memPtr, instructionCount ) {
    let next = i + 1;
    while ( next < program.length && MARKER_MACROS.has( program[ next ].macro ) ) {
        next++;
    }
    if ( next < program.length ) {
        const macro = program[ next ].macro;
        if ( STORAGE_MACROS.has( macro ) || macro === 'EQU' ) return memPtr;
    }
    return instructionCount;
}

// Reserve enough memory for the data this storage macro will emit, but
// don't fill it -- forward labels aren't bound yet. Returns the cell
// address the label should resolve to.
function reserveStorage( vm, stmt ) {
    const ptr = vm.memPtr;
    switch ( stmt.macro ) {
        case 'ARRAY':
            vm.alloc( argsFor( vm, stmt )[ 0 ] * D );
            break;
        case 'BUFFER':
            vm.alloc( argsFor( vm, stmt )[ 0 ] );
            break;
        case 'DESCR':
            vm.alloc( D );
            break;
        case 'FORMAT':
        case 'STRING':
            vm.alloc( SPECIFIER_SIZE + str.encode( argsFor( vm, stmt )[ 0 ] ).length );
            break;
        case 'SPEC':
            vm.alloc( SPECIFIER_SIZE );
            break;
        default:
            throw new Error( 'Unknown storage macro: ' + stmt.macro );
    }
    return ptr;
}

// SIL operands are parsed as data trees. Assembly is where symbols can
// finally resolve, because forward labels have been bound by then.
function argsFor( vm, stmt ) {
    return stmt.operands.map( operand => resolveOperand( vm, operand ) );
}

function resolveOperand( vm, operand ) {
    if ( Array.isArray( operand ) ) {
        return operand.map( item => resolveOperand( vm, item ) );
    }

    if ( operand && typeof operand === 'object' ) {
        if ( Object.hasOwn( operand, 'symbol' ) ) {
            return resolveSymbol( vm, operand.symbol );
        }
        if ( Object.hasOwn( operand, 'negate' ) ) {
            return -resolveOperand( vm, operand.negate );
        }
        if ( Object.hasOwn( operand, 'operator' ) ) {
            const left = resolveOperand( vm, operand.operands[ 0 ] ),
                  right = resolveOperand( vm, operand.operands[ 1 ] );
            switch ( operand.operator ) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
            }
            throw new Error( 'Unknown SIL operand operator: ' + operand.operator );
        }
        throw new Error( 'Unknown SIL operand: ' + JSON.stringify( operand ) );
    }

    return operand;
}

// Syntax-table names and stream-action keywords are not symbols -- they're
// reserved tags that STREAM/CLERTB/PLUGTB consume by name. Pass them
// through verbatim so the symbol table doesn't have to fake an entry for
// each one.
function resolveSymbol( vm, name ) {
    if ( Object.hasOwn( syntaxTables, name ) || streamActions.has( name ) ) {
        return name;
    }
    return vm.$( name );
}
