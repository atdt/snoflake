"use strict";

import SNOBOL from './base.js';

// These macros belong to the memory-location counter.  Most emit storage;
// EQU does not, but it is commonly used at data boundaries for size
// expressions such as END-START.
var MEMORY_LOCATION_MACROS = [
    'ARRAY', 'BUFFER', 'DESCR',
    'EQU', 'FORMAT', 'REAL',
    'SPEC', 'STRING'
];

// These assembly markers do not occupy either address space.  A label on one
// aliases the next located statement.
var LOCATIONLESS_MACROS = [ 'LHERE', 'PROC', 'TITLE' ];
var ASSEMBLY_MACROS = MEMORY_LOCATION_MACROS.concat( LOCATIONLESS_MACROS );

function getArgs( f ) {
    return f
        .toString()
        .replace( /([\s\S]+return \[|\];[\s\S]+)/g, '' )
        .replace( /(vm\.\$\("|"\))/g, '' );
}

// SIL labels live in one textual namespace, but they do not all name the
// same kind of address.  Data labels are offsets in vm.mem; control labels
// are indexes in the translated instruction stream.  Keeping those address
// spaces separate lets LOC operands be the direct branch targets described by
// the macro comments, instead of memory cells that point at branch targets.
function nextLocatedStatement( program, index ) {
    var next = index + 1;

    while (
        next < program.length &&
        LOCATIONLESS_MACROS.includes( program[ next ][ 1 ] )
    ) {
        next++;
    }

    return next;
}

function locationAtHere( vm, program, index ) {
    var next = nextLocatedStatement( program, index ),
        macro = next < program.length && program[ next ][ 1 ];

    // LHERE is EQU *: it names the current location counter.  If the next
    // real statement belongs to assembled data, that counter is vm.mem.length;
    // otherwise it is the next executable instruction.
    return MEMORY_LOCATION_MACROS.includes( macro )
        ? vm.mem.length
        : next;
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

    var args = argsCallback.call( this ),
        returnValue;

    this.currentLabel = label;
    returnValue = SNOBOL.sil[ macro ].apply( this, args );

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
    // location argument which the caller omitted. In such cases
    // execution should fall through to the next instruction.
    //
    // Some hand-written macro helpers still branch to fixed system labels
    // by name; translated SIL operands arrive here already resolved.
    if ( typeof loc === 'string' ) {
        loc = this.resolve( loc );
    }
    if ( typeof loc === 'number' ) {
        if (loc === 6) console.log("JUMPED TO 6", new Error().stack);
        this.instructionPointer = loc;
        this.instructionPointerChanged = true;
    }
};

SNOBOL.VM.prototype.run = function ( program ) {
    var loc, stmt, label, macro;

    var sym;

    for ( sym in SNOBOL.programSymbols ) {
        this.define( sym, SNOBOL.programSymbols[sym] );
    }

    SNOBOL.tableNames.forEach( (table, idx) => this.define( table, idx ) );

    var savedDebug = SNOBOL.DEBUG;
    SNOBOL.DEBUG = false;
    var dataAssemblyPtrs = Object.create( null );

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
                dataAssemblyPtrs[ this.instructionPointer ] = this.d().ptr;
                if ( label ) {
                    this.define( label, dataAssemblyPtrs[ this.instructionPointer ] );
                }
                break;
            case 'SPEC':
                dataAssemblyPtrs[ this.instructionPointer ] = this.s().ptr;
                if ( label ) {
                    this.define( label, dataAssemblyPtrs[ this.instructionPointer ] );
                }
                break;
            case 'LHERE':
                if ( label ) {
                    this.define( label, locationAtHere( this, program, this.instructionPointer ) );
                }
                break;
            case 'PROC':
                if ( label ) {
                    this.define( label, nextLocatedStatement( program, this.instructionPointer ) );
                }
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
                    this.define( label, this.instructionPointer );
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
            label = dataAssemblyPtrs[ this.instructionPointer ];
            stmt = [ label, macro, stmt[ 2 ], stmt[ 3 ] ];
            this.exec.apply( this, stmt );
        }
    }

    this.instructionPointer = 0;
    this.instructionPointerChanged = false;
    SNOBOL.DEBUG = savedDebug;

    var startTime = Date.now();
    var steps = 0;
    var maxSteps = Number(SNOBOL.options.maxSteps || 0);
    var maxMillis = Number(SNOBOL.options.maxMillis || 0);

    while ( this.instructionPointer >= 0 && this.instructionPointer < program.length ) {
        steps++;
        if ( maxSteps && steps > maxSteps ) {
            console.error('Aborting: exceeded maxSteps (%s) at ip=%s', maxSteps, this.instructionPointer);
            this.instructionPointer = -1;
            break;
        }
        if ( maxMillis && (Date.now() - startTime) > maxMillis ) {
            console.error('Aborting: exceeded maxMillis (%sms) at ip=%s', maxMillis, this.instructionPointer);
            this.instructionPointer = -1;
            break;
        }
        loc = this.instructionPointer;
        stmt = program[ loc ];
        [ label, macro ] = stmt;
        if ( this.symbols.LOCA2 && loc === this.symbols.LOCA2 ) {
            this.instructionPointerChanged = false;
            SNOBOL.sil._fastLOCA2.call( this );
        } else if ( !ASSEMBLY_MACROS.includes( macro ) ) {
            this.instructionPointerChanged = false;
            this.exec.apply( this, stmt );
        }

        // If the procedure did not update the instruction pointer,
        // fall through to the next instruction.
        if ( !this.instructionPointerChanged && this.instructionPointer === loc ) {
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
