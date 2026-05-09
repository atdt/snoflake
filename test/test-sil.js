import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import SNOBOL from '../src/snobol.js';
import process from "node:process";

const slice = Array.prototype.slice;

Object.keys( SNOBOL ).forEach( function ( k ) {
    globalThis[k] = SNOBOL[k];
} );

//
// Scaffolds
//

function mkargs( vm ) {
    // Construct a deferred operands object
    const args = [].slice.call( arguments, 1 );

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
        assert.equal( this.vm.resolve('B') - this.vm.resolve('A'), this.vm.$( 'DESCR' ) );
        assert.deepEqual( this.vm.d( 'A' ).raw(), [ 0, 0, 0 ] );
        assert.deepEqual( this.vm.d( 'B' ).raw(), [ 0, 0, 0 ] );
    } );

    it( 'keeps executable labels in the instruction stream', function () {
        this.vm.run( [
            [ 'PAD', 'BUFFER', mkargs( this.vm, 10 ) ],
            [ 'DS',  'DESCR',  mkargs( this.vm ) ],
            [ null,  'BRANCH', mkargs( this.vm, 'LBL' ) ],
            [ null,  'SETAC',  mkargs( this.vm, 'DS', 11 ) ],
            [ 'LBL', 'SETAC',  mkargs( this.vm, 'DS', 22 ) ],
            [ null,  'END',    mkargs( this.vm ) ]
        ] );

        // BUFFER and DESCR assemble data, but do not occupy runtime
        // instruction slots.
        assert.equal( this.vm.resolve( 'LBL' ), 2 );
        assert.equal( this.vm.d( 'DS' ).addr, 22 );
    } );

    it( 'resolves forward labels in assembled descriptor data', function () {
        this.vm.run( [
            [ 'DS',     'DESCR', mkargs( this.vm, 'VALUE' ) ],
            [ 'SP',     'SPEC',  mkargs( this.vm, 'VALUE', 0, 0, 0, 0 ) ],
            [ 'VALUE',  'EQU',   mkargs( this.vm, 123 ) ],
            [ null,     'END',   mkargs( this.vm ) ]
        ] );

        assert.equal( this.vm.d( 'DS' ).addr, 123 );
        assert.equal( this.vm.s( 'SP' ).addr, 123 );
    } );

    it( 'TITLE', function () {
        assert( sil.TITLE );
    } );
} );

