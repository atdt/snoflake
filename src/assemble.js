// Two-pass assembler:
//
// - Pass 1 walks the listing, runs each assembly-time macro, and binds every
//   label to its target slot.
// - Pass 2 re-runs the assembly-time macros with all symbols bound so any data
//   they write reflects the final symbol values.
//
// The result is a VM image containing a memory snapshot, an instruction list,
// and a resolved symbol table.

import { VM } from './vm.js';
import { sil } from './sil.js';
import { constants, defaults, hostStrings, streamActions, syntaxTables } from './syntax.js';

// Assembly-time macros run during assembly, not execution. They return the
// value their label binds to. Storage macros (all but EQU) also claim memory.
const ASSEMBLY_MACROS = [ 'ARRAY', 'BUFFER', 'DESCR', 'EQU', 'FORMAT', 'SPEC', 'STRING' ];

// These mark a location in the listing, but do not generate code or data.
const MARKER_MACROS = [ 'LHERE', 'PROC', 'TITLE' ];

export function assemble( program ) {
    const vm = new VM();

    Object.assign( vm.symbols, constants, defaults );
    for ( const name in hostStrings ) {
        vm.define( name, hostStrings[ name ] );
    }

    const dataStart = vm.memPtr,
          instructions = bindLabels( vm, program ),
          dataEnd = vm.memPtr;

    writeStorage( vm, program, dataStart, dataEnd );

    return {
        symbols: { ...vm.symbols },
        memory: vm.mem.slice( 0, dataEnd ),
        // Resolve instruction operands now, with every label bound.
        instructions: instructions.map( stmt => [
            stmt.label,
            stmt.macro,
            argsFor( vm, stmt )
        ] ),
    };
}

// Decide where every label points.
function bindLabels( vm, program ) {
    const instructions = [];

    for ( let i = 0; i < program.length; i++ ) {
        const stmt = program[ i ];
        let location;
        if ( ASSEMBLY_MACROS.includes( stmt.macro ) ) {
            // Assembly-time macros decide the label value.
            // Storage macros also claim memory.
            location = getAssemblyMacroLocation( vm, stmt );
        } else if ( MARKER_MACROS.includes( stmt.macro ) ) {
            // Markers alias the next memory or instruction slot.
            location = getMarkerMacroLocation( program, i, vm.memPtr, instructions.length );
        } else {
            // Executable labels point into the instruction array.
            location = instructions.length;
            instructions.push( stmt );
        }
        if ( stmt.label ) vm.define( stmt.label, location );
    }

    return instructions;
}

// Run an assembly-time macro and return the value its label binds to. Operands
// that reference forward labels throw during symbol lookup. We treat such
// operands as zero so the macro can run to claim its memory. Whatever data the
// macro writes will be overwritten in pass 2 with every symbol bound.
function getAssemblyMacroLocation( vm, stmt ) {
    const args = stmt.operands.map( operand => {
        try { return resolveOperand( vm, operand ); }
        catch { return 0; }
    } );
    return sil[ stmt.macro ].apply( vm, args );
}

// Rewind to the data segment and re-run the assembly-time macros with every
// symbol bound. Storage macros write into the cells they claimed in pass 1.
function writeStorage( vm, program, dataStart, dataEnd ) {
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

// A marker label belongs to the next statement that actually occupies
// memory or an instruction slot. Consecutive markers all name that same spot.
function getMarkerMacroLocation( program, i, memPtr, instructionCount ) {
    for ( let j = i + 1; j < program.length; j++ ) {
        const macro = program[ j ].macro;
        if ( !MARKER_MACROS.includes( macro ) ) {
            return ASSEMBLY_MACROS.includes( macro )
                ? memPtr
                : instructionCount;
        }
    }
    throw new Error( 'Marker has no following anchor' );
}

// The parser leaves expressions as small trees. Resolve them after labels
// have been bound.
function argsFor( vm, stmt ) {
    return stmt.operands.map( operand => resolveOperand( vm, operand ) );
}

function resolveOperand( vm, op ) {
    if ( !op || typeof op !== 'object' ) return op;
    switch ( op.type ) {
        case 'symbol': return resolveName( vm, op.name );
        case 'negate': return -resolveOperand( vm, op.operand );
        case 'add':    return resolveOperand( vm, op.left ) + resolveOperand( vm, op.right );
        case 'sub':    return resolveOperand( vm, op.left ) - resolveOperand( vm, op.right );
        case 'mul':    return resolveOperand( vm, op.left ) * resolveOperand( vm, op.right );
        case 'list':   return op.items.map( item => resolveOperand( vm, item ) );
    }
    throw new Error( 'Unknown SIL operand: ' + JSON.stringify( op ) );
}

// Syntax-table and stream-action names are literal tokens, not symbols.
function resolveName( vm, name ) {
    if ( name in syntaxTables || streamActions.includes( name ) ) {
        return name;
    }
    return vm.$( name );
}
