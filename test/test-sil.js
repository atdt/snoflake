var assert = require('assert'),
    slice = Array.prototype.slice,
    SNOBOL = require( '../js/SNOBOL' );

Object.keys( SNOBOL ).forEach( function ( k ) {
    global[k] = SNOBOL[k];
} );

function reset() {}

// 
// Scaffolds
//

function mkargs( vm ) {
    // Construct a deferred operands object
    var args = [].slice.call( arguments, 1 );

    return function () { // stub
        return args.map( function ( arg ) {
            return typeof arg === 'number' ? arg : vm.resolve( arg );
        } );
    };
}


//
// Test Cases
//

describe( 'Assembly Control Macros', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'COPY', function () { // stub
        assert( sil.COPY );
    } );

    it( 'END', function () { // stub
        assert( sil.END );
    } );

    it( 'EQU', function () {
        assert( sil.EQU );
        this.vm.run( [ [ 'A', 'EQU', mkargs( this.vm, 12 ) ] ] );
        assert.equal( this.vm.resolve('A'), 12 );
    } );

    it( 'LHERE', function () {
        assert( sil.LHERE );
        this.vm.run( [
            [ 'A', 'LHERE', mkargs( this.vm ) ],
            [ 'B', 'LHERE', mkargs( this.vm ) ]
        ] );
        assert.equal( this.vm.resolve('A'), 0 );
        assert.equal( this.vm.resolve('B'), 1 );
    } );

    it( 'TITLE', function () { // stub
        assert( sil.TITLE );
    } );
} );

describe( 'Macros that Assemble Data', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ARRAY', function () { // stub
        assert( sil.ARRAY );
    } );

    /*
    it( 'BUFFER', function () {
        var ptr = sil.BUFFER.call( this.vm, 4 );
        assert.equal( this.vm.s( ptr ).specified, '    ' );
    } );

    */
    it( 'DESCR', function () { // stub
        assert( sil.DESCR );
    } );

    it( 'FORMAT', function () { // stub
        assert( sil.FORMAT );
    } );

    it( 'SPEC', function () { // stub
        assert( sil.SPEC );
    } );

    it( 'STRING', function () {
        var ptr = sil.STRING.call( this.vm, 'Bananaphone' );
        assert.equal( this.vm.s( ptr ).specified, 'Bananaphone' );
    } );
} );


describe( 'Branch Macros', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'BRANCH', function () {
        assert( sil.BRANCH );
        this.vm.run( [
            [ null, 'BRANCH', mkargs( this.vm, 'A' ) ] ,
            [ 'A',  'LHERE',  mkargs( this.vm  ) ] ,
            [ 'X',  'EQU',    mkargs( this.vm, 22) ] ,
            [ null, 'BRANCH', mkargs( this.vm, 5) ] ,
            [ 'X',  'EQU',    mkargs( this.vm, 33) ] ,
            [ null, 'END',    mkargs( this.vm  ) ]
        ] );
        assert.equal( this.vm.resolve('X'), 22 );
    } );

    it( 'BRANIC', function () { // stub
        assert( sil.BRANIC );
    } );

    it( 'SELBRA', function () { // stub
        assert( sil.SELBRA );
    } );
} );


