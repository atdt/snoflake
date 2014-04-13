/*jslint node: true, white: true, sloppy: true, forin: true */
/*global assert, mem, refute, alloc, resolve, assign, defineValues, Descriptor, Specifier, gets, puts, getd, getspc, symbols, reset, str, setUint, getUint, setInt, getInt, setReal, getReal, run, exec, ip, jmp */

var buster = require( 'buster' ),
    assert = buster.assert,
    slice = Array.prototype.slice,
    Snoflake = require( '../lib/snoflake' );

Snoflake.extend( global, Snoflake );

// 
// Scaffolds
//

function mkargs() {
    // Construct a deferred operands object
    var args = [].slice.call( arguments );
    return function () { // stub
        return args.map( resolve );
    };
}


//
// Test Cases
//

buster.testCase( 'Assembly Control Macros', {
    setUp: reset,
    COPY: function () { // stub
        assert( sil.COPY );
    },
    END: function () { // stub
        assert( sil.END );
    },
    EQU: function () {
        assert( sil.EQU );
        run( [ [ 'A', sil.EQU, mkargs(12) ] ] );
        assert.equals( resolve('A'), 12 );
    },
    LHERE: function () {
        assert( sil.LHERE );
        run( [
            [ 'A', sil.LHERE, mkargs() ],
            [ 'B', sil.LHERE, mkargs() ]
        ] );
        assert.equals( resolve('A'), 0 );
        assert.equals( resolve('B'), 1 );
    },
    TITLE: function () { // stub
        assert( sil.TITLE );
    }
} );

buster.testCase( 'Macros that Assemble Data', {
    setUp: reset,
    ARRAY: function () { // stub
        assert( sil.ARRAY );
    },
    BUFFER: function () {
        var ptr = sil.BUFFER( 4 );
        assert.equals( getspc( ptr ).specified, '    ' );
    },
    DESCR: function () { // stub
        assert( sil.DESCR );
    },
    FORMAT: function () { // stub
        assert( sil.FORMAT );
    },
    SPEC: function () { // stub
        assert( sil.SPEC );
    },
    STRING: function () {
        var ptr = sil.STRING( 'Bananaphone' );
        assert.equals( getspc( ptr ).specified, 'Bananaphone' );
    }
} );


buster.testCase( 'Branch Macros', {
    setUp: reset,
    BRANCH: function () {
        assert( sil.BRANCH );
        run( [
            [ null, sil.BRANCH, mkargs( 'A' ) ],
            [ 'A', sil.LHERE, mkargs() ],
            [ 'X', sil.EQU, mkargs(22)  ],
            [ null, sil.BRANCH, mkargs(5) ],
            [ 'X', sil.EQU, mkargs(33) ],
            [ null, sil.END, mkargs() ]
        ] );
        assert.equals( resolve('X'), 22 );
    },
    BRANIC: function () { // stub
        assert( sil.BRANIC );
    },
    SELBRA: function () { // stub
        assert( sil.SELBRA );
    }
} );


