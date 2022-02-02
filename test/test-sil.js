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

    return function () {
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

    it( 'COPY', function () {
        assert( sil.COPY );
    } );

    it( 'END', function () {
        assert( sil.END );
    } );

    it( 'EQU', function () {
        this.vm.run( [ [ 'A', 'EQU', mkargs( this.vm, 12 ) ] ] );
        assert.equal( this.vm.resolve('A'), 12 );
    } );

    it( 'LHERE', function () {
        this.vm.run( [
            [ 'A',  'LHERE', mkargs( this.vm ) ],
            [ null, 'DESCR', mkargs( this.vm ) ],
            [ 'B',  'LHERE', mkargs( this.vm ) ],
            [ null, 'DESCR', mkargs( this.vm ) ]
        ] );
        assert.equal( this.vm.mem[ this.vm.resolve('A') ], 1 );
        assert.equal( this.vm.mem[ this.vm.resolve('B') ], 3 );
    } );

    it( 'TITLE', function () {
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

    it( 'BUFFER', function () {
        var s = this.vm.s();
        s.addr = sil.BUFFER.call( this.vm, 4 );
        s.length = 4;
        assert.equal( s.specified, '    ' );
    } );

    it( 'DESCR', function () {
        var ptr = sil.DESCR.call( this.vm, 1976, 1983, 2011 ),
            d = this.vm.d( ptr );
        assert.equal( d.addr, 1976 );
        assert.equal( d.flags, 1983 );
        assert.equal( d.value, 2011 );

    } );

    it( 'SPEC', function () {
        var A = 55, F = 66, V = 77, O = 88, L = 99,
            s = this.vm.s( sil.SPEC.call( this.vm, A, F, V, O, L ) );
        assert.deepEqual( s.raw(), [ A, F, V, O, L ] );
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
        this.vm.run( [
            [ 'DS', 'DESCR',  mkargs( this.vm  ) ] ,
            [ null,  'SETAC',  mkargs( this.vm, 'DS', 22 ) ] ,
            [ null, 'BRANCH', mkargs( this.vm, 'LBL' ) ],
            [ null, 'SETAC',  mkargs( this.vm, 'DS', 33 ) ],
            [ 'LBL',  'LHERE',  mkargs( this.vm ) ],
            [ null, 'END',    mkargs( this.vm  ) ]
        ] );
        assert.equal( this.vm.d( 'DS' ).addr, 22 );
    } );

    it( 'BRANIC', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        d1.addr = d2.ptr;
        d2.addr = this.vm.ptr( 1234 );
        sil.BRANIC.call( this.vm, d1, 0 );
        assert.equal( this.vm.instructionPointer, 1234 );
    } );

    it( 'SELBRA', function () {
        var d = this.vm.d(),
            LOC1 = this.vm.ptr( 222 ),
            LOC2 = this.vm.ptr( 333 ),
            LOC3 = this.vm.ptr( 555 );
        d.addr = 2;
        sil.SELBRA.call( this.vm, d.ptr, [ null, LOC1, LOC2, null, LOC3 ] );
        assert.equal( this.vm.instructionPointer, 222 );
        // TODO: Test I = N + 1 (see SELBRA spec).
    } );
} );