describe( 'Comparison Macros', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ACOMP', function () {
        var a = this.vm.d(), b = this.vm.d();
        a.addr = 123;
        b.addr = 456;
        this.vm.run( [
            [ null,  'ACOMP',   mkargs( this.vm, a.ptr, b.ptr ) ],
            [ 'EQ',  'LHERE',   mkargs( this.vm ) ],
            [ 'A',   'EQU',     mkargs( this.vm, 111 ) ],
            [ null,  'BRANCH',  mkargs( this.vm, 6 ) ],
            [ 'NE',  'LHERE',   mkargs( this.vm ) ],
            [ 'A',   'EQU',     mkargs( this.vm, 222 ) ],
            [ null,  'END',     mkargs( this.vm ) ]
        ] );
        assert.equal( this.vm.resolve('A'), 111 );
    } );

    it( 'ACOMPC', function () { // stub
        var DESCR = this.vm.d(),
            N = 4,
            NELOC = 1,
            EQLOC = 2;

        this.vm.define( 'NELOC', NELOC );
        this.vm.define( 'EQLOC', NELOC );

        this.vm.run( [
            [ null,     'ACOMPC',  mkargs( this.vm, DESCR.ptr, N, NELOC, EQLOC ) ]
        ] );
        assert.equal( this.vm.instructionPointer, NELOC );

        DESCR.addr = N;
        this.vm.run( [
            [ null,     'ACOMPC',  mkargs( this.vm, DESCR.ptr, N, NELOC, EQLOC ) ]
        ] );
        assert.equal( this.vm.instructionPointer, EQLOC );
    } );

    it( 'AEQL', function () { // stub
        assert( sil.AEQL ); 
    } );

    it( 'AEQLC', function () { // stub
        assert( sil.AEQLC ); 
    } );

    it( 'AEQLIC', function () { // stub
        assert( sil.AEQLIC ); 
    } );

    it( 'CHKVAL', function () { // stub
        assert( sil.CHKVAL ); 
    } );

    it( 'DEQL', function () { // stub
        assert( sil.DEQL ); 
    } );

    it( 'LCOMP', function () { // stub
        assert( sil.LCOMP ); 
    } );

    it( 'LEQLC', function () { // stub
        assert( sil.LEQLC ); 
    } );

    it( 'LEXCMP', function () {
        var SPEC1 = this.vm.s( sil.STRING.call( this.vm, 'abd' ) ),
            SPEC2 = this.vm.s( sil.STRING.call( this.vm, 'abc' ) ),
            GTLOC = 1,
            EQLOC = 2,
            LTLOC = 3;

        sil.LEXCMP.call( this.vm, SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, GTLOC );

        SPEC1.specified = 'abc';
        SPEC2.specified = 'abc';
        sil.LEXCMP.call( this.vm, SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, EQLOC );

        SPEC1.specified = 'abc';
        SPEC2.specified = 'abd';
        sil.LEXCMP.call( this.vm, SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, LTLOC );
    } );

    it( 'RCOMP', function () { // stub
        assert( sil.RCOMP ); 
    } );

    it( 'TESTF', function () { // stub
        assert( sil.TESTF ); 
    } );

    it( 'TESTFI', function () { // stub
        assert( sil.TESTFI ); 
    } );

    it( 'VCMPIC', function () { // stub
        assert( sil.VCMPIC ); 
    } );

    it( 'VEQL', function () { // stub
        assert( sil.VEQL ); 
    } );

    it( 'VEQLC', function () { // stub
        assert( sil.VEQLC ); 
    } );
} );


describe( 'Macros that Relate to Recursive Procedures and Stack Management', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
        this.vm.reset();
        sil.ISTACK.call( this.vm );
    } );

    it( 'ISTACK', function () { // stub
        assert( sil.ISTACK ); 
    } );

    it( 'POP', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            d3 = this.vm.d(),
            d4 = this.vm.d(),
            cur = this.vm.CSTACK.addr;

        d1.update( 2, 4, 6 );
        d2.update( 3, 5, 7 );

        assert.equal( this.vm.CSTACK.addr, cur );
        sil.PUSH.call( this.vm, [ d1, d2 ] );
        assert.equal( this.vm.CSTACK.addr, cur + d1.width + d2.width );
        sil.POP.call( this.vm, [ d3, d4 ] );
        assert.equal( this.vm.CSTACK.addr, cur );
        // assert.equal( d1.raw(), d4.raw() );
        // assert.equal( d2.raw(), d3.raw() );
    } );

    it( 'PROC', function () { // stub
        assert( sil.PROC ); 
    } );

    it( 'PSTACK', function () { // stub
        assert( sil.PSTACK ); 
    } );

    it( 'PUSH', function () {
        var cur = this.vm.CSTACK.addr,
            d = this.vm.d();
        d.update( 4, 1, 6 );
        sil.PUSH.call( this.vm, d );
        d = this.vm.d( cur );
        assert.equal( d.raw(), [ 4, 1, 6 ] );
    } );

    it( 'RCALL', function () { // stub
        assert( sil.RCALL ); 
    } );

    it( 'RRTURN', function () { // stub
        assert( sil.RRTURN ); 
    } );

    it( 'SPOP', function () {
        var s1 = this.vm.s(),
            s2 = this.vm.s(),
            s3 = this.vm.s(),
            s4 = this.vm.s(),
            cur = this.vm.CSTACK.addr;

        s1.update( 0, 2, 4, 6, 8, 10 );
        s2.update( 1, 3, 5, 7, 9, 11 );
        assert.equal( this.vm.CSTACK.addr, cur );
        sil.SPUSH.call( this.vm, [ s1, s2 ] );
        assert.equal( this.vm.CSTACK.addr, cur + s1.width + s2.width );
        sil.SPOP.call( this.vm, [ s3, s4 ] );
        assert.equal( this.vm.CSTACK.addr, cur );
        assert.equal( s1.raw(), s4.raw() );
        assert.equal( s2.raw(), s3.raw() );
    } );

    it( 'SPUSH', function () {
        var cur = this.vm.CSTACK.addr,
            s = this.vm.s();

        s.update( 1, 2, 3, 4, 5, 6 );
        sil.SPUSH.call( this.vm, s );

        s = this.vm.s( cur );
        assert.equal( s.raw(), [ 1, 2, 3, 4, 5, 6 ] );
    } );
} );


