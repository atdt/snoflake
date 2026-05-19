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
const isNonBlank = ( ch ) => ch !== undefined && ch !== ' ' && ch !== '\t';

export function parse( input ) {
    const statements = [];
    const lines = input.split( /\r?\n/ );

    for ( const [ index, line ] of lines.entries() ) {
        if ( !line || line.startsWith( '*' ) ) {
            continue;
        }

        if ( /^\s+END\s*$/.test( line ) ) {
            return statements;
        }

        statements.push( parseStatement( line, index + 1 ) );
    }

    throw new Error( 'Missing SIL END directive' );
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

    const at = () => source[offset];
    const fail = ( message ) => {
        throw new Error( `${message} on SIL line ${lineNumber}` );
    };

    function operandList() {
        const operands = [ variable() ];
        while ( at() === ',' && isNonBlank( source[ offset + 1 ] ) ) {
            offset++;
            operands.push( variable() );
        }
        return operands;
    }

    function variable() {
        switch ( at() ) {
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
        offset++;  // consume '('
        const items = [];

        if ( at() !== ')' ) {
            items.push( variable() );
            while ( at() === ',' ) {
                offset++;
                items.push( variable() );
            }
        }

        if ( at() !== ')' ) {
            fail( 'Expected )' );
        }
        offset++;  // consume ')'

        return { type: 'list', items };
    }

    function literal() {
        offset++;  // skip opening quote
        const start = offset;

        while ( at() !== "'" ) {
            if ( at() === undefined ) {
                fail( 'Unterminated literal' );
            }
            offset++;
        }

        return source.slice( start, offset++ );  // and skip closing quote
    }

    function additive() {
        let left = multiplicative();

        while ( at() === '+' || at() === '-' ) {
            const type = at() === '+' ? 'add' : 'sub';
            offset++;
            left = { type, left, right: multiplicative() };
        }

        return left;
    }

    function multiplicative() {
        let left = unary();

        while ( at() === '*' ) {
            offset++;
            left = { type: 'mul', left, right: unary() };
        }

        return left;
    }

    function unary() {
        if ( at() === '+' ) {
            offset++;
            return unary();
        }
        if ( at() === '-' ) {
            offset++;
            return { type: 'negate', operand: unary() };
        }
        return primary();
    }

    function primary() {
        if ( isDigit( at() ) ) {
            return integer();
        }
        if ( isUpper( at() ) ) {
            return { type: 'symbol', name: name() };
        }
        fail( 'Expected operand' );
    }

    function integer() {
        const start = offset;
        while ( isDigit( at() ) ) {
            offset++;
        }
        return parseInt( source.slice( start, offset ), 10 );
    }

    function name() {
        const start = offset;
        while ( isNameChar( at() ) ) {
            offset++;
        }
        return source.slice( start, offset );
    }

    return operandList();
}
