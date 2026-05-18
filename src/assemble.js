// Two-pass assembler: lays out storage, resolves symbols, then writes the
// SIL program's data and instructions into VM memory.

import { VM } from './vm.js';
import { sil } from './sil.js';
import { constants, defaults, hostStrings, streamActions, syntaxTables } from './syntax.js';

// Assembly-time macros whose return value is what their label binds to.
// Storage macros claim memory and return its address. EQU returns a value
// directly. Pass 1 runs each macro to bind its label. Pass 2 reruns the
// storage macros to write their real data once every symbol is bound.
const ASSEMBLY_MACROS = [ 'ARRAY', 'BUFFER', 'DESCR', 'EQU', 'FORMAT', 'SPEC', 'STRING' ];

// These mark a location in the listing, but do not generate code or data.
const MARKER_MACROS = [ 'LHERE', 'PROC', 'TITLE' ];

export function assemble( program ) {
    const vm = new VM();

    prepareImageVm( vm );

    // Walk the listing twice: first to bind labels and reserve data, then to
    // write data now that operands can resolve.
    const dataStart = vm.memPtr,
          instructions = bindLabelsAndReserveStorage( vm, program ),
          dataEnd = vm.memPtr;

    writeReservedStorage( vm, program, dataStart, dataEnd );

    return imageFrom( vm, instructions, dataEnd );
}

function prepareImageVm( vm ) {
    // Constants and defaults appear in SIL as names, just like labels.
    Object.assign( vm.symbols, constants, defaults );

    // MDATA strings belong in the assembled image. Keeping them out of reset()
    // lets low-level macro tests start with empty memory.
    for ( const name in hostStrings ) {
        vm.define( name, hostStrings[ name ] );
    }
}

// Decide where every label points. Storage labels point into memory.
// EQU labels point at a computed value. Executable labels point into the
// instruction array. Assembly-time macros return whatever their label
// should bind to, so the macro itself sources both the label value and
// (for storage) the memPtr advance.
function bindLabelsAndReserveStorage( vm, program ) {
    const instructions = [];

    for ( let i = 0; i < program.length; i++ ) {
        const stmt = program[ i ];
        let location;
        if ( ASSEMBLY_MACROS.includes( stmt.macro ) ) {
            location = reserveAssemblyStatement( vm, stmt );
        } else if ( MARKER_MACROS.includes( stmt.macro ) ) {
            location = markerLocation( program, i, vm.memPtr, instructions.length );
        } else {
            location = instructions.length;
            instructions.push( stmt );
        }
        if ( stmt.label ) vm.define( stmt.label, location );
    }

    return instructions;
}

// Run a storage or EQU macro to claim memory and discover the label's
// location. Operands that reference forward labels throw during symbol
// lookup. We treat such operands as zero so the macro can run to claim
// its memory. Pass 2 reruns the macro with every symbol bound and
// overwrites the data.
function reserveAssemblyStatement( vm, stmt ) {
    const args = stmt.operands.map( operand => {
        try { return resolveOperand( vm, operand ); }
        catch { return 0; }
    } );
    return sil[ stmt.macro ].apply( vm, args );
}

// Rewind to the data segment and let storage macros write into the cells
// claimed by the first pass, now with every symbol resolved.
function writeReservedStorage( vm, program, dataStart, dataEnd ) {
    vm.memPtr = dataStart;
    for ( const stmt of program ) {
        if ( ASSEMBLY_MACROS.includes( stmt.macro ) ) {
            sil[ stmt.macro ].apply( vm, argsFor( vm, stmt ) );
        }
    }
    if ( vm.memPtr !== dataEnd ) {
        throw new Error( 'Data replay changed assembled storage size' );
    }
}

// Resolve instruction operands at the end so forward labels are available.
function imageFrom( vm, instructions, dataEnd ) {
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
    while ( next < program.length && MARKER_MACROS.includes( program[ next ].macro ) ) {
        next++;
    }
    if ( next < program.length && ASSEMBLY_MACROS.includes( program[ next ].macro ) ) {
        return memPtr;
    }
    return instructionCount;
}

// The parser leaves expressions as small trees. Resolve them after labels
// have been bound.
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
// those alone. Resolve every other name through the symbol table.
function resolveSymbol( vm, name ) {
    if ( name in syntaxTables || streamActions.includes( name ) ) {
        return name;
    }
    return vm.$( name );
}