describe( 'Macros that Assemble Data', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'ARRAY', function () {
        const allocated = this.vm.memPtr;
        sil.ARRAY.call( this.vm, 18 );
        assert.equal( this.vm.memPtr, allocated + ( 18 * 3 ) );
    } );

    it( 'BUFFER', function () {
        const s = this.vm.s();
        s.addr = sil.BUFFER.call( this.vm, 4 );
        s.length = 4;
        assert.equal( s.specified, '    ' );
    } );

    it( 'DESCR', function () {
        const ptr = sil.DESCR.call( this.vm, 1976, 1983, 2011 ),
              d = this.vm.d( ptr );
        assert.equal( d.addr, 1976 );
        assert.equal( d.flags, 1983 );
        assert.equal( d.value, 2011 );

    } );

    it( 'SPEC', function () {
        const A = 55, F = 66, V = 77, O = 88, L = 99,
              s = this.vm.s( sil.SPEC.call( this.vm, A, F, V, O, L ) );
        assert.deepEqual( s.raw(), [ A, F, V, O, L ] );
    } );

    it( 'STRING', function () {
        const ptr = sil.STRING.call( this.vm, 'Bananaphone' );
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
        const d1 = this.vm.d(),
              d2 = this.vm.d();
        d1.addr = d2.ptr;
        d2.addr = 1234;
        sil.BRANIC.call( this.vm, d1, 0 );
        assert.equal( this.vm.instructionPointer, 1234 );
    } );

    it( 'SELBRA', function () {
        const d = this.vm.d(),
              LOC1 = 222,
              LOC2 = 333,
              LOC3 = 555;
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
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              GTLOC = 1,
              EQLOC = 2,
              LTLOC = 3;
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
        const DESCR = this.vm.d(),
              N = 4,
              NELOC = 1,
              EQLOC = 2;

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
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              NELOC = 1,
              EQLOC = 2;

        d1.addr = 123;
        d2.addr = 456;
        sil.AEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d2.addr = d1.addr;
        sil.AEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'AEQLC', function () {
        const d = this.vm.d(),
              N = 1000,
              NELOC = 1,
              EQLOC = 2;
        d.addr = -1000;
        sil.AEQLC.call( this.vm, d, N, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d.addr = N;
        sil.AEQLC.call( this.vm, d, N, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'AEQLIC', function () {
        const NELOC = 1,
              EQLOC = 2,
              N1 = 50,
              N2 = 0;
        const d1 = this.vm.d();
        this.vm.alloc( 77 );
        const d2 = this.vm.d();

        d1.addr = d2.ptr - N1;
        d2.addr = N2 - 500;
        sil.AEQLIC.call( this.vm, d1, N1, N2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d2.addr = N2;
        sil.AEQLIC.call( this.vm, d1, N1, N2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'CHKVAL', function () {
        const s = this.vm.s(),
              d1 = this.vm.d(),
              d2 = this.vm.d(),
              GTLOC = 1,
              LTLOC = 2,
              EQLOC = 3;

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

        s.length = 0;
        d1.addr = 0;
        d2.addr = 0;
        sil.CHKVAL.call( this.vm, d1, d2, s, GTLOC, EQLOC, LTLOC );
        assert.equal( this.vm.instructionPointer, 3 );
    } );

    it( 'DEQL', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              EQLOC = 1,
              NELOC = 2;

        d1.update( 123, 456, 789 );
        d2.read( d1 );
        sil.DEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d1.addr = 555;
        sil.DEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'LCOMP', function () {
        const s1 = this.vm.s(),
              s2 = this.vm.s(),
              GTLOC = 1,
              EQLOC = 2,
              LTLOC = 3;
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
        const s = this.vm.s(),
              NELOC = 20,
              EQLOC = 30,
              N = 333;
        s.length = N;
        sil.LEQLC.call( this.vm, s, N, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 30 );
        sil.LEQLC.call( this.vm, s, N + 5, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 20 );
    } );

    it( 'LEXCMP', function () {
        const SPEC1 = this.vm.s(),
              SPEC2 = this.vm.s(),
              GTLOC = 1,
              EQLOC = 2,
              LTLOC = 3;

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

        this.vm.instructionPointer = 0;
        sil.LEXCMP.call( this.vm, SPEC1, SPEC2, GTLOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 0 );
    } );

    it( 'TESTF', function () {
        const d = this.vm.d(),
              FLAG = 4,
              FLOC = 1,
              SLOC = 2;
        sil.TESTF.call( this.vm, d, FLAG, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d.flags |= FLAG;
        sil.TESTF.call( this.vm, d, FLAG, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'TESTFI', function () {
        const d = this.vm.d(),
              FLAG = 4,
              FLOC = 1,
              SLOC = 2;
        this.vm.alloc( 50 );
        const da = this.vm.d();
        d.addr = da.ptr;
        sil.TESTFI.call( this.vm, d, FLAG, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        da.flags |= FLAG;
        sil.TESTFI.call( this.vm, d, FLAG, FLOC, SLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'VCMPIC', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              N = 5,
              GTLOC = 10,
              EQLOC = 20,
              LTLOC = 30;
        this.vm.alloc( 30 );
        const src = this.vm.d();
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
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              NELOC = 1,
              EQLOC = 2;
        d1.value = 123;
        d2.value = 456;
        sil.VEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 1 );
        d1.value = d2.value;
        sil.VEQL.call( this.vm, d1, d2, NELOC, EQLOC );
        assert.equal( this.vm.instructionPointer, 2 );
    } );

    it( 'VEQLC', function () {
        const d = this.vm.d(),
              N = 555,
              NELOC = 1,
              EQLOC = 2;
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

    it( 'ISTACK', function () {
        sil.ISTACK.call( this.vm );
        assert.equal( this.vm.d( 'OSTACK' ).addr, 0 );
        assert.equal( this.vm.d( 'CSTACK' ).addr, this.vm.$( 'STACK' ) );
    } );

    it( 'POP', function () {
        const d1 = this.vm.d(),
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

    it( 'PSTACK', function () {
        const d = this.vm.d();
        this.vm.d( 'CSTACK' ).addr = 123;
        sil.PSTACK.call( this.vm, d );
        assert.deepEqual( d.raw(), [ 120, 0, 0 ] );
    } );

    it( 'PUSH', function () {
        const cur = this.vm.CSTACK.addr;
        let d = this.vm.d();
        d.update( 4, 1, 6 );
        sil.PUSH.call( this.vm, d );
        d = this.vm.d( cur + d.width );
        assert.deepEqual( d.raw(), [ 4, 1, 6 ] );
    } );

    it( 'RCALL', function () { // stub
        assert( sil.RCALL ); 
    } );

    it( 'RRTURN', function () { // stub
        assert( sil.RRTURN ); 
    } );

    it( 'SPOP', function () {
        const s1 = this.vm.s(),
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
        const cur = this.vm.CSTACK.addr;
        let s = this.vm.s();

        s.update( 1, 2, 3, 4, 5 );
        sil.SPUSH.call( this.vm, s );

        s = this.vm.s( cur + SNOBOL.D );
        assert.deepEqual( s.raw(), [ 1, 2, 3, 4, 5 ] );
    } );
} );


describe( 'Macros that Move and Set Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'GETD', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              d3 = this.vm.d();
        this.vm.alloc( 111 );
        const src = this.vm.d();
        d2.addr = src.ptr - 55;
        d3.addr = 55;
        src.update( 555, 666, 777 );
        sil.GETD.call( this.vm, d1, d2, d3 );
        assert.deepEqual( src.raw(), d1.raw() );
    } );

    it( 'GETDC', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d();
        d2.addr = 50;
        this.vm.alloc( 111 );
        const di = this.vm.d(),
              N = di.ptr - d2.addr;
        di.update( 4, 5, 6 );
        sil.GETDC.call( this.vm, d1, d2, N );
        assert.deepEqual( d1.raw(), di.raw() );
    } );

    it( 'MOVBLK', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              d3 = this.vm.d();
        this.vm.alloc( 99 );
        d2.addr = this.vm.memPtr - 3;
        for ( let i = 0; i < 10; i++ ) {
            this.vm.d().update( i, i, i );
        }
        d3.addr = 10 * 3;
        // An offset of 9 makes sure source and destination regions overlap.
        d1.addr = d2.addr - 9;
        sil.MOVBLK.call( this.vm, d1, d2, d3 );
        for ( let i = 0; i < 10; i++ ) {
            const ptr = d1.addr + 3 + (3 * i);
            assert.deepEqual( this.vm.d( ptr ).raw(), [ i, i, i ] );
        }
    } );

    it( 'MOVD', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d();
        d2.update( 123, 456, 789 );
        sil.MOVD.call( this.vm, d1, d2 );
        assert.deepEqual( d1.raw(), [ 123, 456, 789 ] );
    } );

    it( 'MOVDIC', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              N1 = 3,
              N2 = 4;
        this.vm.alloc( 11 );
        const src = this.vm.d();
        d2.addr = src.ptr - N2;
        this.vm.alloc( 7 );
        const dst = this.vm.d();
        d1.addr = dst.ptr - N1;
        src.update( 4, 5, 6 );
        sil.MOVDIC.call( this.vm, d1, N1, d2, N2 );
        assert.deepEqual( dst.raw(), src.raw() );
    } );

    it( 'PUTD', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              d3 = this.vm.d();
        this.vm.alloc( 7 );
        d1.addr = this.vm.alloc( 9 );
        this.vm.alloc( 5 );
        const dst = this.vm.d();
        d2.addr = dst.ptr - d1.addr;
        d3.update( 555, 666, 777 );
        sil.PUTD.call( this.vm, d1, d2, d3 );
        assert.deepEqual( d3.raw(), dst.raw() );
    } );

    it( 'PUTDC', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d();
        this.vm.alloc( 50 );
        d1.addr = this.vm.alloc( 25 );
        this.vm.alloc( 17 );
        const dst = this.vm.d(),
              N = dst.ptr - d1.addr;
        d2.update( 555, 666, 777 );
        sil.PUTDC.call ( this.vm, d1, N, d2 );
        assert.deepEqual( dst.raw(), d2.raw() );
    } );

    it( 'ZERBLK', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d();
        this.vm.alloc( 60 );
        const before = this.vm.d(),
              ptr = this.vm.alloc( 60, 1 ),
              after = this.vm.d();
        before.update( 1, 1, 1 );
        after.update( 1, 1, 1 );

        d1.addr = ptr;
        d2.addr = 19 * 3;

        sil.ZERBLK.call( this.vm, d1, d2 );
        assert.deepEqual( before.raw(), [ 1, 1, 1 ] );
        for ( let i = ptr; i < after.ptr; i++ ) {
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
        const d1 = this.vm.d(),
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
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              di = this.vm.d();
        let FV;
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
        const d = this.vm.d();
        d.addr = 55;
        sil.DECRA.call( this.vm, d, 33 );
        assert.equal( d.addr, 22 );
        sil.DECRA.call( this.vm, d, 44 );
        assert.equal( d.addr, -22 );
    } );

    it( 'GETAC', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              N = 5;
        this.vm.alloc( 10 );
        const src = this.vm.d();
        d2.addr = src.ptr - N;
        src.addr = 123;
        sil.GETAC.call( this.vm, d1, d2, N );
        assert.equal( d1.addr, src.addr );
    } );

    it( 'GETLG', function () {
        const s = this.vm.s(),
              d = this.vm.d();
        s.length = 1212;
        sil.GETLG.call( this.vm, d, s );
        assert.deepEqual( d.raw(), [ s.length, 0, 0 ] );
    } );

    it( 'GETLTH', function () {
        const s = 'Beauty is truth, truth beauty',
              d1 = this.vm.d(),
              d2 = this.vm.d();
        d2.addr = s.length;
        const len = SNOBOL.str.encode( s ).length + 9;
        sil.GETLTH.call( this.vm, d1, d2 );
        assert.equal( d1.addr, len );
    } );

    it( 'GETSIZ', function () {
        const d_indirect = sil.DESCR.call( this.vm, 123, 456, 789 ),
              d1 = sil.DESCR.call( this.vm, 0, 0, 0 ),
              d2 = sil.DESCR.call( this.vm, d_indirect, 0, 0 );

        sil.GETSIZ.call( this.vm, d1, d2 );
        assert.equal( this.vm.d( d1 ).addr, this.vm.d( d_indirect ).value );
    } );

    it( 'INCRA', function () {
        const d = sil.DESCR.call( this.vm, 123, 0, 0 );
        sil.INCRA.call( this.vm, d, 10 );
        assert.equal( this.vm.d( d ).addr, 133 );
    } );

    it( 'MOVA', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d();
        d1.addr = 111;
        d2.addr = 999;
        sil.MOVA.call( this.vm, d1, d2 );
        assert.equal( d1.addr, 999 );
        assert.equal( d2.addr, 999 );
    } );

    it( 'PUTAC', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d();
        this.vm.alloc( 100 );
        d1.addr = 15;
        const d3 = this.vm.d(),
              N = d3.ptr - d1.addr;
        d2.addr = 789;
        sil.PUTAC.call( this.vm, d1, N, d2 );
        assert.equal( d3.addr, d2.addr );
    } );

    it( 'SETAC', function () {
        const d = this.vm.d(),
              N = 123;
        d.update( 5, 6, 7 );
        sil.SETAC.call( this.vm, d, N );
        assert.equal( d.addr, N );
    } );

    it( 'SETAV', function () {
        const d1 = this.vm.d(),
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
        const d = this.vm.d(),
              N = 55;
        d.value = 44;
        sil.INCRV.call( this.vm, d, N );
        assert.equal( d.value, 55 + 44 );
    } );

    it( 'MOVV', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d();
        d2.value = 999;
        sil.MOVV.call( this.vm, d1, d2 );
        assert.equal( d1.value, 999 );
    } );

    it( 'PUTVC', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              N = 3;
        this.vm.alloc( 13 );
        const dst = this.vm.d();
        d1.addr = dst.ptr - N;
        d2.value = 777;
        sil.PUTVC.call( this.vm, d1, N, d2 );
        assert.equal( dst.value, d2.value );
    } );

    it( 'SETSIZ', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              dst = this.vm.d();
        d1.addr = dst.ptr;
        d2.addr = 12345;
        sil.SETSIZ.call( this.vm, d1, d2 );
        assert.equal( dst.value, 12345 );
    } );

    it( 'SETVA', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d();
        d2.addr = 999;
        sil.SETVA.call( this.vm, d1, d2 );
        assert.equal( d1.value, 999 );
    } );

    it( 'SETVC', function () {
        const d = this.vm.d();
        sil.SETVC.call( this.vm, d, 77 );
        assert.equal( d.value, 77 );
    } );

    it( 'SETVC accepts zero', function () {
        const d = this.vm.d();
        d.value = 77;
        sil.SETVC.call( this.vm, d, 0 );
        assert.equal( d.value, 0 );
    } );
} );