describe( 'Comparison Macros', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ACOMP', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            GTLOC = this.vm.ptr( 1 ),
            EQLOC = this.vm.ptr( 2 ),
            LTLOC = this.vm.ptr( 3 );
        d1.addr = 456;
        d2.addr = 123;
        sil.ACOMP.call( this.vm, d1, d2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d1.addr = d2.addr;
        sil.ACOMP.call( this.vm, d1, d2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 2 );
        d1.addr = d2.addr - 100;
        sil.ACOMP.call( this.vm, d1, d2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 3 );
    } );

    it( 'ACOMPC', function () {
        var DESCR = this.vm.d(),
            N = 4,
            NELOC = this.vm.ptr( 1 ),
            EQLOC = this.vm.ptr( 2 );

        this.vm.run( [
            [ null,     'ACOMPC',  mkargs( this.vm, DESCR.ptr, N, NELOC, EQLOC ) ]
        ] );
        assert.equal( this.vm.instructionPointer, 1 );

        DESCR.addr = N;
        this.vm.run( [
            [ null,     'ACOMPC',  mkargs( this.vm, DESCR.ptr, N, NELOC, EQLOC ) ]
        ] );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'AEQL', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            NELOC = this.vm.ptr( 1 ),
            EQLOC = this.vm.ptr( 2 );

        d1.addr = 123;
        d2.addr = 456;
        sil.AEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d2.addr = d1.addr;
        sil.AEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'AEQLC', function () {
        var d = this.vm.d(),
            N = 1000,
            NELOC = this.vm.ptr( 1 ),
            EQLOC = this.vm.ptr( 2 );
        d.addr = -1000;
        sil.AEQLC.call( this.vm, d, N, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d.addr = N;
        sil.AEQLC.call( this.vm, d, N, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'AEQLIC', function () {
        var NELOC = this.vm.ptr( 1 ),
            EQLOC = this.vm.ptr( 2 ),
            N1 = 50,
            N2 = 0;
        var d1 = this.vm.d();
        this.vm.alloc( 77 );
        var d2 = this.vm.d();

        d1.addr = d2.ptr - N1;
        d2.addr = N2 - 500;
        sil.AEQLIC.call( this.vm, d1, N1, N2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d2.addr = N2;
        sil.AEQLIC.call( this.vm, d1, N1, N2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'CHKVAL', function () {
        var s = this.vm.s(),
            d1 = this.vm.d(),
            d2 = this.vm.d(),
            GTLOC = this.vm.ptr( 1 ),
            LTLOC = this.vm.ptr( 2 ),
            EQLOC = this.vm.ptr( 3 );

        s.length = 50;
        d1.addr = 20;
        d2.addr = 100;
        sil.CHKVAL.call( this.vm, d1, d2, s, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 1 );

        d1.addr = 500;
        sil.CHKVAL.call( this.vm, d1, d2, s, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 2 );

        d1.addr = d2.addr + s.length;
        sil.CHKVAL.call( this.vm, d1, d2, s, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 3 );
    } );

    it( 'DEQL', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            EQLOC = this.vm.ptr( 1 ),
            NELOC = this.vm.ptr( 2 );

        d1.update( 123, 456, 789 );
        d2.read( d1 );
        sil.DEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d1.addr = 555;
        sil.DEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'LCOMP', function () {
        var s1 = this.vm.s(),
            s2 = this.vm.s(),
            GTLOC = this.vm.ptr( 1 ),
            EQLOC = this.vm.ptr( 2 ),
            LTLOC = this.vm.ptr( 3 );
        s1.length = 55;
        s2.length = 44;
        sil.LCOMP.call( this.vm, s1, s2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        s2.length = s1.length;
        sil.LCOMP.call( this.vm, s1, s2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 2 );
        s1.length = s2.length - 5;
        sil.LCOMP.call( this.vm, s1, s2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 3 );
    } );

    it( 'LEQLC', function () {
        var s = this.vm.s(),
            NELOC = this.vm.ptr( 20 ),
            EQLOC = this.vm.ptr( 30 ),
            N = 333;
        s.length = N;
        sil.LEQLC.call( this.vm, s, N, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 30 );
        sil.LEQLC.call( this.vm, s, N + 5, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 20 );
    } );

    it( 'LEXCMP', function () {
        var SPEC1 = this.vm.s(),
            SPEC2 = this.vm.s(),
            GTLOC = this.vm.ptr( 1 ),
            EQLOC = this.vm.ptr( 2 ),
            LTLOC = this.vm.ptr( 3 );

        this.vm.specify( 'abd', SPEC1 );
        this.vm.specify( 'abc', SPEC2 );
        sil.LEXCMP.call( this.vm, SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 1 );

        this.vm.specify( 'abc', SPEC1 );
        this.vm.specify( 'abc', SPEC2 );
        sil.LEXCMP.call( this.vm, SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 2 );

        this.vm.specify( 'abc', SPEC1 );
        this.vm.specify( 'abd', SPEC2 );
        sil.LEXCMP.call( this.vm, SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 3 );
    } );

    it( 'TESTF', function () {
        var d = this.vm.d(),
            FLAG = 4,
            FLOC = this.vm.ptr( 1 ),
            SLOC = this.vm.ptr( 2 );
        sil.TESTF.call( this.vm, d, FLAG, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d.flags |= FLAG;
        sil.TESTF.call( this.vm, d, FLAG, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'TESTFI', function () {
        var d = this.vm.d(),
            FLAG = 4,
            FLOC = this.vm.ptr( 1 ),
            SLOC = this.vm.ptr( 2 );
        this.vm.alloc( 50 );
        var da = this.vm.d();
        d.addr = da.ptr;
        sil.TESTFI.call( this.vm, d, FLAG, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        da.flags |= FLAG;
        sil.TESTFI.call( this.vm, d, FLAG, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'VCMPIC', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            N = 5,
            GTLOC = this.vm.ptr( 10 ),
            EQLOC = this.vm.ptr( 20 ),
            LTLOC = this.vm.ptr( 30 );
        this.vm.alloc( 30 );
        var src = this.vm.d();
        d1.addr = src.ptr - N;

        // V1 > V2
        d2.value = 200;
        src.value = 300;
        sil.VCMPIC.call( this.vm, d1, N, d2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 10 );

        // V1 == V2
        src.value = d2.value;
        sil.VCMPIC.call( this.vm, d1, N, d2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 20 );

        // V1 < V2
        src.value = 100;
        sil.VCMPIC.call( this.vm, d1, N, d2, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 30 );
    } );

    it( 'VEQL', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            NELOC = this.vm.ptr( 1 ),
            EQLOC = this.vm.ptr( 2 );
        d1.value = 123;
        d2.value = 456;
        sil.VEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d1.value = d2.value;
        sil.VEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'VEQLC', function () {
        var d = this.vm.d(),
            N = 555,
            NELOC = this.vm.ptr( 1 ),
            EQLOC = this.vm.ptr( 2 );
        d.value = 444;
        sil.VEQLC.call( this.vm, d, N, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d.value = N;
        sil.VEQLC.call( this.vm, d, N, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
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
        assert.deepEqual( d1.raw(), d4.raw() );
        assert.deepEqual( d2.raw(), d3.raw() );
    } );

    it( 'PROC', function () {
        // PROC is an alias of LHERE.
        assert.equal (sil.PROC, sil.LHERE );
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
        assert.deepEqual( d.raw(), [ 4, 1, 6 ] );
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

        s1.update( 0, 2, 4, 6, 8 );
        s2.update( 1, 3, 5, 7, 9 );
        assert.equal( this.vm.CSTACK.addr, cur );
        sil.SPUSH.call( this.vm, [ s1, s2 ] );
        assert.equal( this.vm.CSTACK.addr, cur + s1.width + s2.width );
        sil.SPOP.call( this.vm, [ s3, s4 ] );
        assert.equal( this.vm.CSTACK.addr, cur );
        assert.deepEqual( s1.raw(), s4.raw() );
        assert.deepEqual( s2.raw(), s3.raw() );
    } );

    it( 'SPUSH', function () {
        var cur = this.vm.CSTACK.addr,
            s = this.vm.s();

        s.update( 1, 2, 3, 4, 5 );
        sil.SPUSH.call( this.vm, s );

        s = this.vm.s( cur );
        assert.deepEqual( s.raw(), [ 1, 2, 3, 4, 5 ] );
    } );
} );


describe( 'Macros that Move and Set Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'GETD', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            d3 = this.vm.d();
        this.vm.alloc( 111 );
        var src = this.vm.d();
        d2.addr = src.ptr - 55;
        d3.addr = 55;
        src.update( 555, 666, 777 );
        sil.GETD.call( this.vm, d1, d2, d3 );
        assert.deepEqual( src.raw(), d1.raw() );
    } );

    it( 'GETDC', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        d2.addr = 50;
        this.vm.alloc( 111 );
        var di = this.vm.d(),
            N = di.ptr - d2.addr;
        di.update( 4, 5, 6 );
        sil.GETDC.call( this.vm, d1, d2, N );
        assert.deepEqual( d1.raw(), di.raw() );
    } );

    it( 'MOVBLK', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            d3 = this.vm.d();
        this.vm.alloc( 99 );
        d2.addr = this.vm.mem.length - 3;
        for ( var i = 0; i < 10; i++ ) {
            this.vm.d().update( i, i, i );
        }
        d3.addr = 10 * 3;
        // An offset of 9 makes sure source and destination regions overlap.
        d1.addr = d2.addr - 9;
        sil.MOVBLK.call( this.vm, d1, d2, d3 );
        for ( var i = 0; i < 10; i++ ) {
            var ptr = d1.addr + 3 + (3 * i);
            assert.deepEqual( this.vm.d( ptr ).raw(), [ i, i, i ] );
        }
    } );

    it( 'MOVD', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        d2.update( 123, 456, 789 );
        sil.MOVD.call( this.vm, d1, d2 );
        assert.deepEqual( d1.raw(), [ 123, 456, 789 ] );
    } );

    it( 'MOVDIC', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            N1 = 3,
            N2 = 4;
        this.vm.alloc( 11 );
        var src = this.vm.d();
        d2.addr = src.ptr - N2;
        this.vm.alloc( 7 );
        var dst = this.vm.d();
        d1.addr = dst.ptr - N1;
        src.update( 4, 5, 6 );
        sil.MOVDIC.call( this.vm, d1, N1, d2, N2 );
        assert.deepEqual( dst.raw(), src.raw() );
    } );

    it( 'PUTD', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            d3 = this.vm.d();
        this.vm.alloc( 7 );
        d1.addr = this.vm.alloc( 9 );
        this.vm.alloc( 5 );
        var dst = this.vm.d();
        d2.addr = dst.ptr - d1.addr;
        d3.update( 555, 666, 777 );
        sil.PUTD.call( this.vm, d1, d2, d3 );
        assert.deepEqual( d3.raw(), dst.raw() );
    } );

    it( 'PUTDC', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        this.vm.alloc( 50 );
        d1.addr = this.vm.alloc( 25 );
        this.vm.alloc( 17 );
        var dst = this.vm.d(),
            N = dst.ptr - d1.addr;
        d2.update( 555, 666, 777 );
        sil.PUTDC.call ( this.vm, d1, N, d2 );
        assert.deepEqual( dst.raw(), d2.raw() );
    } );

    it( 'ZERBLK', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        this.vm.alloc( 60 );
        var before = this.vm.d(),
            ptr = this.vm.alloc( 60, 1 ),
            after = this.vm.d();
        before.update( 1, 1, 1 );
        after.update( 1, 1, 1 );

        d1.addr = ptr;
        d2.addr = 19 * 3;

        sil.ZERBLK.call( this.vm, d1, d2 );
        assert.deepEqual( before.raw(), [ 1, 1, 1 ] );
        for ( var i = ptr; i < after.ptr; i++ ) {
            assert.equal( this.vm.mem[i], 0, `mem at position ${i}` );
        }
        assert.deepEqual( after.raw(), [ 1, 1, 1 ] );
    } );
} );


describe( 'Macros that Modify Address Fields of Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ADJUST', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            d3 = this.vm.d(),
            di = this.vm.d();
        di.addr = 5;
        d2.addr = di.ptr;
        d3.addr = 7;
        sil.ADJUST.call( this.vm, d1, d2, d3 );
        assert.equal( d1.addr, d3.addr + di.addr );
    } );

    it( 'BKSIZE', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            di = this.vm.d(),
            FV;
        this.vm.define( 'STTL', 1 << 4 );
        d2.addr = di.ptr;

        // F contains STTL
        di.update( 3, 1 << 4, 5 );
        sil.BKSIZE.call( this.vm, d1, d2 );
        FV = 3 * (4 + Math.floor((di.value - 1) / 3 + 1));
        assert.deepEqual( d1.raw(), [ FV, 0, 0 ] );

        // F does not contain STTL
        di.update( 3, 0, 5 );
        sil.BKSIZE.call( this.vm, d1, d2 );
        FV = di.value + 3;
        assert.deepEqual( d1.raw(), [ FV, 0, 0 ] );
    } );

    it( 'DECRA', function () {
        var d = this.vm.d();
        d.addr = 55;
        sil.DECRA.call( this.vm, d, 33 );
        assert.equal( d.addr, 22 );
        sil.DECRA.call( this.vm, d, 44 );
        assert.equal( d.addr, -22 );
    } );

    it( 'GETAC', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            N = 5;
        this.vm.alloc( 10 );
        var src = this.vm.d();
        d2.addr = src.ptr - N;
        src.addr = 123;
        sil.GETAC.call( this.vm, d1, d2, N );
        assert.equal( d1.addr, src.addr );
    } );

    it( 'GETLG', function () {
        var s = this.vm.s(),
            d = this.vm.d();
        s.length = 1212;
        sil.GETLG.call( this.vm, d, s );
        assert.deepEqual( d.raw(), [ s.length, 0, 0 ] );
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

    it( 'GETSIZ', function () {
        var d_indirect = sil.DESCR.call( this.vm, 123, 456, 789 ),
            d1 = sil.DESCR.call( this.vm, 0, 0, 0 ),
            d2 = sil.DESCR.call( this.vm, d_indirect, 0, 0 );

        sil.GETSIZ.call( this.vm, d1, d2 );
        assert.equal( this.vm.d( d1 ).addr, this.vm.d( d_indirect ).value );
    } );

    it( 'INCRA', function () {
        var d = sil.DESCR.call( this.vm, 123, 0, 0 );
        sil.INCRA.call( this.vm, d, 10 );
        assert.equal( this.vm.d( d ).addr, 133 );
    } );

    it( 'MOVA', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        d2.addr = 999;
        sil.MOVA.call( this.vm, d1, d2 );
        assert.equal( d1.addr, d2.addr );
    } );

    it( 'PUTAC', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        this.vm.alloc( 100 );
        d1.addr = 15;
        var d3 = this.vm.d(),
            N = d3.ptr - d1.addr;
        d2.addr = 789;
        sil.PUTAC.call( this.vm, d1, N, d2 );
        assert.equal( d3.addr, d2.addr );
    } );

    it( 'SETAC', function () {
        var d = this.vm.d(),
            N = 123;
        d.update( 5, 6, 7 );
        sil.SETAC.call( this.vm, d, N );
        assert.equal( d.addr, N );
    } );

    it( 'SETAV', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        d1.update( 1, 2, 3 );
        d2.update( 5, 6, 7 );
        sil.SETAV.call( this.vm, d1, d2 );
        assert.deepEqual( d1.raw(), [ d2.value, 0, 0 ] );
    } );
} );