describe( 'Macros that Move and Set Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'GETD', function () { // stub
        assert( sil.GETD ); 
    } );

    it( 'GETDC', function () { // stub
        assert( sil.GETDC ); 
    } );

    it( 'MOVBLK', function () { // stub
        assert( sil.MOVBLK ); 
    } );

    it( 'MOVD', function () { // stub
        assert( sil.MOVD ); 
    } );

    it( 'MOVDIC', function () { // stub
        assert( sil.MOVDIC ); 
    } );

    it( 'POP', function () { // stub
        assert( sil.POP ); 
    } );

    it( 'PUSH', function () { // stub
        assert( sil.PUSH ); 
    } );

    it( 'PUTD', function () { // stub
        assert( sil.PUTD ); 
    } );

    it( 'PUTDC', function () { // stub
        assert( sil.PUTDC ); 
    } );

    it( 'ZERBLK', function () { // stub
        assert( sil.ZERBLK );
    } );
} );


describe( 'Macros that Modify Address Fields of Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ADJUST', function () { // stub
        assert( sil.ADJUST ); 
    } );

    it( 'BKSIZE', function () { // stub
        assert( sil.BKSIZE ); 
    } );

    it( 'DECRA', function () { // stub
        assert( sil.DECRA ); 
    } );

    it( 'GETAC', function () { // stub
        assert( sil.GETAC ); 
    } );

    it( 'GETLG', function () { // stub
        assert( sil.GETLG ); 
    } );

    it( 'GETLTH', function () {
        var s = 'Beauty is truth, truth beauty',
            d1 = this.vm.d(),
            d2 = this.vm.d();
        d2.addr = s.length;
        len = SNOBOL.str.encode( s ).length + 9;
        sil.GETLTH.call( this.vm, d1, d2 );
        assert.equal( d1.addr, len );
    } );

    it( 'GETSIZ', function () { // stub
        assert( sil.GETSIZ ); 
    } );

    it( 'INCRA', function () { // stub
        assert( sil.INCRA ); 
    } );

    it( 'MOVA', function () { // stub
        assert( sil.MOVA ); 
    } );

    it( 'PUTAC', function () { // stub
        assert( sil.PUTAC ); 
    } );

    it( 'SETAC', function () { // stub
        assert( sil.SETAC ); 
    } );

    it( 'SETAV', function () { // stub
        assert( sil.SETAV ); 
    } );
} );


describe( 'Macros that Modify Value Fields of Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'INCRV', function () { // stub
        assert( sil.INCRV ); 
    } );

    it( 'MOVV', function () { // stub
        assert( sil.MOVV ); 
    } );

    it( 'PUTVC', function () { // stub
        assert( sil.PUTVC ); 
    } );

    it( 'SETSIZ', function () { // stub
        assert( sil.SETSIZ ); 
    } );

    it( 'SETVA', function () { // stub
        assert( sil.SETVA ); 
    } );

    it( 'SETVC', function () { // stub
        assert( sil.SETVC ); 
    } );
} );


describe( 'Macros that Modify Flag Fields of Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'RESETF', function () { // stub
        assert( sil.RESETF ); 
    } );

    it( 'RSETFI', function () { // stub
        assert( sil.RSETFI ); 
    } );

    it( 'SETF', function () { // stub
        assert( sil.SETF ); 
    } );

    it( 'SETFI', function () { // stub
        assert( sil.SETFI ); 
    } );
} );