describe( 'Macros that Modify Flag Fields of Descriptors', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'RESETF', function () {
        const d = this.vm.d();
        d.flags = 0x8 | 0x4 | 0x2;
        sil.RESETF.call( this.vm, d, 0x4 );
        assert.equal( d.flags, 0x8 | 0x2 );
        sil.RESETF.call( this.vm, d, 0x2 );
        assert.equal( d.flags, 0x8 );
    } );

    it( 'RSETFI', function () {
        const d = this.vm.d();

        this.vm.alloc( 50 );
        const a = this.vm.d();
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
        const d = this.vm.d();
        sil.SETF.call( this.vm, d, 0x4 );
        assert.equal( d.flags, 0x4 );
        sil.SETF.call( this.vm, d, 0x8 );
        assert.equal( d.flags, 0x4 | 0x8 );
        sil.SETF.call( this.vm, d, 0x4 );
        assert.equal( d.flags, 0x4 | 0x8 );
    } );

    it( 'SETFI', function () {
        const d = this.vm.d(),
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
        const INT32_MAX = 0x7fffffff,
              d1 = this.vm.d(),
              d2 = this.vm.d(),
              d3 = this.vm.d(),
              FLOC = 7,
              SLOC = 9;
        d2.update( 555, 666, 777 );

        // A+I in range:
        d3.addr = 999;
        sil.SUM.call( this.vm, d1, d2, d3, FLOC, SLOC );
        assert.deepEqual( d1.raw(), [ d2.addr + d3.addr, d2.flags, d2.value ] );
        assert.equal( this.vm.instructionPointer, 9 );

        // A+I overflow:
        d1.update( 11, 22, 33 );
        d3.addr = INT32_MAX;
        sil.SUM.call( this.vm, d1, d2, d3, FLOC, SLOC );
        assert.deepEqual( d1.raw(), [ 11, 22, 33 ] );
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
        const d = this.vm.d(), s = sil.STRING.call( this.vm, '-0.5' );
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
        const N = 10,
              d = this.vm.d();
        this.vm.alloc( 32 );
        const s = this.vm.s();
        s.update( 11, 22, 33, 44, 55 );
        this.vm.alloc( 32 );
        sil.GETSPC.call( this.vm, s, d, N );
        const s_indirect = this.vm.s( s.addr + N );
        assert.deepEqual( s.raw(), s_indirect.raw() );
    } );

    it( 'PUTSPC', function () {
        const d = this.vm.d(),
              src = this.vm.s();
        d.addr = this.vm.alloc( 100 );
        const dst = this.vm.s();
        src.update( 55, 44, 33, 22, 11 );
        sil.PUTSPC.call( this.vm, d, dst.ptr - d.addr, src );
        assert.deepEqual( src.raw(), dst.raw() );
    } );

    it( 'SETSP', function () {
        const s1 = this.vm.s(),
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
        const s = this.vm.s(),
              d = this.vm.d();
        s.length = 123;
        d.addr = 5;
        sil.ADDLG.call( this.vm, s, d );
        assert.equal( s.length, 123 + 5 );
    } );

    it( 'ADDLG accepts a zero increment', function () {
        const s = this.vm.s(),
              d = this.vm.d();
        s.length = 123;
        d.addr = 0;
        sil.ADDLG.call( this.vm, s, d );
        assert.equal( s.length, 123 );
    } );

    it( 'APDSP', function () {
        const s1 = this.vm.s( sil.STRING.call( this.vm, 'supercalifragilistic' ) );
        this.vm.alloc( 50 );
        const s2 = this.vm.s( sil.STRING.call( this.vm, 'expialidocious' ) );
        sil.APDSP.call( this.vm, s1, s2 );
        assert.equal( s1.specified, 'supercalifragilisticexpialidocious' );
    } );

    it( 'APDSP keeps logical length separate from descriptor padding', function () {
        const s1 = this.vm.s( sil.STRING.call( this.vm, '99' ) );

        this.vm.alloc( 50 );
        const s2 = this.vm.s( sil.STRING.call( this.vm, ' bottles of beer' ) );
        sil.APDSP.call( this.vm, s1, s2 );

        assert.equal( s1.length, '99 bottles of beer'.length );
        assert.equal( s1.specified, '99 bottles of beer' );
    } );

    it( 'FSHRTN', function () {
        const s = this.vm.s(),
              N = 4;
        s.update( 4, 5, 6, 7, 8 );
        sil.FSHRTN.call( this.vm, s, N );
        assert.equal( s.offset, 11 );
        assert.equal( s.length, 4 );
    } );

    it( 'GETBAL consumes the shortest balanced substring', function () {
        const spec = this.vm.s(),
              max = this.vm.d(),
              SLOC = 111,
              FLOC = 222;

        this.vm.specify( '(A*(B+C))-Z', spec );
        spec.length = 0;
        max.addr = '(A*(B+C))-Z'.length;

        sil.GETBAL.call( this.vm, spec, max, FLOC, SLOC );

        assert.equal( this.vm.instructionPointer, SLOC );
        assert.equal( spec.specified, '(A*(B+C))' );
    } );

    it( 'GETBAL consumes one non-parenthesis character', function () {
        const spec = this.vm.s(),
              max = this.vm.d(),
              SLOC = 111,
              FLOC = 222;

        this.vm.specify( 'ABC', spec );
        spec.length = 0;
        max.addr = 3;

        sil.GETBAL.call( this.vm, spec, max, FLOC, SLOC );

        assert.equal( this.vm.instructionPointer, SLOC );
        assert.equal( spec.specified, 'A' );
    } );

    it( 'GETBAL fails on right parenthesis', function () {
        const spec = this.vm.s(),
              max = this.vm.d(),
              SLOC = 111,
              FLOC = 222;

        this.vm.specify( ')ABC', spec );
        spec.length = 0;
        max.addr = 4;

        sil.GETBAL.call( this.vm, spec, max, FLOC, SLOC );

        assert.equal( this.vm.instructionPointer, FLOC );
        assert.equal( spec.specified, '' );
    } );

    it( 'INTSPC', function () {
        const d = this.vm.d(),
              s = this.vm.s();
        d.addr = -58;
        sil.INTSPC.call( this.vm, s, d );
        assert.equal( s.specified, '-58' );
        assert.equal( s.length, 3 );
    } );

    it( 'INTSPC uses a private conversion buffer', function () {
        const d = this.vm.d(),
              s = this.vm.s();

        this.vm.specify( 'abc', s );
        const original = s.addr;
        d.addr = 42;

        sil.INTSPC.call( this.vm, s, d );

        assert.equal( s.specified, '42' );
        assert.notEqual( s.addr, original );
        assert.equal( SNOBOL.str.decode( this.vm.mem.slice( original, original + 3 ) ), 'abc' );
    } );

    it( 'LOCSP', function () {
        const CPD = 3,
              s = this.vm.s(),
              d = this.vm.d();

        // A = 0 (empty string)
        d.update( 0, 555, 666 );
        s.update( 1, 2, 3, 4, 5 );
        sil.LOCSP.call( this.vm, s, d );
        assert.deepEqual( s.raw(), [ 1, 2, 3, 4, 0 ] );

        // A != 0
        this.vm.alloc( 100 );
        const di = this.vm.d();
        d.addr = di.ptr;
        di.value = 9;
        sil.LOCSP.call( this.vm, s, d );
        assert.deepEqual( s.raw(), [ d.addr, d.flags, d.value, 4*CPD, di.value ] );
    } );

    it( 'PUTLG', function () {
        const s = this.vm.s(),
              d = this.vm.d();
        d.addr = 123;
        sil.PUTLG.call( this.vm, s, d );
        assert.equal( s.length, d.addr );
    } );

    it( 'REMSP', function () {
        const s1 = this.vm.s(),
              s2 = this.vm.s(),
              s3 = this.vm.s();
        s2.update( 1, 2, 3, 9, 5 );
        s3.update( 1, 2, 3, 4, 2 );
        sil.REMSP.call( this.vm, s1, s2, s3 );
        assert.deepEqual( s1.raw(), [ 1, 2, 3, s2.offset + s3.length, s2.length - s3.length ] );

        // If SPEC1 and SPEC3 are the same:
        s1.update( 0 );
        s2.update( 1, 2, 3, 9, 5 );
        const L3 = s1.length;
        sil.REMSP.call( this.vm, s1, s2, s1 );
        assert.deepEqual( s1.raw(), [ 1, 2, 3, s2.offset + L3, s2.length - L3 ] );
    } );

    it( 'SETLC', function () {
        const s = this.vm.s();
        sil.SETLC.call( this.vm, s, 555 );
        assert.equal( s.length, 555 );
    } );

    it( 'SHORTN', function () {
        const s = this.vm.s(),
              N = 4;
        s.length = 9;
        sil.SHORTN.call( this.vm, s, N );
        assert.equal( s.length, 5 );
    } );

    it( 'STREAM', function () {
        const s1 = this.vm.s(),
              s2 = this.vm.s( sil.STRING.call( this.vm, '43.2   ' ) ),
              logs = [],
              log = console.log;

        console.log = function () {
            logs.push( slice.call( arguments ) );
        };
        try {
            this.vm.run( [
                [ 'STYPE',  'DESCR',  mkargs( this.vm ) ],
                [ 'FLITYP', 'EQU',    mkargs( this.vm, 6 ) ],
                [ null,     'STREAM', mkargs( this.vm, s1.ptr, s2.ptr, 'INTGTB', -1, -2, -3 ) ]
            ] );
        } finally {
            console.log = log;
        }

        assert.equal( s1.specified, '43.2' );
        assert.deepEqual( logs, [] );
    } );

    it( 'STREAM runout', function () {
        const s1 = this.vm.s(),
              s2 = this.vm.s( sil.STRING.call( this.vm, '   ' ) ),
              stype = this.vm.d(),
              error = 1,
              runout = 2,
              sloc = 3;

        this.vm.define( 'STYPE', stype.ptr );
        this.vm.define( 'EQTYP', 4 );
        sil.STREAM.call( this.vm, s1, s2, SNOBOL.tableNames.indexOf( 'IBLKTB' ), error, runout, sloc );

        assert.equal( this.vm.instructionPointer, 2 );
        assert.equal( stype.addr, 0 );
        assert.equal( s1.specified, '   ' );
        assert.equal( s2.length, 0 );
    } );

    it( 'STREAM stop branches to success after consuming token', function () {
        const s1 = this.vm.s(),
              s2 = this.vm.s( sil.STRING.call( this.vm, ' = X' ) ),
              stype = this.vm.d(),
              error = 1,
              runout = 2,
              sloc = 3;

        this.vm.define( 'STYPE', stype.ptr );
        this.vm.define( 'EQTYP', 4 );
        sil.STREAM.call( this.vm, s1, s2, SNOBOL.tableNames.indexOf( 'IBLKTB' ), error, runout, sloc );

        assert.equal( this.vm.instructionPointer, 3 );
        assert.equal( stype.addr, this.vm.$( 'EQTYP' ) );
        assert.equal( s1.specified, ' =' );
        assert.equal( s2.specified, ' X' );
    } );

    it( 'SUBSP', function () {
        const s1 = this.vm.s(),
              s2 = this.vm.s(),
              s3 = this.vm.s(),
              FLOC = 1,
              SLOC = 2;
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
        const s1 = this.vm.s(),
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

    it( 'CLERTB resolves a table id and fills character entries', function () {
        const original = SNOBOL.syntaxTables.SNABTB;

        try {
            sil.CLERTB.call( this.vm, SNOBOL.tableNames.indexOf( 'SNABTB' ), this.vm.$( 'ERROR' ) );

            assert( SNOBOL.syntaxTables.SNABTB.length >= SNOBOL.programSymbols.ALPHSZ );
            assert( SNOBOL.syntaxTables.SNABTB.every( function ( entry ) {
                return entry[2] === 'ERROR';
            } ) );
        } finally {
            SNOBOL.syntaxTables.SNABTB = original;
        }
    } );

    it( 'PLUGTB updates the entries selected by a specifier', function () {
        const original = SNOBOL.syntaxTables.SNABTB,
              spec = this.vm.s( sil.STRING.call( this.vm, 'AZ' ) );
        let table;

        try {
            sil.CLERTB.call( this.vm, SNOBOL.tableNames.indexOf( 'SNABTB' ), this.vm.$( 'ERROR' ) );
            sil.PLUGTB.call( this.vm, SNOBOL.tableNames.indexOf( 'SNABTB' ), this.vm.$( 'STOP' ), spec );
            table = SNOBOL.syntaxTables.SNABTB;

            assert.equal( table.find( function ( entry ) {
                return entry[0] === 'A';
            } )[2], 'STOP' );
            assert.equal( table.find( function ( entry ) {
                return entry[0] === 'Z';
            } )[2], 'STOP' );
            assert.equal( table.find( function ( entry ) {
                return entry[0] === 'B';
            } )[2], 'ERROR' );
        } finally {
            SNOBOL.syntaxTables.SNABTB = original;
        }
    } );
} );


