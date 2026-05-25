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
import { constants, defaults, hostStrings, streamActions, tableNames } from './syntax.js';

// These macros run at assembly time rather than during execution. Each
// returns the value its label binds to. All but EQU also claim memory.
const ASSEMBLY_MACROS = [ 'ARRAY', 'BUFFER', 'DESCR', 'EQU', 'FORMAT', 'SPEC', 'STRING' ];

// Macros that mark a location in the listing, but do not generate code or data.
const MARKER_MACROS = [ 'LHERE', 'PROC', 'TITLE' ];

export function assemble( program ) {
    const vm = new VM();

    Object.assign( vm.symbols, constants, defaults );
    for ( const name in hostStrings ) {
        vm.define( name, hostStrings[ name ] );
    }

    const dataStart = vm.memPtr,
          instructions = bindLabelsAndClaimMemory( vm, program ),
          dataEnd = vm.memPtr;

    runStorageMacros( vm, program, dataStart, dataEnd );

    return {
        symbols: { ...vm.symbols },
        memory: vm.mem.slice( 0, dataEnd ),
        // Resolve instruction operands now, with every label bound.
        instructions: instructions.map( stmt => [
            stmt.label,
            stmt.macro,
            stmt.operands.map( o => resolveOperand( vm, o ) )
        ] ),
    };
}

// Decide where every label points.
function bindLabelsAndClaimMemory( vm, program ) {
    const instructions = [];

    for ( let i = 0; i < program.length; i++ ) {
        const stmt = program[ i ];
        let location;
        if ( ASSEMBLY_MACROS.includes( stmt.macro ) ) {
            // Assembly-time macros decide the label value.
            // Storage macros also claim memory.
            location = runAssemblyMacro( vm, stmt );
        } else if ( MARKER_MACROS.includes( stmt.macro ) ) {
            // Markers alias the next memory or instruction slot.
            location = getMarkerMacroLocation( program, i, vm, instructions );
        } else {
            // Executable labels point into the instruction array.
            location = instructions.length;
            instructions.push( stmt );
        }
        if ( stmt.label ) vm.define( stmt.label, location );
    }

    return instructions;
}

// Forward-label references throw ReferenceError. Substitute zero so pass 1
// can claim memory. Pass 2 rewrites the data.
function runAssemblyMacro( vm, stmt ) {
    const args = stmt.operands.map( operand => {
        try {
            return resolveOperand( vm, operand );
        } catch ( e ) {
            if ( e instanceof ReferenceError ) return 0;
            throw e;
        }
    } );
    return sil[ stmt.macro ].apply( vm, args );
}

// Rewind to the data segment and re-run the assembly-time macros with every
// symbol bound. Storage macros write into the cells they claimed in pass 1.
function runStorageMacros( vm, program, dataStart, dataEnd ) {
    vm.memPtr = dataStart;
    for ( const stmt of program ) {
        if ( ASSEMBLY_MACROS.includes( stmt.macro ) ) {
            const args = stmt.operands.map( o => resolveOperand( vm, o ) );
            sil[ stmt.macro ].apply( vm, args );
        }
    }
    if ( vm.memPtr !== dataEnd ) {
        throw new Error( 'Data replay changed assembled storage size' );
    }
}

// A marker label belongs to the next statement that actually occupies
// memory or an instruction slot. Consecutive markers all name that same spot.
function getMarkerMacroLocation( program, i, vm, instructions ) {
    for ( let j = i + 1; j < program.length; j++ ) {
        const macro = program[ j ].macro;
        if ( !MARKER_MACROS.includes( macro ) ) {
            return ASSEMBLY_MACROS.includes( macro )
                ? vm.memPtr
                : instructions.length;
        }
    }
    throw new Error( 'Marker has no following anchor' );
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
        default:       throw new Error( `Unknown operand type: ${ op.type }` );
    }
}

// Syntax-table and stream-action names are literal tokens, not symbols.
function resolveName( vm, name ) {
    if ( tableNames.includes( name ) || streamActions.includes( name ) ) {
        return name;
    }
    return vm.$( name );
}