buster.testCase( 'Comparison Macros', {
    setUp: reset,
    ACOMP: function () {
        var a = getd(), b = getd();
        a.addr = 123;
        b.addr = 456;
        run( [
            [ null,  sil.ACOMP,   mkargs( a.ptr, b.ptr ) ],
            [ 'EQ',  sil.LHERE,   mkargs() ],
            [ 'A',   sil.EQU,     mkargs( 111 ) ],
            [ null,  sil.BRANCH,  mkargs( 6 ) ],
            [ 'NE',  sil.LHERE,   mkargs() ],
            [ 'A',   sil.EQU,     mkargs( 222 ) ],
            [ null,  sil.END,     mkargs() ]
        ] );
        assert.equals( resolve('A'), 111 );
    },
    ACOMPC: function () { // stub
        assert( sil.ACOMPC ); 
    },
    AEQL: function () { // stub
        assert( sil.AEQL ); 
    },
    AEQLC: function () { // stub
        assert( sil.AEQLC ); 
    },
    AEQLIC: function () { // stub
        assert( sil.AEQLIC ); 
    },
    CHKVAL: function () { // stub
        assert( sil.CHKVAL ); 
    },
    DEQL: function () { // stub
        assert( sil.DEQL ); 
    },
    LCOMP: function () { // stub
        assert( sil.LCOMP ); 
    },
    LEQLC: function () { // stub
        assert( sil.LEQLC ); 
    },
    LEXCMP: function () {
        var SPEC1 = new Specifier(),
            SPEC2 = new Specifier(),
            GTLOC = 1,
            EQLOC = 2,
            LTLOC = 3;

        SPEC1.specified = 'abd';
        SPEC2.specified = 'abc';
        sil.LEXCMP( SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equals( ip + 1, GTLOC );

        SPEC1.specified = 'abc';
        SPEC2.specified = 'abc';
        sil.LEXCMP( SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equals( ip + 1, EQLOC );

        SPEC1.specified = 'abc';
        SPEC2.specified = 'abd';
        sil.LEXCMP( SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equals( ip + 1, LTLOC );
    },
    RCOMP: function () { // stub
        assert( sil.RCOMP ); 
    },
    TESTF: function () { // stub
        assert( sil.TESTF ); 
    },
    TESTFI: function () { // stub
        assert( sil.TESTFI ); 
    },
    VCMPIC: function () { // stub
        assert( sil.VCMPIC ); 
    },
    VEQL: function () { // stub
        assert( sil.VEQL ); 
    },
    VEQLC: function () { // stub
        assert( sil.VEQLC ); 
    }
} );


buster.testCase( 'Macros that Relate to Recursive Procedures and Stack Management', {
    setUp: reset,
    ISTACK: function () { // stub
        assert( sil.ISTACK ); 
    },
    POP: function () {
        var d1 = new Descriptor(),
            d2 = new Descriptor(),
            d3 = new Descriptor(),
            d4 = new Descriptor();
        d1.update( 2, 4, 6 );
        d2.update( 3, 5, 7 );
        assert.equals( stack.ptr, 0 );
        sil.PUSH( [ d1, d2 ] );
        assert.equals( stack.ptr, 6 );
        sil.POP( [ d3, d4 ] );
        assert.equals( d1.raw(), d4.raw() );
        assert.equals( d2.raw(), d3.raw() );
    },
    PROC: function () { // stub
        assert( sil.PROC ); 
    },
    PSTACK: function () { // stub
        assert( sil.PSTACK ); 
    },
    PUSH: function () {
        var d = new Descriptor();
        d.update( 4, 1, 6 );
        stack.push( d.raw() );
        assert( sil.PUSH ); 
        d = getd( stack.old );
        assert.equals( d.raw(), [ 4, 1, 6 ] );
    },
    RCALL: function () { // stub
        assert( sil.RCALL ); 
    },
    RRTURN: function () { // stub
        assert( sil.RRTURN ); 
    },
    SPOP: function () {
        var s1 = new Specifier(),
            s2 = new Specifier(),
            s3 = new Specifier(),
            s4 = new Specifier();
        s1.update( 0, 2, 4, 6, 8, 10 );
        s2.update( 1, 3, 5, 7, 9, 11 );
        assert.equals( stack.ptr, 0 );
        sil.PUSH( [ s1, s2 ] );
        assert.equals( stack.ptr, 12 );
        sil.POP( [ s3, s4 ] );
        assert.equals( s1.raw(), s4.raw() );
        assert.equals( s2.raw(), s3.raw() );
    },
    SPUSH: function () {
        var s = new Specifier();
        s.update( 1, 2, 3, 4, 5, 6 );
        stack.push( s.raw() );
        d = getspc( stack.old );
        assert.equals( s.raw(), [ 1, 2, 3, 4, 5, 6 ] );
    }
} );


buster.testCase( 'Macros that Move and Set Descriptors', {
    setUp: reset,
    GETD: function () { // stub
        assert( sil.GETD ); 
    },
    GETDC: function () { // stub
        assert( sil.GETDC ); 
    },
    MOVBLK: function () { // stub
        assert( sil.MOVBLK ); 
    },
    MOVD: function () { // stub
        assert( sil.MOVD ); 
    },
    MOVDIC: function () { // stub
        assert( sil.MOVDIC ); 
    },
    POP: function () { // stub
        assert( sil.POP ); 
    },
    PUSH: function () { // stub
        assert( sil.PUSH ); 
    },
    PUTD: function () { // stub
        assert( sil.PUTD ); 
    },
    PUTDC: function () { // stub
        assert( sil.PUTDC ); 
    },
    ZERBLK: function () { // stub
        assert( sil.ZERBLK ); }
} );


buster.testCase( 'Macros that Modify Address Fields of Descriptors', {
    setUp: reset,
    ADJUST: function () { // stub
        assert( sil.ADJUST ); 
    },
    BKSIZE: function () { // stub
        assert( sil.BKSIZE ); 
    },
    DECRA: function () { // stub
        assert( sil.DECRA ); 
    },
    GETAC: function () { // stub
        assert( sil.GETAC ); 
    },
    GETLG: function () { // stub
        assert( sil.GETLG ); 
    },
    GETLTH: function () {
        var s = 'Beauty is truth, truth beauty',
            d1 = new Descriptor(),
            d2 = new Descriptor();
        d2.addr = s.length;
        len = str.encode( s ).length + 9;
        sil.GETLTH( d1, d2 );
        assert.equals( d1.addr, len );
    },
    GETSIZ: function () { // stub
        assert( sil.GETSIZ ); 
    },
    INCRA: function () { // stub
        assert( sil.INCRA ); 
    },
    MOVA: function () { // stub
        assert( sil.MOVA ); 
    },
    PUTAC: function () { // stub
        assert( sil.PUTAC ); 
    },
    SETAC: function () { // stub
        assert( sil.SETAC ); 
    },
    SETAV: function () { // stub
        assert( sil.SETAV ); 
    }
} );


buster.testCase( 'Macros that Modify Value Fields of Descriptors', {
    setUp: reset,
    INCRV: function () { // stub
        assert( sil.INCRV ); 
    },
    MOVV: function () { // stub
        assert( sil.MOVV ); 
    },
    PUTVC: function () { // stub
        assert( sil.PUTVC ); 
    },
    SETSIZ: function () { // stub
        assert( sil.SETSIZ ); 
    },
    SETVA: function () { // stub
        assert( sil.SETVA ); 
    },
    SETVC: function () { // stub
        assert( sil.SETVC ); 
    }
} );


buster.testCase( 'Macros that Modify Flag Fields of Descriptors', {
    setUp: reset,
    RESETF: function () { // stub
        assert( sil.RESETF ); 
    },
    RSETFI: function () { // stub
        assert( sil.RSETFI ); 
    },
    SETF: function () { // stub
        assert( sil.SETF ); 
    },
    SETFI: function () { // stub
        assert( sil.SETFI ); 
    }
} );


buster.testCase( 'Macros that Perform Integer Arithmetic on Address Fields', {
    setUp: reset,
    DECRA: function () { // stub
        assert( sil.DECRA ); 
    },
    DIVIDE: function () { // stub
        assert( sil.DIVIDE ); 
    },
    EXPINT: function () { // stub
        assert( sil.EXPINT ); 
    },
    INCRA: function () { // stub
        assert( sil.INCRA ); 
    },
    MNSINT: function () { // stub
        assert( sil.MNSINT ); 
    },
    MULT: function () { // stub
        assert( sil.MULT ); 
    },
    MULTC: function () { // stub
        assert( sil.MULTC ); 
    },
    SUBTRT: function () { // stub
        assert( sil.SUBTRT ); 
    },
    SUM: function () { // stub
        assert( sil.SUM ); 
    }
} );


buster.testCase( 'Macros that Deal with Real Numbers', {
    setUp: reset,
    ADREAL: function () { // stub
        assert( sil.ADREAL ); 
    },
    DVREAL: function () { // stub
        assert( sil.DVREAL ); 
    },
    EXREAL: function () { // stub
        assert( sil.EXREAL ); 
    },
    INTRL: function () { // stub
        assert( sil.INTRL ); 
    },
    MNREAL: function () { // stub
        assert( sil.MNREAL ); 
    },
    MPREAL: function () { // stub
        assert( sil.MPREAL ); 
    },
    RCOMP: function () { // stub
        assert( sil.RCOMP ); 
    },
    REALST: function () { // stub
        assert( sil.REALST ); 
    },
    RLINT: function () { // stub
        assert( sil.RLINT ); 
    },
    SBREAL: function () { // stub
        assert( sil.SBREAL ); 
    },
    SPREAL: function () {
        var d = new Descriptor(),
            s = new Specifier();
        assign( 'R', 9 );
        s.specified = '-0.5';
        sil.SPREAL( d, s, 1, 2 );
        assert.equals( d.raddr, -0.5 );
        assert.equals( d.value, 9 );
    }
} );

buster.testCase( 'Macros that Move Specifiers', {
    setUp: reset,
    GETSPC: function () { // stub
        assert( sil.GETSPC ); 
    },
    PUTSPC: function () { // stub
        assert( sil.PUTSPC ); 
    },
    SETSP: function () { // stub
        assert( sil.SETSP ); 
    },
    SPOP: function () { // stub
        assert( sil.SPOP ); 
    },
    SPUSH: function () { // stub
        assert( sil.SPUSH ); 
    }
} );


buster.testCase( 'Macros that Operate on Specifiers', {
    setUp: reset,
    ADDLG: function () { // stub
        assert( sil.ADDLG ); 
    },
    APDSP: function () {
        var s1 = new Specifier(),
            s2 = new Specifier();
        s1.specified = 'supercalifragilistic';
        s2.specified = 'expialidocious';
        sil.APDSP( s1, s2 );
        assert.equals( s1.specified, 'supercalifragilisticexpialidocious' );
    },
    FSHRTN: function () { // stub
        assert( sil.FSHRTN ); 
    },
    GETBAL: function () { // stub
        assert( sil.GETBAL ); 
    },
    INTSPC: function () { // stub
        assert( sil.INTSPC ); 
    },
    LOCSP: function () { // stub
        assert( sil.LOCSP ); 
    },
    PUTLG: function () { // stub
        assert( sil.PUTLG ); 
    },
    REMSP: function () { // stub
        assert( sil.REMSP ); 
    },
    SETLC: function () { // stub
        assert( sil.SETLC ); 
    },
    SHORTN: function () { // stub
        assert( sil.SHORTN ); 
    },
    STREAM: function () { // stub
        assert( sil.STREAM ); 
    },
    SUBSP: function () { // stub
        assert( sil.SUBSP ); 
    },
    TRIMSP: function () {
        var s1 = new Specifier(),
            s2 = new Specifier();
        s2.specified = 'abcd   ';
        sil.TRIMSP( s1, s2 );
        assert.equals( 'abcd   ', s2.specified );
        assert.equals( s1.specified, 'abcd' );
        s2.specified = 'efgh';
        sil.TRIMSP( s1, s2 );
        assert.equals( s1.specified, 'efgh' );
    }
} );


buster.testCase( 'Macros that Operate on Syntax Tables', {
    setUp: reset,
    CLERTB: function () { // stub
        assert( sil.CLERTB );
    },
    PLUGTB: function () { // stub
        assert( sil.PLUGTB );
    }
} );


buster.testCase( 'Macros that Construct Pattern Nodes', {
    setUp: reset,
    CPYPAT: function () { // stub
        assert( sil.CPYPAT ); 
    },
    MAKNOD: function () { // stub
        assert( sil.MAKNOD ); 
    }
} );

buster.testCase( 'Macros that Operate on Tree Nodes', {
    setUp: reset,
    ADDSIB: function () { // stub
        assert( sil.ADDSIB ); 
    },
    ADDSON: function () { // stub
        assert( sil.ADDSON ); 
    },
    INSERT: function () { // stub
        assert( sil.INSERT ); 
    }
} );


buster.testCase( 'Input and Output Macros', {
    setUp: reset,
    BKSPCE: function () { // stub
        assert( sil.BKSPCE ); 
    },
    ENFILE: function () { // stub
        assert( sil.ENFILE ); 
    },
    FORMAT: function () {
        var s = sil.FORMAT( 'test' );
        assert.equals( s, 'test' );
    },
    OUTPUT: function () { // stub
        assert( sil.OUTPUT ); 
    },
    REWIND: function () { // stub
        assert( sil.REWIND ); 
    },
    STPRNT: function () { // stub
        assert( sil.STPRNT ); 
    },
    STREAD: function () { // stub
        assert( sil.STREAD ); 
    }
} );


buster.testCase( 'Macros that Depend on Operating System Facilities', {
    setUp: reset,
    DATE: function () { // stub
        assert( sil.DATE ); 
    },
    ENDEX: function () { // stub
        assert( sil.ENDEX ); 
    },
    INIT: function () { // stub
        assert( sil.INIT ); 
    },
    LINK: function () { // stub
        assert( sil.LINK ); 
    },
    LOAD: function () { // stub
        assert( sil.LOAD ); 
    },
    MSTIME: function () { // stub
        assert( sil.MSTIME ); 
    },
    UNLOAD: function () { // stub
        assert( sil.UNLOAD ); 
    }
} );


buster.testCase( 'Miscellaneous Macros', {
    setUp: reset,
    LINKOR: function () { // stub
        assert( sil.LINKOR ); 
    },
    LOCAPT: function () { // stub
        assert( sil.LOCAPT ); 
    },
    LOCAPV: function () { // stub
        assert( sil.LOCAPV ); 
    },
    LVALUE: function () {
        var values = [ 42, 28, 96, 14, 2, 77 ],
            least = Math.min.apply( Math, values ),
            DESCR1 = new Descriptor(),
            DESCR2 = new Descriptor(),
            step = 2*3, offset = 0;

        DESCR2.addr = alloc( values.length * step );
        while ( values.length ) {
            mem.splice(
                DESCR2.addr + offset, step,
                values.length === 1 ? 0 : offset + step, 0, 0,
                values.pop(), 0, 0
            );
            offset += step;
        }

        sil.LVALUE( DESCR1, DESCR2 );
        assert.equals( DESCR1.addr, least );
    },
    ORDVST: function () { // stub
        assert( sil.ORDVST ); 
    },
    RPLACE: function () { // stub
        assert( sil.RPLACE ); 
    },
    SPCINT: function () { // stub
        assert( sil.SPCINT ); 
    },
    TOP: function () { // stub
        assert( sil.TOP ); 
    },
    VARID: function () {
        var d = new Descriptor(),
            s = new Specifier();
        s.specified = 'hello';
        sil.VARID( d, s );
        assert.equals( d.addr, 1825099640 );
        assert.equals( d.value, 3035920923 );
    }
} );
