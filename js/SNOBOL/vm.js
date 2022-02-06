"use strict";

var SNOBOL = require( './base' ),
    assert = require( 'assert' );

var DATA_ASSEMBLY_MACROS = [
    'DESCR', 'SPEC', 'LHERE', 'PROC', 'STRING', 'FORMAT', 'BUFFER', 'ARRAY', 'EQU'
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
        if ( loc === 9999 || this.mem[loc] === 9999 ) {
            debugger;
            throw new Error('');
        }
        this.instructionPointer = this.mem[loc];
    }
};

SNOBOL.VM.prototype.run = function ( program ) {
    var args, loc, stmt, label, macro;

    var sym;
    var i;

    for ( sym in SNOBOL.programSymbols ) {
        this.define( sym, SNOBOL.programSymbols[sym] );
    }

    SNOBOL.tableNames.forEach( (table, idx) => this.define( table, idx ) );
    var locs = {};

    for (
        this.instructionPointer = 0;
        this.instructionPointer < program.length;
        this.instructionPointer++
    ) {
        stmt = program[ this.instructionPointer ];
        [ label, macro ] = stmt;
        switch ( macro ) {
            // We pre-allocate data for DESCR and SPEC instructions, but we
            // don't execute them yet, because their arguments may refer to
            // program symbols that are not yet bound.
            case 'DESCR':
                var ptr = this.d().ptr;
                locs[this.instructionPointer] = ptr;
                this.define( label, ptr );
                break;
            case 'SPEC':
                var ptr = this.s().ptr;
                locs[this.instructionPointer] = ptr;
                this.define( label, ptr );
                break;
            case 'LHERE':
            case 'PROC':
                this.define( label, this.mem.length );
                this.mem.push( this.instructionPointer + 1 );
                assert.equal( this.mem[ this.symbols[ label ] ], this.instructionPointer + 1 );
                break;
            case 'STRING':
            case 'FORMAT':
            case 'BUFFER':
            case 'ARRAY':
                this.define( label, this.mem.length );
                this.exec.apply( this, stmt );
                break;
            case 'EQU':
                this.define( label, this.exec.apply( this, stmt ) );
                break;
            default:
                if ( label ) {
                    this.define( label, this.mem.length );
                    this.mem.push( this.instructionPointer );
                    assert.equal( this.mem[ this.symbols[ label ] ], this.instructionPointer );
                }
                break;
        }
    }

    for (
        this.instructionPointer = 0;
        this.instructionPointer < program.length;
        this.instructionPointer++
    ) {
        stmt = program[ this.instructionPointer ];
        [ label, macro ] = stmt;
        if ( macro === 'DESCR' || macro === 'SPEC' ) {
            this.loc = locs[this.instructionPointer];
            assert.ok( typeof this.loc !== undefined )
            this.exec.apply( this, stmt );
        }
    }

    var saddr = this.d( 'STACK' ).addr;
    this.instructionPointer = 0;

    while ( this.instructionPointer >= 0 && this.instructionPointer < program.length ) {
        loc = this.instructionPointer;
        stmt = program[ loc ];
        [ label, macro ] = stmt;
        if ( !DATA_ASSEMBLY_MACROS.includes( macro ) ) {
            this.exec.apply( this, stmt );
        }
        if ( this.d('STACK').addr !== saddr ) {
            throw new Error('STACK clobbered! New value: ' + this.d('STACK').addr);
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
    if ( ptr === null ) {
        throw new Error();
    }
    return ptr instanceof SNOBOL.Descriptor
        ? ptr
        : new SNOBOL.Descriptor( this, ptr );
};

SNOBOL.VM.prototype.s = function ( ptr ) {
    if ( ptr === null ) {
        throw new Error();
    }
    return ptr instanceof SNOBOL.Specifier
        ? ptr
        : new SNOBOL.Specifier( this, ptr );
};
