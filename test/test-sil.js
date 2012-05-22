/*jslint node: true, white: true, sloppy: true, forin: true */
/*global assert, mem, refute, alloc, resolve, assign, defineValues, Descriptor, Specifier, gets, puts, getd, getspc, symbols, reset, str, setUint, getUint, setInt, getInt, setReal, getReal, run, exec, ip, jmp */

var buster = require( 'buster' );

buster.extend( global, require( '../lib/snoflake' ) );


// 
// Scaffolds
//

function mkargs() {
    // Construct a deferred operands object
    var args = [].slice.call( arguments );
    return function () {
        return args.map( resolve );
    };
}


//
// Test Cases
//

buster.testCase( 'Assembly Control Macros', {
    COPY: function () {
        assert( sil.COPY );
    },
    END: function () {
        assert( sil.END );
    },
    EQU: function () {
        assert( sil.EQU );
    },
    LHERE: function () {
        assert( sil.LHERE );
    },
    TITLE: function () {
        assert( sil.TITLE );
    }
} );

buster.testCase( 'Macros that Assemble Data', {
    ARRAY: function () {
        assert( sil.ARRAY );
    },
    BUFFER: function () {
        assert( sil.BUFFER );
    },
    DESCR: function () {
        assert( sil.DESCR );
    },
    FORMAT: function () {
        assert( sil.FORMAT );
    },
    SPEC: function () {
        assert( sil.SPEC );
    },
    STRING: function () {
        assert( sil.STRING );
    }
} );


buster.testCase( 'Branch Macros', {
    BRANCH: function () {
        assert( sil.BRANCH );
    },
    BRANIC: function () {
        assert( sil.BRANIC );
    },
    SELBRA: function () {
        assert( sil.SELBRA );
    }
} );


buster.testCase( 'Comparison Macros', {
    ACOMP: function () {
        assert( sil.ACOMP ); 
    },
    ACOMPC: function () {
        assert( sil.ACOMPC ); 
    },
    AEQL: function () {
        assert( sil.AEQL ); 
    },
    AEQLC: function () {
        assert( sil.AEQLC ); 
    },
    AEQLIC: function () {
        assert( sil.AEQLIC ); 
    },
    CHKVAL: function () {
        assert( sil.CHKVAL ); 
    },
    DEQL: function () {
        assert( sil.DEQL ); 
    },
    LCOMP: function () {
        assert( sil.LCOMP ); 
    },
    LEQLC: function () {
        assert( sil.LEQLC ); 
    },
    LEXCMP: function () {
        assert( sil.LEXCMP ); 
    },
    RCOMP: function () {
        assert( sil.RCOMP ); 
    },
    TESTF: function () {
        assert( sil.TESTF ); 
    },
    TESTFI: function () {
        assert( sil.TESTFI ); 
    },
    VCMPIC: function () {
        assert( sil.VCMPIC ); 
    },
    VEQL: function () {
        assert( sil.VEQL ); 
    },
    VEQLC: function () {
        assert( sil.VEQLC ); 
    }
} );


buster.testCase( 'Macros that Relate to Recursive Procedures and Stack Management', {
    ISTACK: function () {
        assert( sil.ISTACK ); 
    },
    POP: function () {
        assert( sil.POP ); 
    },
    PROC: function () {
        assert( sil.PROC ); 
    },
    PSTACK: function () {
        assert( sil.PSTACK ); 
    },
    PUSH: function () {
        assert( sil.PUSH ); 
    },
    RCALL: function () {
        assert( sil.RCALL ); 
    },
    RRTURN: function () {
        assert( sil.RRTURN ); 
    },
    SPOP: function () {
        assert( sil.SPOP ); 
    },
    SPUSH: function () {
        assert( sil.SPUSH );
    }
} );