describe( 'Macros that Modify Value Fields of Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'INCRV', function () {
        var d = this.vm.d(),
            N = 55;
        d.value = 44;
        sil.INCRV.call( this.vm, d, N );
        assert.equal( d.value, 55 + 44 );
    } );

    it( 'MOVV', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        d2.value = 999;
        sil.MOVV.call( this.vm, d1, d2 );
        assert.equal( d1.value, 999 );
    } );

    it( 'PUTVC', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            N = 3;
        this.vm.alloc( 13 );
        var dst = this.vm.d();
        d1.addr = dst.ptr - N;
        d2.value = 777;
        sil.PUTVC.call( this.vm, d1, N, d2 );
        assert.equal( dst.value, d2.value );
    } );

    it( 'SETSIZ', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            dst = this.vm.d();
        d1.addr = dst.ptr;
        d2.addr = 12345;
        sil.SETSIZ.call( this.vm, d1, d2 );
        assert.equal( dst.value, 12345 );
    } );

    it( 'SETVA', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d();
        d2.addr = 999;
        sil.SETVA.call( this.vm, d1, d2 );
        assert.equal( d1.value, 999 );
    } );

    it( 'SETVC', function () {
        var d = this.vm.d();
        sil.SETVC.call( this.vm, d, 77 );
        assert.equal( d.value, 77 );
    } );
} );


