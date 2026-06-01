// Parser for SIL (SNOBOL Implementation Language).
// SIL is the assembly-like language used for the SNOBOL4 macro implementation.
//
// Statement format:
//   XLATRD AEQLC  LISTCL,0,,XLATRN     Skip print if list is off
//   ^^^^^^ ^^^^^  ^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^^^^^^^^
//   label  macro  operands             trailing comment
//
// Syntax rules:
// - A `*` in column 1 marks a full-line comment.
// - Labels are optional.
// - Operands support empty slots, symbols, integers, quoted literals,
//   parenthesised lists, and arithmetic (+, -, *).
//
// `parse()` returns a flat array of statements: { label, macro, operands }.
// Operands are parsed into an AST (null, strings, numbers, or typed objects)
// to be resolved into concrete values later by `src/assemble.js`.

const STATEMENT =
    /^(?<label>[A-Z][A-Z0-9]*)?\s+(?<macro>[A-Z][A-Z0-9]*)\s+(?<operands>.*)$/;

const isDigit = ( ch ) => ch >= '0' && ch <= '9';
const isUpper = ( ch ) => ch >= 'A' && ch <= 'Z';
const isNameChar = ( ch ) => isUpper( ch ) || isDigit( ch );

export function parse( input ) {
    const statements = [];
    const lines = input.split( /\r?\n/ );

    for ( const [ index, line ] of lines.entries() ) {
        if ( /^\s*$/.test( line ) || line.startsWith( '*' ) ) {
            continue;
        }

        if ( /^\s+END\s*$/.test( line ) ) {
            return statements;
        }

        statements.push( parseStatement( line, index + 1 ) );
    }

    throw new Error( 'Missing SIL END directive' );
}

// Some macros accept an operand written as a single value or a parenthesized
// list (OUTPUT args, the stack push/pop macros, RCALL). We scan the listing
// for polymorphic operand positions and normalize single values to lists, and
// an omitted operand to the empty list. This way macro bodies always iterate
// an array.
export function normalizeListOperands( statements ) {
    const listPositions = findListOperandPositions( statements );
    for ( const stmt of statements ) {
        for ( const idx of listPositions[stmt.macro] ?? [] ) {
            const operand = stmt.operands[idx];
            if ( operand?.type !== 'list' ) {
                stmt.operands[idx] = {
                    type: 'list',
                    items: operand == null ? [] : [ operand ],
                };
            }
            // Drop trailing nulls. They are inert -- RCALL falls through past
            // the end of $LOCs, and operand iteration pushes nothing for a
            // null slot.
            const { items } = stmt.operands[idx];
            while ( items.length && items.at( -1 ) == null ) items.pop();
        }
    }
    return statements;
}

function findListOperandPositions( statements ) {
    const positions = {};
    for ( const stmt of statements ) {
        for ( let i = 0; i < stmt.operands.length; i++ ) {
            if ( stmt.operands[i]?.type === 'list' ) {
                ( positions[stmt.macro] ??= new Set() ).add( i );
            }
        }
    }
    return positions;
}

function parseStatement( line, lineNumber ) {
    const match = STATEMENT.exec( line );

    if ( !match ) {
        throw new Error( `Invalid SIL statement on line ${lineNumber}` );
    }

    const { label, macro, operands } = match.groups;

    return {
        label: label ?? null,
        macro,
        operands: parseOperands( operands, lineNumber ),
    };
}

// Recursive-descent scan of a comma-separated operand list.
// One function per grammar rule, ordered by precedence.
function parseOperands( source, lineNumber ) {
    let offset = 0;

    const peek = () => source[offset];

    function fail( message ) {
        throw new Error( `${message} on SIL line ${lineNumber}` );
    }

    function operandList() {
        const operands = [ operand() ];
        while ( peek() === ',' ) {
            offset++; // consume the comma
            const next = peek();
            // A blank, tab, or end-of-input here begins a trailing comment.
            if ( !next || next === ' ' || next === '\t' ) break;
            operands.push( operand() );
        }
        return operands;
    }

    function operand() {
        switch ( peek() ) {
            case undefined:
            case ',':
            case ')':
                return null;
            case '(':
                return list();
            case "'":
                return literal();
            default:
                return additive();
        }
    }

    function list() {
        offset++; // consume '('
        const items = [];

        if ( peek() !== ')' ) {
            items.push( operand() );
            while ( peek() === ',' ) {
                offset++;
                items.push( operand() );
            }
        }

        if ( peek() !== ')' ) {
            fail( 'Expected )' );
        }
        offset++; // consume ')'

        return { type: 'list', items };
    }

    function literal() {
        offset++; // skip opening quote
        const start = offset;

        while ( peek() !== "'" ) {
            if ( peek() === undefined ) {
                fail( 'Unterminated literal' );
            }
            offset++;
        }

        const value = source.slice( start, offset );
        offset++; // skip closing quote
        return value;
    }

    function additive() {
        let left = multiplicative();

        while ( peek() === '+' || peek() === '-' ) {
            const type = peek() === '+' ? 'add' : 'sub';
            offset++;
            left = { type, left, right: multiplicative() };
        }

        return left;
    }

    function multiplicative() {
        let left = unary();

        while ( peek() === '*' ) {
            offset++;
            left = { type: 'mul', left, right: unary() };
        }

        return left;
    }

    function unary() {
        if ( peek() === '+' ) {
            offset++;
            return unary();
        }
        if ( peek() === '-' ) {
            offset++;
            return { type: 'negate', operand: unary() };
        }
        return primary();
    }

    function primary() {
        if ( isDigit( peek() ) ) {
            return number();
        }
        if ( isUpper( peek() ) ) {
            return { type: 'symbol', name: name() };
        }
        fail( `Expected operand, got "${peek() ?? 'end'}"` );
    }

    function number() {
        const start = offset;
        while ( isDigit( peek() ) ) {
            offset++;
        }
        // A decimal point followed by a digit makes a REAL literal.
        if ( peek() === '.' && isDigit( source[offset + 1] ) ) {
            offset++;
            while ( isDigit( peek() ) ) {
                offset++;
            }
            return parseFloat( source.slice( start, offset ) );
        }
        return parseInt( source.slice( start, offset ), 10 );
    }

    function name() {
        const start = offset;
        while ( isNameChar( peek() ) ) {
            offset++;
        }
        return source.slice( start, offset );
    }

    return operandList();
}
