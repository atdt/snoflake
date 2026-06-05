// Map every runtime instruction slot of an assembled image back to its SIL
// source statement. image.instructions[i] is the i-th executable statement of
// the SIL listing, in source order, skipping the assembly-time and marker
// macros that occupy no slot.

// Macro classification, mirrored from src/assemble.js. These never occupy a
// runtime instruction slot, so they are skipped when numbering slots. The
// slot-count check in buildSourceMap catches drift between the two copies.
const ASSEMBLY_MACROS = [
    'ARRAY',
    'BUFFER',
    'DESCR',
    'EQU',
    'FORMAT',
    'REAL',
    'SPEC',
    'STRING',
];
const MARKER_MACROS = [ 'LHERE', 'PROC', 'TITLE' ];

const STATEMENT =
    /^(?<label>[A-Z][A-Z0-9]*)?\s+(?<macro>[A-Z][A-Z0-9]*)\s+(?<operands>.*)$/;

// Split a SIL operand field from its trailing comment. Operands never contain
// an unquoted space, so the comment begins at the first whitespace found
// outside a quoted literal.
function extractComment( operands ) {
    let inQuote = false;
    for ( let i = 0; i < operands.length; i++ ) {
        const c = operands[i];
        if ( c === "'" ) {
            inQuote = !inQuote;
        } else if ( !inQuote && ( c === ' ' || c === '\t' ) ) {
            return operands.slice( i ).trim();
        }
    }
    return '';
}

// Walk the SIL text once and return one entry per instruction slot, in
// image.instructions order: { line, text, label, macro, comment, region }.
// The slot count must match image.instructions.length exactly. A mismatch
// means this walk no longer agrees with what src/assemble.js assembles.
//
// Each slot records its enclosing region, { kind, name, line, comment } or
// null before the first marker. The region is the nearest preceding PROC, or,
// when a TITLE section opens code that no PROC heads, the section itself.
// TITLE acts as a region boundary so a procedure cannot absorb the
// non-procedure code that follows it. Without this, TRIM (the file's last
// PROC) would swallow the entire Common Code / Termination tail.
export function buildSourceMap( silText, image ) {
    const lines = silText.split( /\r?\n/ ),
        slots = [];
    let region = null;

    for ( let i = 0; i < lines.length; i++ ) {
        const line = lines[i];
        if ( /^\s*$/.test( line ) || line.startsWith( '*' ) ) continue;
        if ( /^\s+END\s*$/.test( line ) ) break;

        const m = STATEMENT.exec( line );
        if ( !m ) {
            throw new Error(
                `Unparsable SIL statement at line ${i + 1}: ${line}`,
            );
        }
        const { label, macro, operands } = m.groups;

        if ( macro === 'PROC' ) {
            region = {
                kind: 'proc',
                name: label,
                line: i + 1,
                comment: extractComment( operands ),
            };
            continue;
        }
        if ( macro === 'TITLE' ) {
            // The operand is the quoted section name. Strip the quotes.
            const name = operands.replace( /^\s*'|'.*$/g, '' ).trim();
            region = { kind: 'section', name, line: i + 1, comment: '' };
            continue;
        }
        if (
            ASSEMBLY_MACROS.includes( macro ) || MARKER_MACROS.includes( macro )
        ) {
            continue;
        }

        slots.push( {
            line: i + 1,
            text: line.replace( /\s+$/, '' ),
            label: label ?? null,
            macro,
            comment: extractComment( operands ),
            region,
        } );
    }

    if ( slots.length !== image.instructions.length ) {
        throw new Error(
            `Source map has ${slots.length} slots but the image has ` +
                `${image.instructions.length} instructions; the SIL ` +
                `classification has drifted from src/assemble.js.`,
        );
    }
    return slots;
}