describe( 'Macros that Modify Flag Fields of Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'RESETF', function () {
        var d = this.vm.d();
        d.flags = 0x8 | 0x4 | 0x2;
        sil.RESETF.call( this.vm, d, 0x4 );
        assert.equal( d.flags, 0x8 | 0x2 );
        sil.RESETF.call( this.vm, d, 0x2 );
        assert.equal( d.flags, 0x8 );
    } );

    it( 'RSETFI', function () {
        var d = this.vm.d(),
            FLAG = 4;

        this.vm.alloc( 50 );
        var a = this.vm.d();
        d.addr = a.ptr;
        a.flags |= 5;
        sil.RSETFI.call( this.vm, d, 4 );
        assert.equal( a.flags, 1 );
        sil.RSETFI.call( this.vm, d, 4 );
        assert.equal( a.flags, 1 );
        sil.RSETFI.call( this.vm, d, 1 );
        assert.equal( a.flags, 0 );
    } );

    it( 'SETF', function () {
        var d = this.vm.d();
        sil.SETF.call( this.vm, d, 0x4 );
        assert.equal( d.flags, 0x4 );
        sil.SETF.call( this.vm, d, 0x8 );
        assert.equal( d.flags, 0x4 | 0x8 );
        sil.SETF.call( this.vm, d, 0x4 );
        assert.equal( d.flags, 0x4 | 0x8 );
    } );

    it( 'SETFI', function () {
        var d = this.vm.d(),
            dst = this.vm.d();
        d.addr = dst.ptr;
        sil.SETFI.call( this.vm, d, 0x4 );
        assert.equal( dst.flags, 0x4 );
    } );
} );