describe( 'Macros that Perform Integer Arithmetic on Address Fields', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'DECRA', function () { // stub
        assert( sil.DECRA ); 
    } );

    it( 'DIVIDE', function () { // stub
        assert( sil.DIVIDE ); 
    } );

    it( 'EXPINT', function () { // stub
        assert( sil.EXPINT ); 
    } );

    it( 'INCRA', function () { // stub
        assert( sil.INCRA ); 
    } );

    it( 'MNSINT', function () { // stub
        assert( sil.MNSINT ); 
    } );

    it( 'MULT', function () { // stub
        assert( sil.MULT ); 
    } );

    it( 'MULTC', function () { // stub
        assert( sil.MULTC ); 
    } );

    it( 'SUBTRT', function () { // stub
        assert( sil.SUBTRT ); 
    } );

    it( 'SUM', function () { // stub
        assert( sil.SUM ); 
    } );
} );


describe( 'Macros that Deal with Real Numbers', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ADREAL', function () { // stub
        assert( sil.ADREAL ); 
    } );

    it( 'DVREAL', function () { // stub
        assert( sil.DVREAL ); 
    } );

    it( 'EXREAL', function () { // stub
        assert( sil.EXREAL ); 
    } );

    it( 'INTRL', function () { // stub
        assert( sil.INTRL ); 
    } );

    it( 'MNREAL', function () { // stub
        assert( sil.MNREAL ); 
    } );

    it( 'MPREAL', function () { // stub
        assert( sil.MPREAL ); 
    } );

    it( 'RCOMP', function () { // stub
        assert( sil.RCOMP ); 
    } );

    it( 'REALST', function () { // stub
        assert( sil.REALST ); 
    } );

    it( 'RLINT', function () { // stub
        assert( sil.RLINT ); 
    } );

    it( 'SBREAL', function () { // stub
        assert( sil.SBREAL ); 
    } );

    it( 'SPREAL', function () {
        var d = this.vm.d(), s = sil.STRING.call( this.vm, '-0.5' );
        this.vm.define( 'R', 9 );
        sil.SPREAL.call( this.vm, d, s, 1, 2 );
        assert.equal( d.raddr, -0.5 );
        assert.equal( d.value, 9 );
    } );
} );

describe( 'Macros that Move Specifiers', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'GETSPC', function () { // stub
        assert( sil.GETSPC ); 
    } );

    it( 'PUTSPC', function () { // stub
        assert( sil.PUTSPC ); 
    } );

    it( 'SETSP', function () { // stub
        assert( sil.SETSP ); 
    } );

    it( 'SPOP', function () { // stub
        assert( sil.SPOP ); 
    } );

    it( 'SPUSH', function () { // stub
        assert( sil.SPUSH ); 
    } );
} );


describe( 'Macros that Operate on Specifiers', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ADDLG', function () { // stub
        assert( sil.ADDLG ); 
    } );

    it( 'APDSP', function () {
        var s1 = this.vm.s( sil.STRING.call( this.vm, 'supercalifragilistic' ) ),
            s2 = this.vm.s( sil.STRING.call( this.vm, 'expialidocious' ) );
        sil.APDSP.call( this.vm, s1, s2 );
        assert.equal( s1.specified, 'supercalifragilisticexpialidocious' );
    } );

    it( 'FSHRTN', function () { // stub
        assert( sil.FSHRTN ); 
    } );

    it( 'GETBAL', function () { // stub
        assert( sil.GETBAL ); 
    } );

    it( 'INTSPC', function () { // stub
        assert( sil.INTSPC ); 
    } );

    it( 'LOCSP', function () { // stub
        assert( sil.LOCSP ); 
    } );

    it( 'PUTLG', function () { // stub
        assert( sil.PUTLG ); 
    } );

    it( 'REMSP', function () { // stub
        assert( sil.REMSP ); 
    } );

    it( 'SETLC', function () { // stub
        assert( sil.SETLC ); 
    } );

    it( 'SHORTN', function () { // stub
        assert( sil.SHORTN ); 
    } );

    it( 'STREAM', function () { // stub

        var s1 = this.vm.s(),
            s2 = this.vm.s( sil.STRING.call( this.vm, '43.2   ' ) ),
            stype = this.vm.d();

        this.vm.define( 'STYPE', stype );
        this.vm.define( 'FLITYP', 6 );

        sil.STREAM.call( this.vm, s1, s2, SNOBOL.syntaxTables.INTGTB, -1, -2, -3 );

        assert.equal( s1.specified, '43.2' );
    } );

    it( 'SUBSP', function () { // stub
        assert( sil.SUBSP ); 
    } );

    it( 'TRIMSP', function () {
        var s1 = this.vm.s(),
            s2 = this.vm.s( sil.STRING.call( this.vm, 'abcd   ' ) );

        sil.TRIMSP.call( this.vm, s1, s2 );
        assert.equal( s2.specified, 'abcd   ' );
        assert.equal( s1.specified, 'abcd' );

        s2.specified = 'efgh';
        sil.TRIMSP.call( this.vm, s1, s2 );
        assert.equal( s1.specified, 'efgh' );
    } );
} );