describe( 'Macros that Construct Pattern Nodes', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'CPYPAT', function () {
        const dst = this.vm.d(),
              src = this.vm.d(),
              shift = this.vm.d(),
              offset = this.vm.d(),
              next = this.vm.d(),
              size = this.vm.d();

        dst.addr = this.vm.alloc( 20 );
        const dstBase = dst.addr;
        src.addr = this.vm.alloc( 20 );
        shift.addr = 100;
        offset.addr = 30;
        next.addr = 60;
        size.addr = 9;

        this.vm.d( src.addr + 3 ).update( 1, 2, 2 );
        this.vm.d( src.addr + 6 ).update( 6, 0, 9 );
        this.vm.d( src.addr + 9 ).update( 12, 0, 15 );

        sil.CPYPAT.call( this.vm, dst, src, shift, offset, next, size );

        assert.deepEqual( this.vm.d( dstBase + 3 ).raw(), [ 1, 2, 2 ] );
        assert.deepEqual( this.vm.d( dstBase + 6 ).raw(), [ 36, 0, 39 ] );
        assert.deepEqual( this.vm.d( dstBase + 9 ).raw(), [ 112, 0, 115 ] );
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

    it( 'ENFILE makes subsequent reads return EOF', function () {
        const file = path.join( os.tmpdir(), 'snoflake-enfile-' + process.pid + '.sno' ),
              unit = this.vm.d(),
              spec = this.vm.s(),
              eof = 1,
              error = 2,
              success = 3,
              ptr = this.vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( file, 'ABCD\nEFGH\n' );
        this.vm.options.file = file;
        unit.addr = 5;
        spec.update( ptr, 0, 0, 0, 4 );

        try {
            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( this.vm.instructionPointer, success );

            sil.ENFILE.call( this.vm, unit );

            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( this.vm.instructionPointer, eof );
            assert.equal( unit.addr, 0 );
        } finally {
            fs.unlinkSync( file );
        }
    } );

    it( 'FORMAT', function () {
        const ptr = sil.FORMAT.call( this.vm, 'test' );
        assert.equal( this.vm.s( ptr ).specified, 'test' );
    } );

    it( 'OUTPUT handles line-printer carriage control', function () {
        const unit = this.vm.d(),
              format = sil.FORMAT.call( this.vm, '(37H1SNOBOL4 (VERSION 3.11, MAY 19, 1975)/8H+_______)' ),
              logs = [],
              oldStdout = this.vm.stdout;

        this.vm.stdout = { write: function ( line ) { logs.push( line ); } };
        try {
            sil.OUTPUT.call( this.vm, unit.ptr, format );
        } finally {
            this.vm.stdout = oldStdout;
        }

        assert.deepEqual( logs, [
            'SNOBOL4 (VERSION 3.11, MAY 19, 1975)',
            '_______'
        ] );
    } );

    it( 'REWIND', function () { // stub
        assert( sil.REWIND ); 
    } );

    it( 'STPRNT handles line-printer carriage control', function () {
        const key = this.vm.d(),
              block = this.vm.d(),
              formatBase = this.vm.alloc( 20 ),
              item = sil.STRING.call( this.vm, 'HELLO' ),
              logs = [],
              oldStdout = this.vm.stdout,
              format = '(1H0,A)';

        block.addr = this.vm.alloc( 9 );
        this.vm.d( block.addr + SNOBOL.D ).addr = 6;
        this.vm.d( block.addr + ( 2 * SNOBOL.D ) ).addr = formatBase;
        this.vm.d( formatBase ).value = format.length;
        for ( let i = 0; i < format.length; i++ ) {
            this.vm.mem[ formatBase + ( 4 * SNOBOL.D ) + i ] = format.charCodeAt( i );
        }

        this.vm.stdout = { write: function ( line ) { logs.push( line ); } };
        try {
            sil.STPRNT.call( this.vm, key.ptr, block.ptr, item );
        } finally {
            this.vm.stdout = oldStdout;
        }

        assert.deepEqual( logs, [ 'HELLO' ] );
    } );

    it( 'STPRNT does not treat letters in format control words as A-conversions', function () {
        const key = this.vm.d(),
              block = this.vm.d(),
              formatBase = this.vm.alloc( 40 ),
              item = sil.STRING.call( this.vm, 'HELLO' ),
              logs = [],
              oldStdout = this.vm.stdout,
              format = '(" " PAUSE,100A1)';

        block.addr = this.vm.alloc( 9 );
        this.vm.d( block.addr + SNOBOL.D ).addr = 6;
        this.vm.d( block.addr + ( 2 * SNOBOL.D ) ).addr = formatBase;
        this.vm.d( formatBase ).value = format.length;
        for ( let i = 0; i < format.length; i++ ) {
            this.vm.mem[ formatBase + ( 4 * SNOBOL.D ) + i ] = format.charCodeAt( i );
        }

        this.vm.stdout = { write: function ( line ) { logs.push( line ); } };
        try {
            sil.STPRNT.call( this.vm, key.ptr, block.ptr, item );
        } finally {
            this.vm.stdout = oldStdout;
        }

        assert.deepEqual( logs, [ 'HELLO' ] );
    } );

    it( 'STPRNT preserves leading data characters when the format starts with A', function () {
        const key = this.vm.d(),
              block = this.vm.d(),
              formatBase = this.vm.alloc( 20 ),
              item = sil.STRING.call( this.vm, '0 DATA' ),
              logs = [],
              oldStdout = this.vm.stdout,
              format = '(121A1)';

        block.addr = this.vm.alloc( 9 );
        this.vm.d( block.addr + SNOBOL.D ).addr = 6;
        this.vm.d( block.addr + ( 2 * SNOBOL.D ) ).addr = formatBase;
        this.vm.d( formatBase ).value = format.length;
        for ( let i = 0; i < format.length; i++ ) {
            this.vm.mem[ formatBase + ( 4 * SNOBOL.D ) + i ] = format.charCodeAt( i );
        }

        this.vm.stdout = { write: function ( line ) { logs.push( line ); } };
        try {
            sil.STPRNT.call( this.vm, key.ptr, block.ptr, item );
        } finally {
            this.vm.stdout = oldStdout;
        }

        assert.deepEqual( logs, [ '0 DATA' ] );
    } );

    it( 'STREAD', function () {
        const file = path.join( os.tmpdir(), 'snoflake-stread-' + process.pid + '.sno' ),
              unit = this.vm.d(),
              spec = this.vm.s(),
              eof = 1,
              error = 2,
              success = 3,
              ptr = this.vm.alloc( 16, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( file, 'END\n1234567890\n' );
        this.vm.options.file = file;
        unit.addr = 5;
        spec.update( ptr, 0, 0, 2, 8 );

        try {
            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( this.vm.instructionPointer, 3 );
            assert.equal( Array.from( this.vm.mem.slice( ptr, ptr + 2 ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), '..' );
            assert.equal( Array.from( this.vm.mem.slice( ptr + 2, ptr + 10 ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'END     ' );

            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( Array.from( this.vm.mem.slice( ptr + 2, ptr + 10 ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), '12345678' );

            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( this.vm.instructionPointer, 1 );
            assert.equal( unit.addr, 0 );

            unit.addr = 5;
            this.vm.instructionPointer = 7;
            sil.REWIND.call( this.vm, unit );
            sil.STREAD.call( this.vm, spec, unit, 7, error, 7 );
            sil.STREAD.call( this.vm, spec, unit, 7, error, 7 );
            sil.STREAD.call( this.vm, spec, unit, 7, error, 7 );
            assert.equal( this.vm.instructionPointer, 7 );
            assert.equal( unit.addr, 0 );
        } finally {
            fs.unlinkSync( file );
        }
    } );

    it( 'STREAD separates source cards from runtime INPUT data', function () {
        const sourceFile = path.join( os.tmpdir(), 'snoflake-stread-source-' + process.pid + '.sno' ),
              inputFile = path.join( os.tmpdir(), 'snoflake-stread-input-' + process.pid + '.txt' ),
              unit = this.vm.d(),
              spec = this.vm.s(),
              eof = this.vm.alloc( 1, 1 ),
              error = this.vm.alloc( 1, 2 ),
              success = this.vm.alloc( 1, 3 ),
              ptr = this.vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( sourceFile, 'SOURCE\n' );
        fs.writeFileSync( inputFile, 'DATA\n' );
        this.vm.options.file = sourceFile;
        this.vm.options.input = inputFile;
        unit.addr = this.vm.$( 'UNITI' );
        spec.update( ptr, 0, 0, 0, 6 );

        try {
            this.vm.currentLabel = 'XLATRN';
            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( Array.from( this.vm.mem.slice( ptr, ptr + 6 ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'SOURCE' );

            this.vm.currentLabel = null;
            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( spec.length, 4 );
            assert.equal( Array.from( this.vm.mem.slice( ptr, ptr + spec.length ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'DATA' );
        } finally {
            fs.unlinkSync( sourceFile );
            fs.unlinkSync( inputFile );
        }
    } );

    it( 'STREAD keeps runtime INPUT record length without discarding significant blanks', function () {
        const inputFile = path.join( os.tmpdir(), 'snoflake-stread-input-blanks-' + process.pid + '.txt' ),
              unit = this.vm.d(),
              spec = this.vm.s(),
              eof = this.vm.alloc( 1, 1 ),
              error = this.vm.alloc( 1, 2 ),
              success = this.vm.alloc( 1, 3 ),
              ptr = this.vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( inputFile, 'ABC   \n' );
        this.vm.options.input = inputFile;
        unit.addr = this.vm.$( 'UNITI' );
        spec.update( ptr, 0, 0, 0, 8 );

        try {
            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( spec.length, 6 );
            assert.equal( Array.from( this.vm.mem.slice( ptr, ptr + spec.length ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'ABC   ' );
        } finally {
            fs.unlinkSync( inputFile );
        }
    } );

    it( 'STREAD treats an empty runtime INPUT record as data, not EOF', function () {
        const inputFile = path.join( os.tmpdir(), 'snoflake-stread-input-empty-' + process.pid + '.txt' ),
              unit = this.vm.d(),
              spec = this.vm.s(),
              eof = this.vm.alloc( 1, 1 ),
              error = this.vm.alloc( 1, 2 ),
              success = this.vm.alloc( 1, 3 ),
              ptr = this.vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( inputFile, '\nNEXT\n' );
        this.vm.options.input = inputFile;
        unit.addr = this.vm.$( 'UNITI' );
        spec.update( ptr, 0, 0, 0, 8 );

        try {
            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( this.vm.instructionPointer, success );
            assert.equal( spec.length, 0 );

            spec.length = 8;
            sil.STREAD.call( this.vm, spec, unit, eof, error, success );
            assert.equal( spec.length, 4 );
            assert.equal( Array.from( this.vm.mem.slice( ptr, ptr + spec.length ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'NEXT' );
        } finally {
            fs.unlinkSync( inputFile );
        }
    } );
} );


describe( 'Macros that Depend on Operating System Facilities', function () {
    beforeEach( function () {
        this.vm = new SNOBOL.VM();
    } );

    it( 'DATE', function () {
        const s = this.vm.s(),
              year = new Date().getFullYear();
        sil.DATE.call( this.vm, s );
        assert( s.specified.includes( year ) );
    } );

    it( 'ENDEX', function () { // stub
        assert( sil.ENDEX ); 
    } );

    it( 'INIT', function () {
        const obstart = this.vm.alloc( this.vm.$( 'OBSIZ' ) * D ),
              spec = this.vm.s();

        this.vm.define( 'ATTRIB', 2 * D );
        this.vm.define( 'LNKFLD', 3 * D );
        this.vm.define( 'BCDFLD', 4 * D );
        this.vm.define( 'S', 1 );
        this.vm.define( 'ENDPTR', this.vm.d().ptr );
        this.vm.define( 'ENDSP', sil.STRING.call( this.vm, 'END' ) );
        this.vm.define( 'FRSGPT', this.vm.d().ptr );
        this.vm.define( 'HDSGPT', this.vm.d().ptr );
        this.vm.define( 'TLSGP1', this.vm.d().ptr );
        this.vm.define( 'OBPTR', this.vm.d().ptr );
        this.vm.d( 'OBPTR' ).update( obstart - this.vm.$( 'LNKFLD' ), this.vm.$( 'PTR' ), this.vm.$( 'S' ) );

        sil.INIT.call( this.vm );
        const ptr = this.vm.d( 'ENDPTR' );
        sil.LOCSP.call( this.vm, spec, ptr );

        assert( ptr.addr > 0 );
        assert.equal( ptr.flags, this.vm.$( 'PTR' ) );
        assert.equal( ptr.value, this.vm.$( 'S' ) );
        assert.equal( spec.specified, 'END' );
    } );

    it( 'LINK', function () { // stub
        assert( sil.LINK ); 
    } );

    it( 'LOAD', function () { // stub
        assert( sil.LOAD ); 
    } );

    it( 'MSTIME', function () {
        const d = this.vm.d();
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
        this.vm.define( 'EQTYP', 4 );
    } );

    it( 'LINKOR', function () { // stub
        assert( sil.LINKOR ); 
    } );

    it( 'LOCAPT', function () {
        const DESCR = this.vm.$( 'DESCR' ),
              PAIR_WIDTH = 2 * DESCR,
              PAIR_COUNT = 2,
              LIST_FLAGS = 7,
              LIST_VALUE = 11,
              FOUND_IP = 123,
              MISSING_IP = 456,
              SAME_VALUE_AS_ZEROCL = [ 99, 8, 0 ],
              FIRST_VALUE_DESCRIPTOR = [ 42, 0, 2 ],
              ZEROCL = [ 0, 0, 0 ],
              SECOND_VALUE_DESCRIPTOR = [ 43, 0, 3 ],
              SAME_ADDRESS_DIFFERENT_FLAGS = [ 99, 0, 0 ],
              result = this.vm.d(),
              list = this.vm.d(),
              key = this.vm.d(),
              found = FOUND_IP,
              missing = MISSING_IP,
              base = this.vm.alloc( DESCR + ( PAIR_COUNT * PAIR_WIDTH ) ),
              firstType = base + DESCR,
              firstValue = firstType + DESCR,
              secondType = firstType + PAIR_WIDTH,
              secondValue = secondType + DESCR;

        function setDescriptor( ptr, fields ) {
            this.vm.d( ptr ).update.apply( this.vm.d( ptr ), fields );
        }

        list.update( base, LIST_FLAGS, LIST_VALUE );
        this.vm.d( base ).update( 0, 0, PAIR_COUNT * PAIR_WIDTH );

        // LOCAPT searches only type descriptors: A+D, A+3D, ...
        // The first type has the same value field as ZEROCL but is not the
        // same descriptor, so it must not be treated as a hole.
        setDescriptor.call( this, firstType, SAME_VALUE_AS_ZEROCL );
        setDescriptor.call( this, firstValue, FIRST_VALUE_DESCRIPTOR );

        // The second type is an exact ZEROCL descriptor.  AUGATL relies on
        // LOCAPT returning the descriptor immediately before that slot.
        setDescriptor.call( this, secondType, ZEROCL );
        setDescriptor.call( this, secondValue, SECOND_VALUE_DESCRIPTOR );
        key.update.apply( key, ZEROCL );

        sil.LOCAPT.call( this.vm, result, list, key, missing, found );

        assert.equal( this.vm.instructionPointer, FOUND_IP );
        assert.deepEqual( result.raw(), [ firstValue, LIST_FLAGS, LIST_VALUE ] );

        key.update.apply( key, SAME_ADDRESS_DIFFERENT_FLAGS );
        this.vm.instructionPointer = 0;
        sil.LOCAPT.call( this.vm, result, list, key, missing, found );

        assert.equal( this.vm.instructionPointer, MISSING_IP );
    } );

    it( 'LOCAPV', function () { // stub
        const result = this.vm.d(),
              list = this.vm.d(),
              key = this.vm.d(),
              found = 123,
              missing = 456,
              base = this.vm.alloc( 15 );

        list.update( base, 7, 11 );
        this.vm.d( base ).update( 0, 0, 6 );
        this.vm.d( base + 3 ).update( 99, 0, 1 );
        this.vm.d( base + 6 ).update( 42, 0, 2 );
        this.vm.d( base + 12 ).update( 42, 0, 2 );
        key.update( 42, 0, 2 );

        sil.LOCAPV.call( this.vm, result, list, key, missing, found );

        assert.equal( this.vm.instructionPointer, 123 );
        assert.deepEqual( result.raw(), [ base, 7, 11 ] );

        key.update( 43, 0, 2 );
        this.vm.instructionPointer = 0;
        sil.LOCAPV.call( this.vm, result, list, key, missing, found );

        assert.equal( this.vm.instructionPointer, 456 );
    } );

    it( 'LVALUE', function () {
        const values = [ 42, 28, 96, 14, 2, 77 ],
              least = Math.min.apply( Math, values ),
              DESCR1 = this.vm.d(),
              DESCR2 = this.vm.d(),
              step = 2*3;
        let offset = 0;

        DESCR2.addr = this.vm.alloc( values.length * step );
        while ( values.length ) {
            const value = values.pop();
            this.vm.mem.set( [
                values.length === 0 ? 0 : offset + step, 0, 0,
                value, 0, 0
            ], DESCR2.addr + offset );
            offset += step;
        }

        sil.LVALUE.call( this.vm, DESCR1, DESCR2 );
        assert.equal( DESCR1.addr, least );
    } );

    it( 'ORDVST', function () { // stub
        assert( sil.ORDVST ); 
    } );

    it( 'RPLACE replaces characters in place', function () {
        const target = this.vm.s( sil.STRING.call( this.vm, 'spoon' ) ),
              from = this.vm.s( sil.STRING.call( this.vm, 'po' ) ),
              to = this.vm.s( sil.STRING.call( this.vm, 'PO' ) );

        sil.RPLACE.call( this.vm, target, from, to );

        assert.equal( target.specified, 'sPOOn' );
    } );

    it( 'RPLACE uses the last replacement for duplicate source characters', function () {
        const target = this.vm.s( sil.STRING.call( this.vm, 'banana' ) ),
              from = this.vm.s( sil.STRING.call( this.vm, 'anab' ) ),
              to = this.vm.s( sil.STRING.call( this.vm, 'ANXY' ) );

        sil.RPLACE.call( this.vm, target, from, to );

        assert.equal( target.specified, 'YXNXNX' );
    } );

    it( 'RPLACE leaves a zero-length target unchanged', function () {
        const target = this.vm.s( sil.STRING.call( this.vm, 'abc' ) ),
              from = this.vm.s( sil.STRING.call( this.vm, 'abc' ) ),
              to = this.vm.s( sil.STRING.call( this.vm, 'ABC' ) );

        target.length = 0;
        sil.RPLACE.call( this.vm, target, from, to );

        assert.equal( target.length, 0 );
        assert.equal( this.vm.mem[ target.addr ], 'a'.charCodeAt( 0 ) );
    } );

    it( 'RPLACE respects specifier offsets and lengths', function () {
        const target = this.vm.s( sil.STRING.call( this.vm, 'xxabcdefxx' ) ),
              from = this.vm.s( sil.STRING.call( this.vm, '_bcd_' ) ),
              to = this.vm.s( sil.STRING.call( this.vm, '_BCD_' ) );

        target.offset = 2;
        target.length = 6;
        from.offset = 1;
        from.length = 3;
        to.offset = 1;
        to.length = 3;

        sil.RPLACE.call( this.vm, target, from, to );

        target.offset = 0;
        target.length = 10;
        assert.equal( target.specified, 'xxaBCDefxx' );
    } );

    it( 'SPCINT', function () {
        const d = this.vm.d(),
              s = this.vm.s(),
              FLOC = 1,
              SLOC = 2,
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
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              d3 = this.vm.d(),
              block = [],
              TTL = this.vm.$( 'TTL' );
        this.vm.define( 'TTL', TTL );
        for ( let i = 0; i < 10; i++ ) {
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

    it( 'TOP throws if no title descriptor is found', function () {
        const d1 = this.vm.d(),
              d2 = this.vm.d(),
              d3 = this.vm.d(),
              block = [];
        this.vm.define( 'TTL', this.vm.$( 'TTL' ) );
        for ( let i = 0; i < 3; i++ ) {
            block.push( this.vm.d() );
        }

        d3.addr = block.at( -1 ).ptr;
        assert.throws( function () {
            sil.TOP.call( this.vm, d1, d2, d3 );
        }.bind( this ), RangeError );
    } );

    it( 'VARID', function () {
        const d = this.vm.d(),
              s = this.vm.s( sil.STRING.call( this.vm, 'hello' ) );

        sil.VARID.call( this.vm, d, s );
        assert.equal( d.addr, 744 );
        assert.equal( d.addr % D, 0 );
        assert.equal( d.value, 3679317 );
    } );
} );