buster.testCase( 'Macros that Move and Set Descriptors', {
    GETD: function () {
        assert( sil.GETD ); 
    },
    GETDC: function () {
        assert( sil.GETDC ); 
    },
    MOVBLK: function () {
        assert( sil.MOVBLK ); 
    },
    MOVD: function () {
        assert( sil.MOVD ); 
    },
    MOVDIC: function () {
        assert( sil.MOVDIC ); 
    },
    POP: function () {
        assert( sil.POP ); 
    },
    PUSH: function () {
        assert( sil.PUSH ); 
    },
    PUTD: function () {
        assert( sil.PUTD ); 
    },
    PUTDC: function () {
        assert( sil.PUTDC ); 
    },
    ZERBLK: function () {
        assert( sil.ZERBLK ); }
} );


buster.testCase( 'Macros that Modify Address Fields of Descriptors', {
    ADJUST: function () {
        assert( sil.ADJUST ); 
    },
    BKSIZE: function () {
        assert( sil.BKSIZE ); 
    },
    DECRA: function () {
        assert( sil.DECRA ); 
    },
    GETAC: function () {
        assert( sil.GETAC ); 
    },
    GETLG: function () {
        assert( sil.GETLG ); 
    },
    GETLTH: function () {
        assert( sil.GETLTH ); 
    },
    GETSIZ: function () {
        assert( sil.GETSIZ ); 
    },
    INCRA: function () {
        assert( sil.INCRA ); 
    },
    MOVA: function () {
        assert( sil.MOVA ); 
    },
    PUTAC: function () {
        assert( sil.PUTAC ); 
    },
    SETAC: function () {
        assert( sil.SETAC ); 
    },
    SETAV: function () {
        assert( sil.SETAV ); 
    }
} );


buster.testCase( 'Macros that Modify Value Fields of Descriptors', {
    INCRV: function () {
        assert( sil.INCRV ); 
    },
    MOVV: function () {
        assert( sil.MOVV ); 
    },
    PUTVC: function () {
        assert( sil.PUTVC ); 
    },
    SETSIZ: function () {
        assert( sil.SETSIZ ); 
    },
    SETVA: function () {
        assert( sil.SETVA ); 
    },
    SETVC: function () {
        assert( sil.SETVC ); 
    }
} );


buster.testCase( 'Macros that Modify Flag Fields of Descriptors', {
    RESETF: function () {
        assert( sil.RESETF ); 
    },
    RSETFI: function () {
        assert( sil.RSETFI ); 
    },
    SETF: function () {
        assert( sil.SETF ); 
    },
    SETFI: function () {
        assert( sil.SETFI ); 
    }
} );


buster.testCase( 'Macros that Perform Integer Arithmetic on Address Fields', {
    DECRA: function () {
        assert( sil.DECRA ); 
    },
    DIVIDE: function () {
        assert( sil.DIVIDE ); 
    },
    EXPINT: function () {
        assert( sil.EXPINT ); 
    },
    INCRA: function () {
        assert( sil.INCRA ); 
    },
    MNSINT: function () {
        assert( sil.MNSINT ); 
    },
    MULT: function () {
        assert( sil.MULT ); 
    },
    MULTC: function () {
        assert( sil.MULTC ); 
    },
    SUBTRT: function () {
        assert( sil.SUBTRT ); 
    },
    SUM: function () {
        assert( sil.SUM ); 
    }
} );


buster.testCase( 'Macros that Deal with Real Numbers', {
    ADREAL: function () {
        assert( sil.ADREAL ); 
    },
    DVREAL: function () {
        assert( sil.DVREAL ); 
    },
    EXREAL: function () {
        assert( sil.EXREAL ); 
    },
    INTRL: function () {
        assert( sil.INTRL ); 
    },
    MNREAL: function () {
        assert( sil.MNREAL ); 
    },
    MPREAL: function () {
        assert( sil.MPREAL ); 
    },
    RCOMP: function () {
        assert( sil.RCOMP ); 
    },
    REALST: function () {
        assert( sil.REALST ); 
    },
    RLINT: function () {
        assert( sil.RLINT ); 
    },
    SBREAL: function () {
        assert( sil.SBREAL ); 
    },
    SPREAL: function () {
        assert( sil.SPREAL ); 
    }
} );