describe( 'Macros that Operate on Syntax Tables', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'CLERTB', function () { // stub
        assert( sil.CLERTB );
    } );

    it( 'PLUGTB', function () { // stub
        assert( sil.PLUGTB );
    } );
} );


describe( 'Macros that Construct Pattern Nodes', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'CPYPAT', function () { // stub
        assert( sil.CPYPAT ); 
    } );

    it( 'MAKNOD', function () { // stub
        assert( sil.MAKNOD ); 
    } );
} );

describe( 'Macros that Operate on Tree Nodes', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ADDSIB', function () { // stub
        assert( sil.ADDSIB ); 
    } );

    it( 'ADDSON', function () { // stub
        assert( sil.ADDSON ); 
    } );

    it( 'INSERT', function () { // stub
        assert( sil.INSERT ); 
    } );
} );


describe( 'Input and Output Macros', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'BKSPCE', function () { // stub
        assert( sil.BKSPCE ); 
    } );

    it( 'ENFILE', function () { // stub
        assert( sil.ENFILE ); 
    } );

    it( 'FORMAT', function () {
        var ptr = sil.FORMAT.call( this.vm, 'test' );
        assert.equal( this.vm.s( ptr ).specified, 'test' );
    } );

    it( 'OUTPUT', function () { // stub
        assert( sil.OUTPUT ); 
    } );

    it( 'REWIND', function () { // stub
        assert( sil.REWIND ); 
    } );

    it( 'STPRNT', function () { // stub
        assert( sil.STPRNT ); 
    } );

    it( 'STREAD', function () { // stub
        assert( sil.STREAD ); 
    } );
} );


describe( 'Macros that Depend on Operating System Facilities', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'DATE', function () { // stub
        assert( sil.DATE ); 
    } );

    it( 'ENDEX', function () { // stub
        assert( sil.ENDEX ); 
    } );

    it( 'INIT', function () { // stub
        assert( sil.INIT ); 
    } );

    it( 'LINK', function () { // stub
        assert( sil.LINK ); 
    } );

    it( 'LOAD', function () { // stub
        assert( sil.LOAD ); 
    } );

    it( 'MSTIME', function () { // stub
        assert( sil.MSTIME ); 
    } );

    it( 'UNLOAD', function () { // stub
        assert( sil.UNLOAD ); 
    } );
} );



describe( 'Miscellaneous Macros', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
        // XXX: Needed for VARID test. Move to generic setup?
        this.vm.run( [ [ 'OBSIZ', 'EQU', mkargs( this.vm, 256 ) ] ] );
    } );

    it( 'LINKOR', function () { // stub
        assert( sil.LINKOR ); 
    } );

    it( 'LOCAPT', function () { // stub
        assert( sil.LOCAPT ); 
    } );

    it( 'LOCAPV', function () { // stub
        assert( sil.LOCAPV ); 
    } );

    it( 'LVALUE', function () {
        var values = [ 42, 28, 96, 14, 2, 77 ],
            least = Math.min.apply( Math, values ),
            DESCR1 = this.vm.d(),
            DESCR2 = this.vm.d(),
            step = 2*3, offset = 0;

        DESCR2.addr = this.vm.alloc( values.length * step );
        while ( values.length ) {
            this.vm.mem.splice(
                DESCR2.addr + offset, step,
                values.length === 1 ? 0 : offset + step, 0, 0,
                values.pop(), 0, 0
            );
            offset += step;
        }

        sil.LVALUE.call( this.vm, DESCR1, DESCR2 );
        assert.equal( DESCR1.addr, least );
    } );

    it( 'ORDVST', function () { // stub
        assert( sil.ORDVST ); 
    } );

    it( 'RPLACE', function () { // stub
        assert( sil.RPLACE ); 
    } );

    it( 'SPCINT', function () { // stub
        assert( sil.SPCINT ); 
    } );

    it( 'TOP', function () { // stub
        assert( sil.TOP ); 
    } );

    it( 'VARID', function () {
        var d = this.vm.d(),
            s = this.vm.s( sil.STRING.call( this.vm, 'hello' ) );

        sil.VARID.call( this.vm, d, s );
        assert.equal( d.addr, 226 );
        assert.equal( d.value, 3679317 );
    } );
} );