describe( 'Macros that Perform Integer Arithmetic on Address Fields', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'DIVIDE', function () { // stub
        assert( sil.DIVIDE ); 
    } );

    it( 'EXPINT', function () { // stub
        assert( sil.EXPINT ); 
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

    it( 'SUM', function () {
        const INT32_MAX = 0x7fffffff;
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            d3 = this.vm.d(),
            FLOC = this.vm.ptr( 7 ),
            SLOC = this.vm.ptr( 9 );
        d2.update( 555, 666, 777 );

        // A+I in range:
        d3.addr = 999;
        sil.SUM.call( this.vm, d1, d2, d3, FLOC, SLOC );
        assert.deepEqual( d1.raw(), [ d2.addr + d3.addr, d2.flags, d2.value ] );
        assert.equal( this.vm.instructionPointer, 9 );

        // A+I overflow:
        d3.addr = INT32_MAX;
        sil.SUM.call( this.vm, d1, d2, d3, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 7 );
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

    it( 'GETSPC', function () {
        const N = 10;
        var d = this.vm.d();
        this.vm.alloc( 32 );
        var s = this.vm.s();
        s.update( 11, 22, 33, 44, 55 );
        this.vm.alloc( 32 );
        sil.GETSPC.call( this.vm, s, d, N );
        var s_indirect = this.vm.s( s.addr + N );
        assert.deepEqual( s.raw(), s_indirect.raw() );
    } );

    it( 'PUTSPC', function () {
        var d = this.vm.d(),
            src = this.vm.s();
        d.addr = this.vm.alloc( 100 );
        var dst = this.vm.s();
        src.update( 55, 44, 33, 22, 11 );
        sil.PUTSPC.call( this.vm, d, dst.ptr - d.addr, src );
        assert.deepEqual( src.raw(), dst.raw() );
    } );

    it( 'SETSP', function () {
        var s1 = this.vm.s(),
            s2 = this.vm.s();
        s1.update( 10, 11, 12, 13, 14 );
        s2.update( 20, 21, 22, 23, 24 );
        sil.SETSP.call( this.vm, s1, s2 );
        assert.deepEqual( s1.raw(), [ 20, 21, 22, 23, 24 ] );
        assert.deepEqual( s1.raw(), s2.raw() );
    } );

} );


describe( 'Macros that Operate on Specifiers', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ADDLG', function () {
        var s = this.vm.s(),
            d = this.vm.d();
        s.length = 123;
        d.addr = 5;
        sil.ADDLG.call( this.vm, s, d );
        assert.equal( s.length, 123 + 5 );
    } );

    it( 'APDSP', function () {
        var s1 = this.vm.s( sil.STRING.call( this.vm, 'supercalifragilistic' ) );
        this.vm.alloc( 50 );
        var s2 = this.vm.s( sil.STRING.call( this.vm, 'expialidocious' ) );
        sil.APDSP.call( this.vm, s1, s2 );
        assert.equal( s1.specified, 'supercalifragilisticexpialidocious' );
    } );

    it( 'FSHRTN', function () {
        var s = this.vm.s(),
            N = 4;
        s.update( 4, 5, 6, 7, 8 );
        sil.FSHRTN.call( this.vm, s, N );
        assert.equal( s.offset, 11 );
        assert.equal( s.length, 4 );
    } );

    it( 'GETBAL', function () { // stub
        assert( sil.GETBAL ); 
    } );

    it( 'INTSPC', function () {
        var d = this.vm.d(),
            s = this.vm.s();
        d.addr = -58;
        sil.INTSPC.call( this.vm, s, d );
        assert.equal( s.specified, '-58' );
    } );

    it( 'LOCSP', function () {
        const CPD = 3;
        var s = this.vm.s(),
            d = this.vm.d();

        // A = 0 (empty string)
        d.update( 0, 555, 666 );
        s.update( 1, 2, 3, 4, 5 );
        sil.LOCSP.call( this.vm, s, d );
        assert.deepEqual( s.raw(), [ 1, 2, 3, 4, 0 ] );

        // A != 0
        this.vm.alloc( 100 );
        var di = this.vm.d();
        d.addr = di.ptr;
        di.value = 9;
        sil.LOCSP.call( this.vm, s, d );
        assert.deepEqual( s.raw(), [ d.addr, d.flags, d.value, 4*CPD, di.value ] );
    } );

    it( 'PUTLG', function () {
        var s = this.vm.s(),
            d = this.vm.d();
        d.addr = 123;
        sil.PUTLG.call( this.vm, s, d );
        assert.equal( s.length, d.addr );
    } );

    it( 'REMSP', function () {
        var s1 = this.vm.s(),
            s2 = this.vm.s(),
            s3 = this.vm.s();
        s2.update( 1, 2, 3, 9, 5 );
        s3.update( 1, 2, 3, 4, 2 );
        sil.REMSP.call( this.vm, s1, s2, s3 );
        assert.deepEqual( s1.raw(), [ 1, 2, 3, s2.offset + s3.length, s2.length - s3.length ] );

        // If SPEC1 and SPEC3 are the same:
        s1.update( 0 );
        s2.update( 1, 2, 3, 9, 5 );
        var L3 = s1.length;
        sil.REMSP.call( this.vm, s1, s2, s1 );
        assert.deepEqual( s1.raw(), [ 1, 2, 3, s2.offset + L3, s2.length - L3 ] );
    } );

    it( 'SETLC', function () {
        var s = this.vm.s();
        sil.SETLC.call( this.vm, s, 555 );
        assert.equal( s.length, 555 );
    } );

    it( 'SHORTN', function () {
        var s = this.vm.s(),
            N = 4;
        s.length = 9;
        sil.SHORTN.call( this.vm, s, N );
        assert.equal( s.length, 5 );
    } );

    it( 'STREAM', function () {
        var s1 = this.vm.s(),
            s2 = this.vm.s( sil.STRING.call( this.vm, '43.2   ' ) );

        this.vm.run( [
            [ 'STYPE',  'DESCR',  mkargs( this.vm ) ],
            [ 'FLITYP', 'EQU',    mkargs( this.vm, 6 ) ],
            [ null,     'STREAM', mkargs( this.vm, s1.ptr, s2.ptr, 'INTGTB', -1, -2, -3 ) ]
        ] );

        assert.equal( s1.specified, '43.2' );
    } );

    it( 'SUBSP', function () {
        var s1 = this.vm.s(),
            s2 = this.vm.s(),
            s3 = this.vm.s(),
            FLOC = this.vm.ptr( 1 ),
            SLOC = this.vm.ptr( 2 );
        // L3 > L2
        s2.update( 5, 2, 3, 4, 5 );
        s3.update( 6, 7, 8, 9, 8 );
        sil.SUBSP.call( this.vm, s1, s2, s3, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 2 );
        assert.deepEqual( s1.raw(), [ 6, 7, 8, 9, 5 ] );

        // L3 == L2
        s3.length = 5;
        s1.update( 0 );
        sil.SUBSP.call( this.vm, s1, s2, s3, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 2 );
        assert.deepEqual( s1.raw(), [ 6, 7, 8, 9, 5 ] );

        // L3 < L2
        s3.length = 2;
        s1.update( 0 );
        sil.SUBSP.call( this.vm, s1, s2, s3, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        assert.deepEqual( s1.raw(), [ 0, 0, 0, 0, 0 ] );

        assert( sil.SUBSP ); 
    } );

    it( 'TRIMSP', function () {
        var s1 = this.vm.s(),
            s2 = this.vm.s( this.vm.specify( 'abcd   ' ) );

        sil.TRIMSP.call( this.vm, s1, s2 );
        assert.equal( s2.specified, 'abcd   ' );
        assert.equal( s1.specified, 'abcd' );

        this.vm.specify( 'efgh', s2 );
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

    it( 'DATE', function () {
        var s = this.vm.s(),
            year = new Date().getFullYear();
        sil.DATE.call( this.vm, s );
        assert( s.specified.includes( year ) );
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

    it( 'MSTIME', function () {
        var d = this.vm.d();
        d.update( 1, 2, 3 );
        sil.MSTIME.call( this.vm, d );
        assert.deepEqual( d.raw(), [ 0, 0, 0 ] );
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

    it( 'SPCINT', function () {
        var d = this.vm.d(),
            s = this.vm.s(),
            FLOC = this.vm.ptr( 1 ),
            SLOC = this.vm.ptr( 2 ),
            I = 6;
        this.vm.define( 'I', I );
        this.vm.specify( '-00521', s );
        sil.SPCINT.call( this.vm, d, s, FLOC, SLOC );
        assert.equal( d.addr, -521 );
        assert.equal( d.flags, 0 );
        assert.equal( d.value, I );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'TOP', function () {
        var d1 = this.vm.d(),
            d2 = this.vm.d(),
            d3 = this.vm.d(),
            block = [],
            TTL = 1 << 4;
        this.vm.define( 'TTL', TTL );
        for ( var i = 0; i < 10; i++ ) {
            block.push(this.vm.d());
        }

        // N = 6
        d3.update( block.at( -1 ).ptr, 123, 456 );
        block.at( -7 ).flags |= TTL;
        sil.TOP.call( this.vm, d1, d2, d3 );
        assert.equal( d2.addr, 6 * 3 );
        assert.deepEqual( d1.raw(), [ block.at( -7 ).ptr, 123, 456 ] );
        assert.equal( d3.addr - d2.addr, d1.addr );

        // N = 0
        block.at( -1 ).flags |= TTL;
        sil.TOP.call( this.vm, d1, d2, d3 );
        assert.equal( d2.addr, 0 );
        assert.deepEqual( d1.raw(), [ block.at( -1 ).ptr, 123, 456 ] );
        assert.equal( d3.addr - d2.addr, d1.addr );
    } );

    it( 'VARID', function () {
        var d = this.vm.d(),
            s = this.vm.s( sil.STRING.call( this.vm, 'hello' ) );

        sil.VARID.call( this.vm, d, s );
        assert.equal( d.addr, 226 );
        assert.equal( d.value, 3679317 );
    } );
} );
