"use strict";

import { D } from './datatypes.js';
import { VM } from './vm.js';
import { sil } from './sil.js';
import { str } from './string.js';
import { constants, defaults, hostStrings, streamActions, syntaxTables } from './syntax.js';

const SPECIFIER_SIZE = 2 * D;

// These macros write data into the image, so pass 1 has to reserve space
// for them before pass 2 can fill in their operands.
const STORAGE_MACROS = new Set( [ 'ARRAY', 'BUFFER', 'DESCR', 'FORMAT', 'SPEC', 'STRING' ] );

// These mark a location in the listing, but do not generate code or data.
const MARKER_MACROS = new Set( [ 'LHERE', 'PROC', 'TITLE' ] );

// Build the image in a temporary VM. The VM gives us the same memory and
// symbol helpers the runtime uses, but only its final memory and symbol table
// are kept.
//
// Pass 1 records labels and reserves data space. Pass 2 writes the data now
// that forward references have labels to point at.
export function assemble( program ) {
    const vm = new VM();

    // Constants and defaults appear in SIL as names, just like labels.
    Object.assign( vm.symbols, constants, defaults );

    // MDATA strings belong in the assembled image. Keeping them out of reset()
    // lets low-level macro tests start with empty memory.
    for ( const name in hostStrings ) {
        vm.define( name, hostStrings[ name ] );
    }

    const instructions = [],
          dataStart = vm.memPtr;

    // Pass 1: bind labels and reserve storage.
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

    // Pass 2: write the storage macros into the reserved data segment.
    for ( const stmt of program ) {
        if ( STORAGE_MACROS.has( stmt.macro ) ) {
            sil[ stmt.macro ].apply( vm, argsFor( vm, stmt ) );
        }
    }
    if ( vm.memPtr !== dataEnd ) {
        throw new Error( 'Data replay changed assembled storage size' );
    }

    return {
        symbols: { ...vm.symbols },
        memory: vm.mem.slice( 0, dataEnd ),
        instructions: instructions.map( stmt => [
            stmt.label,
            stmt.macro,
            argsFor( vm, stmt )
        ] ),
    };
}

// A marker label belongs to the next statement that actually occupies
// memory or an instruction slot. Consecutive markers all name that same spot.
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

// Reserve the same amount of memory the storage macro will write in pass 2.
// The current pointer is the address for the macro's label.
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

// The parser leaves expressions as small trees. Resolve them here, after
// pass 1 has bound the labels.
function argsFor( vm, stmt ) {
    return stmt.operands.map( operand => resolveOperand( vm, operand ) );
}

function resolveOperand( vm, operand ) {
    if ( Array.isArray( operand ) ) {
        return operand.map( item => resolveOperand( vm, item ) );
    }

    if ( operand && typeof operand === 'object' ) {
        if ( 'symbol' in operand ) {
            return resolveSymbol( vm, operand.symbol );
        }
        if ( 'negate' in operand ) {
            return -resolveOperand( vm, operand.negate );
        }
        if ( 'operator' in operand ) {
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

// Syntax table names and stream actions are command names, not labels. Leave
// those alone; resolve every other name through the symbol table.
function resolveSymbol( vm, name ) {
    if ( name in syntaxTables || streamActions.has( name ) ) {
        return name;
    }
    return vm.$( name );
}
