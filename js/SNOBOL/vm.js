"use strict";

var SNOBOL = require( './base' ),
    assert = require( 'assert' );

var DATA_ASSEMBLY_MACROS = [
    'ARRAY', 'BUFFER', 'DESCR',
    'EQU', 'FORMAT', 'LHERE',
    'REAL',  'SPEC',  'STRING', 'PROC'
];

function getArgs( f ) {
    return f
        .toString()
        .replace( /([\s\S]+return \[|\];[\s\S]+)/g, '' )
        .replace( /(vm\.\$\("|"\))/g, '' );
}

SNOBOL.D = 3;

SNOBOL.VM.prototype.exec = function ( label, macro, argsCallback, comment ) {

    if ( SNOBOL.DEBUG ) {
        if ( comment ) {
            comment = '// ' + comment;
        } else {
            comment = '';
        }
        var code = ( macro + '(' + getArgs( argsCallback ) + ')' ).padEnd( 70, ' ' );
        console.log( '[%s] [%s] %s %s',
            SNOBOL.str.pad( '' + this.instructionPointer, 4 ),
            SNOBOL.str.pad( label || '', 6 ),
            code,
            comment
        );
    }

    var currentInstruction = this.instructionPointer,
        args = argsCallback.call( this ),
        returnValue;

    this.currentLabel = label;
    if ( macro === 'DESCR' || macro === 'SPEC' ) {
        // Because some DESCR and SPEC are recursively defined, we have to
        // treat them specially and provide them with their label.
        // args.unshift( label );
    }
    returnValue = SNOBOL.sil[ macro ].apply( this, args );

    // XXX: Added to fix SNOBOL.options.watch undefined issue below
    if ( !SNOBOL.options ) {
        SNOBOL.options = [];
    }

    ( SNOBOL.options.watch || [] ).forEach( function ( variable ) {
        var value = this.symbols.hasOwnProperty ( variable ) ? this.symbols[ variable ] : 'UNDEF';
        console.log(
            '→ %s: %s',
            SNOBOL.str.pad( variable, 6, 'left' ),
            value
        );
    }, this );

    if ( typeof returnValue === 'boolean' ) {
        process.exit( returnValue );
    }

    return returnValue;
};


SNOBOL.VM.prototype.jmp = function ( loc ) {
    // `loc` will be undefined when a procedure takes an optional
    // location argument which the caller ommitted. In such cases
    // execution should fall through to the next instruction.
    if ( typeof loc === 'number' ) {
        this.instructionPointer = this.mem[loc];
    }
};

SNOBOL.VM.prototype.run = function ( program ) {
    var args, status, loc, stmt, label;

    var sym;
    var i;

    for ( sym in SNOBOL.programSymbols ) {
        this.define( sym, SNOBOL.programSymbols[sym] );
    }

    var that = this;
    SNOBOL.tableNames.forEach( function ( table, idx ) {
        that.define( table, idx );
    } );

    for (
        this.instructionPointer = 0;
        this.instructionPointer < program.length;
        this.instructionPointer++
    ) {
        stmt = program[ this.instructionPointer ];
        if ( stmt[ 1 ] === 'DESCR' ) {
            this.define( stmt[0], this.d().ptr );
        } else if ( stmt[ 1 ] === 'SPEC' ) {
            this.define( stmt[0], this.s().ptr );
        } else if ( stmt[ 1 ] === 'LHERE' || stmt[ 1 ] === 'PROC' ) {
            // XXX: Program locations are set indirectly, to be resolved by
            // this.jmp. This is probably incorrect, because the program might
            // also jump to program locations of normal (but labelled)
            // instructions, i.e. instructions that aren't LHERE or PROC.
            // But if we set location directly (i.e., just define the label to
            // be the current instruction pointer + 1) then some LHEREs which
            // aren't used as goto points but instead as markers of ends of
            // blocks end up being incorrect. Ugh.
            this.define( stmt[0], this.mem.length );
            this.mem.push( this.instructionPointer + 1 );
            assert.equal( this.mem[this.symbols[stmt[0]]], this.instructionPointer + 1 );
        } else if ( stmt[ 1 ] === 'STRING' || stmt[ 1 ] === 'FORMAT' || stmt[ 1 ] === 'BUFFER' || stmt[ 1 ] === 'ARRAY' ) {
            this.define( stmt[0], this.mem.length );
            this.exec.apply( this, stmt );
        } else if ( stmt[ 1 ] === 'EQU' ) {
            this.define( stmt[0], this.exec.apply( this, stmt ) );
        } else {
            this.define( stmt[0], this.mem.length );
            this.mem.push( this.instructionPointer );
            assert.equal( this.mem[this.symbols[stmt[0]]], this.instructionPointer );
        }
    }
    for (
        this.instructionPointer = 0;
        this.instructionPointer < program.length;
        this.instructionPointer++
    ) {
        stmt = program[ this.instructionPointer ];
        if ( !stmt[ 0 ] ) {
            continue;
        }
        if ( stmt[ 1 ] === 'DESCR' || stmt[ 1 ] === 'SPEC' ) {
            this.exec.apply( this, stmt );
        }
    }

    this.instructionPointer = 0;

    while ( this.instructionPointer >= 0 && this.instructionPointer < program.length ) {
        loc = this.instructionPointer;
        args = program[ loc ];
        if ( DATA_ASSEMBLY_MACROS.indexOf( args[ 1 ] ) === -1 ) {
            status = this.exec.apply( this, args );
        }

        // If the procedure did not update the instruction pointer,
        // fall through to the next instruction.
        if ( this.instructionPointer === loc ) {
            this.instructionPointer++;
        }
    }

    return !( this.instructionPointer < 0 );
};

SNOBOL.VM.prototype.d = function ( ptr ) {
    return ptr instanceof SNOBOL.Descriptor
        ? ptr
        : new SNOBOL.Descriptor( this, ptr );
};

SNOBOL.VM.prototype.s = function ( ptr ) {
    return ptr instanceof SNOBOL.Specifier
        ? ptr
        : new SNOBOL.Specifier( this, ptr );
};