buster.testCase( 'Macros that Move Specifiers', {
    GETSPC: function () {
        assert( sil.GETSPC ); 
    },
    PUTSPC: function () {
        assert( sil.PUTSPC ); 
    },
    SETSP: function () {
        assert( sil.SETSP ); 
    },
    SPOP: function () {
        assert( sil.SPOP ); 
    },
    SPUSH: function () {
        assert( sil.SPUSH ); 
    }
} );


buster.testCase( 'Macros that Operate on Specifiers', {
    ADDLG: function () {
        assert( sil.ADDLG ); 
    },
    APDSP: function () {
        assert( sil.APDSP ); 
    },
    FSHRTN: function () {
        assert( sil.FSHRTN ); 
    },
    GETBAL: function () {
        assert( sil.GETBAL ); 
    },
    INTSPC: function () {
        assert( sil.INTSPC ); 
    },
    LOCSP: function () {
        assert( sil.LOCSP ); 
    },
    PUTLG: function () {
        assert( sil.PUTLG ); 
    },
    REMSP: function () {
        assert( sil.REMSP ); 
    },
    SETLC: function () {
        assert( sil.SETLC ); 
    },
    SHORTN: function () {
        assert( sil.SHORTN ); 
    },
    STREAM: function () {
        assert( sil.STREAM ); 
    },
    SUBSP: function () {
        assert( sil.SUBSP ); 
    },
    TRIMSP: function () {
        assert( sil.TRIMSP ); 
    }
} );


buster.testCase( 'Macros that Operate on Syntax Tables', {
    CLERTB: function () {
        assert( sil.CLERTB );
    },
    PLUGTB: function () {
        assert( sil.PLUGTB );
    }
} );


buster.testCase( 'Macros that Construct Pattern Nodes', {
    CPYPAT: function () {
        assert( sil.CPYPAT ); 
    },
    MAKNOD: function () {
        assert( sil.MAKNOD ); 
    }
} );

buster.testCase( 'Macros that Operate on Tree Nodes', {
    ADDSIB: function () {
        assert( sil.ADDSIB ); 
    },
    ADDSON: function () {
        assert( sil.ADDSON ); 
    },
    INSERT: function () {
        assert( sil.INSERT ); 
    }
} );


buster.testCase( 'Input and Output Macros', {
    BKSPCE: function () {
        assert( sil.BKSPCE ); 
    },
    ENFILE: function () {
        assert( sil.ENFILE ); 
    },
    FORMAT: function () {
        assert( sil.FORMAT ); 
    },
    OUTPUT: function () {
        assert( sil.OUTPUT ); 
    },
    REWIND: function () {
        assert( sil.REWIND ); 
    },
    STPRNT: function () {
        assert( sil.STPRNT ); 
    },
    STREAD: function () {
        assert( sil.STREAD ); 
    }
} );


buster.testCase( 'Macros that Depend on Operating System Facilities', {
    DATE: function () {
        assert( sil.DATE ); 
    },
    ENDEX: function () {
        assert( sil.ENDEX ); 
    },
    INIT: function () {
        assert( sil.INIT ); 
    },
    LINK: function () {
        assert( sil.LINK ); 
    },
    LOAD: function () {
        assert( sil.LOAD ); 
    },
    MSTIME: function () {
        assert( sil.MSTIME ); 
    },
    UNLOAD: function () {
        assert( sil.UNLOAD ); 
    }
} );


buster.testCase( 'Miscellaneous Macros', {
    LINKOR: function () {
        assert( sil.LINKOR ); 
    },
    LOCAPT: function () {
        assert( sil.LOCAPT ); 
    },
    LOCAPV: function () {
        assert( sil.LOCAPV ); 
    },
    LVALUE: function () {
        assert( sil.LVALUE ); 
    },
    ORDVST: function () {
        assert( sil.ORDVST ); 
    },
    RPLACE: function () {
        assert( sil.RPLACE ); 
    },
    SPCINT: function () {
        assert( sil.SPCINT ); 
    },
    TOP: function () {
        assert( sil.TOP ); 
    },
    VARID: function () {
        assert( sil.VARID ); 
    }
} );
