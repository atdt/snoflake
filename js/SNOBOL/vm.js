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
    var __prevC = this.CSTACK.addr, __prevO = this.OSTACK.addr;
    returnValue = SNOBOL.sil[ macro ].apply( this, args );
    if ( SNOBOL.DEBUG && (this.CSTACK.addr !== __prevC || this.OSTACK.addr !== __prevO) ) {
        console.log('DBG STACK CHG after %s: CSTACK=%s OSTACK=%s', macro, this.CSTACK.addr, this.OSTACK.addr);
    }

    // XXX: Added to fix SNOBOL.options.watch undefined issue below
    if ( !SNOBOL.options ) {
        SNOBOL.options = [];
    }

    ( SNOBOL.options.watch || [] ).forEach( function ( variable ) {
        var value;

        if ( variable === 'CSTACK' || variable === 'OSTACK' ) {
            value = this[ variable ].addr;
        } else {
            value = this.symbols.hasOwnProperty( variable ) ? this.symbols[ variable ] : 'UNDEF';
        }
        console.log(
            '→ %s: %s',
            SNOBOL.str.pad( variable, 6, 'left' ),
            value
        );
    }, this );

    if ( typeof returnValue === 'boolean' ) {
        // Normalize boolean to exit code and do not terminate the process abruptly
        process.exitCode = returnValue ? 0 : 1;
        return returnValue;
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
    var args, status, loc, stmt, label, macro;

    var sym;
    var i;

    for ( sym in SNOBOL.programSymbols ) {
        this.define( sym, SNOBOL.programSymbols[sym] );
    }

    SNOBOL.tableNames.forEach( (table, idx) => this.define( table, idx ) );

    var __savedDebug = SNOBOL.DEBUG;
    SNOBOL.DEBUG = false;
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
                this.define( label, this.d().ptr );
                break;
            case 'SPEC':
                this.define( label, this.s().ptr );
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
            this.exec.apply( this, stmt );
        }
    }

    this.instructionPointer = 0;
    if ( SNOBOL.DEBUG ) {
        try {
            var __interpSym = this.symbols['INTERP'];
            console.log('DBG PROC INTERP sym=%s mem[sym]=%s', __interpSym, typeof __interpSym === 'number' ? this.mem[ __interpSym ] : '(undef)');
        } catch (e) {}
    }
    SNOBOL.DEBUG = __savedDebug;

    var __startTime = Date.now();
    var __steps = 0;
    var __maxSteps = Number(SNOBOL.options.maxSteps || 0);
    var __maxMillis = Number(SNOBOL.options.maxMillis || 0);

    while ( this.instructionPointer >= 0 && this.instructionPointer < program.length ) {
        __steps++;
        if ( __maxSteps && __steps > __maxSteps ) {
            console.error('Aborting: exceeded maxSteps (%s) at ip=%s', __maxSteps, this.instructionPointer);
            this.instructionPointer = -1;
            break;
        }
        if ( __maxMillis && (Date.now() - __startTime) > __maxMillis ) {
            console.error('Aborting: exceeded maxMillis (%sms) at ip=%s', __maxMillis, this.instructionPointer);
            this.instructionPointer = -1;
            break;
        }
        loc = this.instructionPointer;
        stmt = program[ loc ];
        [ label, macro ] = stmt;
        if ( !DATA_ASSEMBLY_MACROS.includes( macro ) ) {
            status = this.exec.apply( this, stmt );
        }

        // If the procedure did not update the instruction pointer,
        // fall through to the next instruction.
        if ( this.instructionPointer === loc ) {
            this.instructionPointer++;
        }
    }

    return !( this.instructionPointer < 0 );
};

function RegDescriptor(vm, name) {
    var isC = name === 'CSTACK';
    var target = isC ? vm.CSTACK : vm.OSTACK;
    return {
        name: name,
        width: 3,
        get addr() { return target.addr; },
        set addr(v) { target.addr = v; },
        get flags() { return 0; },
        set flags(v) { /* ignore */ },
        get value() { return 0; },
        set value(v) { /* ignore */ },
        toString: function () { return '<' + name + ' A=' + target.addr + '>' }
    };
}

SNOBOL.VM.prototype.d = function ( ptr ) {
    if ( ptr instanceof SNOBOL.Descriptor ) {
        return ptr;
    }
    if ( typeof ptr === 'string' && ( ptr === 'CSTACK' || ptr === 'OSTACK' ) ) {
        return RegDescriptor(this, ptr);
    }
    return new SNOBOL.Descriptor( this, ptr );
};

SNOBOL.VM.prototype.s = function ( ptr ) {
    return ptr instanceof SNOBOL.Specifier
        ? ptr
        : new SNOBOL.Specifier( this, ptr );
};
