import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { Action, D, VM, assemble, bindSyntaxTables, constants, createVM, defaults, sil, str } from '../src/snobol.js';
import { createHostLoader } from '../src/host.js';
import process from "node:process";

// VM wired to the host filesystem, for tests that read or write real files.
function createFileVM() {
    return createVM( { loader: createHostLoader() } );
}

//
// Test Cases
//

function stackVM() {
    const vm = new VM();
    // STACK and STSIZE are program-overridable defaults: at runtime
    // they come from image.symbols. These tests bypass the assembler,
    // so seed them explicitly with the reference values.
    vm.define( 'STACK', defaults.STACK );
    vm.define( 'STSIZE', defaults.STSIZE );
    sil.ISTACK.call( vm );
    return vm;
}

function miscVM() {
    const vm = new VM();
    vm.define( 'EQTYP', 4 );
    return vm;
}


describe( 'Assembly Control Macros', function () {
    it( 'COPY', function () {
        assert( sil.COPY );
    } );

    it( 'END', function () {
        assert( sil.END );
    } );

    it( 'keeps executable labels in the instruction stream', function () {
        const vm = new VM();
        vm.run( assemble( [
            { label: 'PAD', macro: 'BUFFER', operands: [ 10 ] },
            { label: 'DS',  macro: 'DESCR',  operands: [] },
            { label: null,  macro: 'BRANCH', operands: [ { type: 'symbol', name: 'LBL' } ] },
            { label: null,  macro: 'SETAC',  operands: [ { type: 'symbol', name: 'DS' }, 11 ] },
            { label: 'LBL', macro: 'SETAC',  operands: [ { type: 'symbol', name: 'DS' }, 22 ] },
            { label: null,  macro: 'END',    operands: [] }
        ] ) );

        // BUFFER and DESCR assemble data, but do not occupy runtime
        // instruction slots.
        assert.equal( vm.resolve( 'LBL' ), 2 );
        assert.equal( vm.d( 'DS' ).addr, 22 );
    } );

    it( 'resolves forward labels in assembled descriptor data', function () {
        const vm = new VM();
        vm.run( assemble( [
            { label: 'DS',    macro: 'DESCR', operands: [ { type: 'symbol', name: 'VALUE' } ] },
            { label: 'SP',    macro: 'SPEC',  operands: [ { type: 'symbol', name: 'VALUE' }, 0, 0, 0, 0 ] },
            { label: 'VALUE', macro: 'EQU',   operands: [ 123 ] },
            { label: null,    macro: 'END',   operands: [] }
        ] ) );

        assert.equal( vm.d( 'DS' ).addr, 123 );
        assert.equal( vm.s( 'SP' ).addr, 123 );
    } );

    it( 'TITLE', function () {
        assert( sil.TITLE );
    } );
} );

describe( 'Macros that Assemble Data', function () {
    it( 'ARRAY', function () {
        const vm = new VM();
        const allocated = vm.memPtr;
        sil.ARRAY.call( vm, 18 );
        assert.equal( vm.memPtr, allocated + ( 18 * 3 ) );
    } );

    it( 'BUFFER', function () {
        const vm = new VM();
        const s = vm.s();
        s.addr = sil.BUFFER.call( vm, 4 );
        s.length = 4;
        assert.equal( s.specified, '    ' );
    } );

    it( 'DESCR', function () {
        const vm = new VM();
        const ptr = sil.DESCR.call( vm, 1976, 1983, 2011 ),
              d = vm.d( ptr );
        assert.equal( d.addr, 1976 );
        assert.equal( d.flags, 1983 );
        assert.equal( d.value, 2011 );

    } );

    it( 'SPEC', function () {
        const vm = new VM();
        const A = 55, F = 66, V = 77, O = 88, L = 99,
              s = vm.s( sil.SPEC.call( vm, A, F, V, O, L ) );
        assert.deepEqual( s.raw(), [ A, F, V, O, L ] );
    } );

    it( 'STRING', function () {
        const vm = new VM();
        const ptr = sil.STRING.call( vm, 'Bananaphone' );
        assert.equal( vm.s( ptr ).specified, 'Bananaphone' );
    } );
} );


describe( 'Branch Macros', function () {
    it( 'BRANCH', function () {
        const vm = new VM();
        vm.run( assemble( [
            { label: 'DS',  macro: 'DESCR',  operands: [] },
            { label: null,  macro: 'SETAC',  operands: [ { type: 'symbol', name: 'DS' }, 22 ] },
            { label: null,  macro: 'BRANCH', operands: [ { type: 'symbol', name: 'LBL' } ] },
            { label: null,  macro: 'SETAC',  operands: [ { type: 'symbol', name: 'DS' }, 33 ] },
            { label: 'LBL', macro: 'LHERE',  operands: [] },
            { label: null,  macro: 'END',    operands: [] }
        ] ) );
        assert.equal( vm.d( 'DS' ).addr, 22 );
    } );

    it( 'BRANIC', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        d1.addr = d2.ptr;
        d2.addr = 1234;
        sil.BRANIC.call( vm, d1.ptr, 0 );
        assert.equal( vm.ip, 1234 );
    } );

    it( 'SELBRA', function () {
        const vm = new VM();
        const d = vm.d(),
              LOC1 = 222,
              LOC2 = 333,
              LOC3 = 555;
        d.addr = 2;
        sil.SELBRA.call( vm, d.ptr, [ null, LOC1, LOC2, null, LOC3 ] );
        assert.equal( vm.ip, 222 );
        // TODO: Test I = N + 1 (see SELBRA spec).
    } );
} );


describe( 'Comparison Macros', function () {
    it( 'ACOMP', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              GTLOC = 1,
              EQLOC = 2,
              LTLOC = 3;
        d1.addr = 456;
        d2.addr = 123;
        sil.ACOMP.call( vm, d1.ptr, d2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 1 );
        d1.addr = d2.addr;
        sil.ACOMP.call( vm, d1.ptr, d2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 2 );
        d1.addr = d2.addr - 100;
        sil.ACOMP.call( vm, d1.ptr, d2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3 );
    } );

    it( 'ACOMPC', function () {
        const vm = new VM();
        const DESCR = vm.d(),
              N = 4,
              GTLOC = 1,
              EQLOC = 2,
              LTLOC = 3;

        sil.ACOMPC.call( vm, DESCR.ptr, N, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3, '0 < 4 jumps to LTLOC' );

        DESCR.addr = N;
        sil.ACOMPC.call( vm, DESCR.ptr, N, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 2, '4 == 4 jumps to EQLOC' );
    } );

    it( 'AEQL', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              NELOC = 1,
              EQLOC = 2;

        d1.addr = 123;
        d2.addr = 456;
        sil.AEQL.call( vm, d1, d2, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d2.addr = d1.addr;
        sil.AEQL.call( vm, d1, d2, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    } );

    it( 'AEQLC', function () {
        const vm = new VM();
        const d = vm.d(),
              N = 1000,
              NELOC = 1,
              EQLOC = 2;
        d.addr = -1000;
        sil.AEQLC.call( vm, d.ptr, N, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d.addr = N;
        sil.AEQLC.call( vm, d.ptr, N, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    } );

    it( 'AEQLIC', function () {
        const vm = new VM();
        const NELOC = 1,
              EQLOC = 2,
              N1 = 50,
              N2 = 0;
        const d1 = vm.d();
        vm.alloc( 77 );
        const d2 = vm.d();

        d1.addr = d2.ptr - N1;
        d2.addr = N2 - 500;
        sil.AEQLIC.call( vm, d1, N1, N2, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d2.addr = N2;
        sil.AEQLIC.call( vm, d1, N1, N2, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    } );

    it( 'CHKVAL', function () {
        const vm = new VM();
        const s = vm.s(),
              d1 = vm.d(),
              d2 = vm.d(),
              GTLOC = 1,
              LTLOC = 2,
              EQLOC = 3;

        s.length = 50;
        d1.addr = 20;
        d2.addr = 100;
        sil.CHKVAL.call( vm, d1, d2, s, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 1 );

        d1.addr = 500;
        sil.CHKVAL.call( vm, d1, d2, s, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 2 );

        d1.addr = d2.addr + s.length;
        sil.CHKVAL.call( vm, d1, d2, s, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3 );

        s.length = 0;
        d1.addr = 0;
        d2.addr = 0;
        sil.CHKVAL.call( vm, d1, d2, s, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3 );
    } );

    it( 'DEQL', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              EQLOC = 1,
              NELOC = 2;

        d1.update( 123, 456, 789 );
        d2.read( d1 );
        sil.DEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d1.addr = 555;
        sil.DEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    } );

    it( 'LCOMP', function () {
        const vm = new VM();
        const s1 = vm.s(),
              s2 = vm.s(),
              GTLOC = 1,
              EQLOC = 2,
              LTLOC = 3;
        s1.length = 55;
        s2.length = 44;
        sil.LCOMP.call( vm, s1, s2, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 1 );
        s2.length = s1.length;
        sil.LCOMP.call( vm, s1, s2, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 2 );
        s1.length = s2.length - 5;
        sil.LCOMP.call( vm, s1, s2, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3 );
    } );

    it( 'LEQLC', function () {
        const vm = new VM();
        const s = vm.s(),
              NELOC = 20,
              EQLOC = 30,
              N = 333;
        s.length = N;
        sil.LEQLC.call( vm, s, N, NELOC, EQLOC );
        assert.equal( vm.ip, 30 );
        sil.LEQLC.call( vm, s, N + 5, NELOC, EQLOC );
        assert.equal( vm.ip, 20 );
    } );

    it( 'LEXCMP', function () {
        const vm = new VM();
        const SPEC1 = vm.s(),
              SPEC2 = vm.s(),
              GTLOC = 1,
              EQLOC = 2,
              LTLOC = 3;

        vm.specify( 'abd', SPEC1 );
        vm.specify( 'abc', SPEC2 );
        sil.LEXCMP.call( vm, SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 1 );

        vm.specify( 'abc', SPEC1 );
        vm.specify( 'abc', SPEC2 );
        sil.LEXCMP.call( vm, SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 2 );

        vm.specify( 'abc', SPEC1 );
        vm.specify( 'abd', SPEC2 );
        sil.LEXCMP.call( vm, SPEC1, SPEC2, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3 );

        vm.ip = 0;
        sil.LEXCMP.call( vm, SPEC1, SPEC2, GTLOC, EQLOC );
        assert.equal( vm.ip, 0 );
    } );

    it( 'TESTF', function () {
        const vm = new VM();
        const d = vm.d(),
              FLAG = 4,
              FLOC = 1,
              SLOC = 2;
        sil.TESTF.call( vm, d.ptr, FLAG, FLOC, SLOC );
        assert.equal( vm.ip, 1 );
        d.flags |= FLAG;
        sil.TESTF.call( vm, d.ptr, FLAG, FLOC, SLOC );
        assert.equal( vm.ip, 2 );
    } );

    it( 'TESTFI', function () {
        const vm = new VM();
        const d = vm.d(),
              FLAG = 4,
              FLOC = 1,
              SLOC = 2;
        vm.alloc( 50 );
        const da = vm.d();
        d.addr = da.ptr;
        sil.TESTFI.call( vm, d, FLAG, FLOC, SLOC );
        assert.equal( vm.ip, 1 );
        da.flags |= FLAG;
        sil.TESTFI.call( vm, d, FLAG, FLOC, SLOC );
        assert.equal( vm.ip, 2 );
    } );

    it( 'VCMPIC', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              N = 5,
              GTLOC = 10,
              EQLOC = 20,
              LTLOC = 30;
        vm.alloc( 30 );
        const src = vm.d();
        d1.addr = src.ptr - N;

        // V1 > V2
        d2.value = 200;
        src.value = 300;
        sil.VCMPIC.call( vm, d1, N, d2, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 10 );

        // V1 == V2
        src.value = d2.value;
        sil.VCMPIC.call( vm, d1, N, d2, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 20 );

        // V1 < V2
        src.value = 100;
        sil.VCMPIC.call( vm, d1, N, d2, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 30 );
    } );

    it( 'VEQL', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              NELOC = 1,
              EQLOC = 2;
        d1.value = 123;
        d2.value = 456;
        sil.VEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d1.value = d2.value;
        sil.VEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    } );

    it( 'VEQLC', function () {
        const vm = new VM();
        const d = vm.d(),
              N = 555,
              NELOC = 1,
              EQLOC = 2;
        d.value = 444;
        sil.VEQLC.call( vm, d.ptr, N, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d.value = N;
        sil.VEQLC.call( vm, d.ptr, N, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    } );
} );


describe( 'Macros that Relate to Recursive Procedures and Stack Management', function () {
    it( 'ISTACK', function () {
        const vm = stackVM();
        sil.ISTACK.call( vm );
        assert.equal( vm.OSTACK, 0 );
        assert.equal( vm.CSTACK, defaults.STACK );
    } );

    it( 'POP', function () {
        const vm = stackVM();
        const d1 = vm.d(),
              d2 = vm.d(),
              d3 = vm.d(),
              d4 = vm.d(),
              cur = vm.CSTACK;

        d1.update( 2, 4, 6 );
        d2.update( 3, 5, 7 );

        assert.equal( vm.CSTACK, cur );
        sil.PUSH.call( vm, [ d1.ptr, d2.ptr ] );
        assert.equal( vm.CSTACK, cur + d1.width + d2.width );
        sil.POP.call( vm, [ d3.ptr, d4.ptr ] );
        assert.equal( vm.CSTACK, cur );
        assert.deepEqual( d1.raw(), d4.raw() );
        assert.deepEqual( d2.raw(), d3.raw() );
    } );

    it( 'PSTACK', function () {
        const vm = stackVM();
        const d = vm.d();
        vm.CSTACK = 123;
        sil.PSTACK.call( vm, d );
        assert.deepEqual( d.raw(), [ 120, 0, 0 ] );
    } );

    it( 'PUSH', function () {
        const vm = stackVM();
        const cur = vm.CSTACK;
        let d = vm.d();
        d.update( 4, 1, 6 );
        sil.PUSH.call( vm, d.ptr );
        d = vm.d( cur + d.width );
        assert.deepEqual( d.raw(), [ 4, 1, 6 ] );
    } );

    it( 'RCALL', function () { // stub
        assert( sil.RCALL ); 
    } );

    it( 'RRTURN', function () { // stub
        assert( sil.RRTURN ); 
    } );

    it( 'SPOP', function () {
        const vm = stackVM();
        const s1 = vm.s(),
              s2 = vm.s(),
              s3 = vm.s(),
              s4 = vm.s(),
              cur = vm.CSTACK;

        s1.update( 0, 2, 4, 6, 8 );
        s2.update( 1, 3, 5, 7, 9 );
        assert.equal( vm.CSTACK, cur );
        sil.SPUSH.call( vm, [ s1, s2 ] );
        assert.equal( vm.CSTACK, cur + s1.width + s2.width );
        sil.SPOP.call( vm, [ s3, s4 ] );
        assert.equal( vm.CSTACK, cur );
        assert.deepEqual( s1.raw(), s4.raw() );
        assert.deepEqual( s2.raw(), s3.raw() );
    } );

    it( 'SPUSH', function () {
        const vm = stackVM();
        const cur = vm.CSTACK;
        let s = vm.s();

        s.update( 1, 2, 3, 4, 5 );
        sil.SPUSH.call( vm, s );

        s = vm.s( cur + D );
        assert.deepEqual( s.raw(), [ 1, 2, 3, 4, 5 ] );
    } );
} );


describe( 'Macros that Move and Set Descriptors', function () {
    it( 'GETD', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              d3 = vm.d();
        vm.alloc( 111 );
        const src = vm.d();
        d2.addr = src.ptr - 55;
        d3.addr = 55;
        src.update( 555, 666, 777 );
        sil.GETD.call( vm, d1.ptr, d2.ptr, d3.ptr );
        assert.deepEqual( src.raw(), d1.raw() );
    } );

    it( 'GETDC', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        d2.addr = 50;
        vm.alloc( 111 );
        const di = vm.d(),
              N = di.ptr - d2.addr;
        di.update( 4, 5, 6 );
        sil.GETDC.call( vm, d1.ptr, d2.ptr, N );
        assert.deepEqual( d1.raw(), di.raw() );
    } );

    it( 'MOVBLK', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              d3 = vm.d();
        vm.alloc( 99 );
        d2.addr = vm.memPtr - 3;
        for ( let i = 0; i < 10; i++ ) {
            vm.d().update( i, i, i );
        }
        d3.addr = 10 * 3;
        // An offset of 9 makes sure source and destination regions overlap.
        d1.addr = d2.addr - 9;
        sil.MOVBLK.call( vm, d1, d2, d3 );
        for ( let i = 0; i < 10; i++ ) {
            const ptr = d1.addr + 3 + ( 3 * i );
            assert.deepEqual( vm.d( ptr ).raw(), [ i, i, i ] );
        }
    } );

    it( 'MOVD', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        d2.update( 123, 456, 789 );
        sil.MOVD.call( vm, d1.ptr, d2.ptr );
        assert.deepEqual( d1.raw(), [ 123, 456, 789 ] );
    } );

    it( 'MOVDIC', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              N1 = 3,
              N2 = 4;
        vm.alloc( 11 );
        const src = vm.d();
        d2.addr = src.ptr - N2;
        vm.alloc( 7 );
        const dst = vm.d();
        d1.addr = dst.ptr - N1;
        src.update( 4, 5, 6 );
        sil.MOVDIC.call( vm, d1, N1, d2, N2 );
        assert.deepEqual( dst.raw(), src.raw() );
    } );

    it( 'PUTD', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              d3 = vm.d();
        vm.alloc( 7 );
        d1.addr = vm.alloc( 9 );
        vm.alloc( 5 );
        const dst = vm.d();
        d2.addr = dst.ptr - d1.addr;
        d3.update( 555, 666, 777 );
        sil.PUTD.call( vm, d1.ptr, d2.ptr, d3.ptr );
        assert.deepEqual( d3.raw(), dst.raw() );
    } );

    it( 'PUTDC', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        vm.alloc( 50 );
        d1.addr = vm.alloc( 25 );
        vm.alloc( 17 );
        const dst = vm.d(),
              N = dst.ptr - d1.addr;
        d2.update( 555, 666, 777 );
        sil.PUTDC.call ( vm, d1.ptr, N, d2.ptr );
        assert.deepEqual( dst.raw(), d2.raw() );
    } );

    it( 'ZERBLK', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        vm.alloc( 60 );
        const before = vm.d(),
              ptr = vm.alloc( 60, 1 ),
              after = vm.d();
        before.update( 1, 1, 1 );
        after.update( 1, 1, 1 );

        d1.addr = ptr;
        d2.addr = 19 * 3;

        sil.ZERBLK.call( vm, d1, d2 );
        assert.deepEqual( before.raw(), [ 1, 1, 1 ] );
        for ( let i = ptr; i < after.ptr; i++ ) {
            assert.equal( vm.mem[i], 0, `mem at position ${i}` );
        }
        assert.deepEqual( after.raw(), [ 1, 1, 1 ] );
    } );
} );


describe( 'Macros that Modify Address Fields of Descriptors', function () {
    it( 'ADJUST', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              d3 = vm.d(),
              di = vm.d();
        di.addr = 5;
        d2.addr = di.ptr;
        d3.addr = 7;
        sil.ADJUST.call( vm, d1, d2, d3 );
        assert.equal( d1.addr, d3.addr + di.addr );
    } );

    it( 'BKSIZE', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              di = vm.d();
        let FV;
        d2.addr = di.ptr;

        // F contains STTL
        di.update( 3, constants.STTL, 5 );
        sil.BKSIZE.call( vm, d1, d2 );
        FV = 3 * ( 4 + Math.floor( ( di.value - 1 ) / 3 + 1 ) );
        assert.deepEqual( d1.raw(), [ FV, 0, 0 ] );

        // F does not contain STTL
        di.update( 3, 0, 5 );
        sil.BKSIZE.call( vm, d1, d2 );
        FV = di.value + 3;
        assert.deepEqual( d1.raw(), [ FV, 0, 0 ] );
    } );

    it( 'DECRA', function () {
        const vm = new VM();
        const d = vm.d();
        d.addr = 55;
        sil.DECRA.call( vm, d.ptr, 33 );
        assert.equal( d.addr, 22 );
        sil.DECRA.call( vm, d.ptr, 44 );
        assert.equal( d.addr, -22 );
    } );

    it( 'GETAC', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              N = 5;
        vm.alloc( 10 );
        const src = vm.d();
        d2.addr = src.ptr - N;
        src.addr = 123;
        sil.GETAC.call( vm, d1, d2, N );
        assert.equal( d1.addr, src.addr );
    } );

    it( 'GETLG', function () {
        const vm = new VM();
        const s = vm.s(),
              d = vm.d();
        s.length = 1212;
        sil.GETLG.call( vm, d, s );
        assert.deepEqual( d.raw(), [ s.length, 0, 0 ] );
    } );

    it( 'GETLTH', function () {
        const vm = new VM();
        const s = 'Beauty is truth, truth beauty',
              d1 = vm.d(),
              d2 = vm.d();
        d2.addr = s.length;
        const len = str.encode( s ).length + 9;
        sil.GETLTH.call( vm, d1, d2 );
        assert.equal( d1.addr, len );
    } );

    it( 'GETSIZ', function () {
        const vm = new VM();
        const d_indirect = sil.DESCR.call( vm, 123, 456, 789 ),
              d1 = sil.DESCR.call( vm, 0, 0, 0 ),
              d2 = sil.DESCR.call( vm, d_indirect, 0, 0 );

        sil.GETSIZ.call( vm, d1, d2 );
        assert.equal( vm.d( d1 ).addr, vm.d( d_indirect ).value );
    } );

    it( 'INCRA', function () {
        const vm = new VM();
        const d = sil.DESCR.call( vm, 123, 0, 0 );
        sil.INCRA.call( vm, d, 10 );
        assert.equal( vm.d( d ).addr, 133 );
    } );

    it( 'MOVA', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        d1.addr = 111;
        d2.addr = 999;
        sil.MOVA.call( vm, d1.ptr, d2.ptr );
        assert.equal( d1.addr, 999 );
        assert.equal( d2.addr, 999 );
    } );

    it( 'PUTAC', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        vm.alloc( 100 );
        d1.addr = 15;
        const d3 = vm.d(),
              N = d3.ptr - d1.addr;
        d2.addr = 789;
        sil.PUTAC.call( vm, d1, N, d2 );
        assert.equal( d3.addr, d2.addr );
    } );

    it( 'SETAC', function () {
        const vm = new VM();
        const d = vm.d(),
              N = 123;
        d.update( 5, 6, 7 );
        sil.SETAC.call( vm, d.ptr, N );
        assert.equal( d.addr, N );
    } );

    it( 'SETAV', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        d1.update( 1, 2, 3 );
        d2.update( 5, 6, 7 );
        sil.SETAV.call( vm, d1.ptr, d2.ptr );
        assert.deepEqual( d1.raw(), [ d2.value, 0, 0 ] );
    } );
} );


describe( 'Macros that Modify Value Fields of Descriptors', function () {
    it( 'INCRV', function () {
        const vm = new VM();
        const d = vm.d(),
              N = 55;
        d.value = 44;
        sil.INCRV.call( vm, d, N );
        assert.equal( d.value, 55 + 44 );
    } );

    it( 'MOVV', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        d2.value = 999;
        sil.MOVV.call( vm, d1.ptr, d2.ptr );
        assert.equal( d1.value, 999 );
    } );

    it( 'PUTVC', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              N = 3;
        vm.alloc( 13 );
        const dst = vm.d();
        d1.addr = dst.ptr - N;
        d2.value = 777;
        sil.PUTVC.call( vm, d1, N, d2 );
        assert.equal( dst.value, d2.value );
    } );

    it( 'SETSIZ', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d(),
              dst = vm.d();
        d1.addr = dst.ptr;
        d2.addr = 12345;
        sil.SETSIZ.call( vm, d1, d2 );
        assert.equal( dst.value, 12345 );
    } );

    it( 'SETVA', function () {
        const vm = new VM();
        const d1 = vm.d(),
              d2 = vm.d();
        d2.addr = 999;
        sil.SETVA.call( vm, d1, d2 );
        assert.equal( d1.value, 999 );
    } );

    it( 'SETVC', function () {
        const vm = new VM();
        const d = vm.d();
        sil.SETVC.call( vm, d.ptr, 77 );
        assert.equal( d.value, 77 );
    } );

    it( 'SETVC accepts zero', function () {
        const vm = new VM();
        const d = vm.d();
        d.value = 77;
        sil.SETVC.call( vm, d.ptr, 0 );
        assert.equal( d.value, 0 );
    } );
} );


describe( 'Macros that Modify Flag Fields of Descriptors', function () {
    it( 'RESETF', function () {
        const vm = new VM();
        const d = vm.d();
        d.flags = 0x8 | 0x4 | 0x2;
        sil.RESETF.call( vm, d, 0x4 );
        assert.equal( d.flags, 0x8 | 0x2 );
        sil.RESETF.call( vm, d, 0x2 );
        assert.equal( d.flags, 0x8 );
    } );

    it( 'RSETFI', function () {
        const vm = new VM();
        const d = vm.d();

        vm.alloc( 50 );
        const a = vm.d();
        d.addr = a.ptr;
        a.flags |= 5;
        sil.RSETFI.call( vm, d, 4 );
        assert.equal( a.flags, 1 );
        sil.RSETFI.call( vm, d, 4 );
        assert.equal( a.flags, 1 );
        sil.RSETFI.call( vm, d, 1 );
        assert.equal( a.flags, 0 );
    } );

    it( 'SETF', function () {
        const vm = new VM();
        const d = vm.d();
        sil.SETF.call( vm, d, 0x4 );
        assert.equal( d.flags, 0x4 );
        sil.SETF.call( vm, d, 0x8 );
        assert.equal( d.flags, 0x4 | 0x8 );
        sil.SETF.call( vm, d, 0x4 );
        assert.equal( d.flags, 0x4 | 0x8 );
    } );

    it( 'SETFI', function () {
        const vm = new VM();
        const d = vm.d(),
              dst = vm.d();
        d.addr = dst.ptr;
        sil.SETFI.call( vm, d, 0x4 );
        assert.equal( dst.flags, 0x4 );
    } );
} );


describe( 'Macros that Perform Integer Arithmetic on Address Fields', function () {
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
        const vm = new VM();
        const INT32_MAX = 0x7fffffff,
              d1 = vm.d(),
              d2 = vm.d(),
              d3 = vm.d(),
              FLOC = 7,
              SLOC = 9;
        d2.update( 555, 666, 777 );

        // A+I in range:
        d3.addr = 999;
        sil.SUM.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.deepEqual( d1.raw(), [ d2.addr + d3.addr, d2.flags, d2.value ] );
        assert.equal( vm.ip, 9 );

        // A+I overflow:
        d1.update( 11, 22, 33 );
        d3.addr = INT32_MAX;
        sil.SUM.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.deepEqual( d1.raw(), [ 11, 22, 33 ] );
        assert.equal( vm.ip, 7 );
    } );
} );


describe( 'Macros that Deal with Real Numbers', function () {
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
        const vm = new VM();
        const d = vm.d(), s = sil.STRING.call( vm, '-0.5' );
        vm.define( 'R', 9 );
        sil.SPREAL.call( vm, d, s, 1, 2 );
        assert.equal( d.raddr, -0.5 );
        assert.equal( d.value, 9 );
    } );
} );

describe( 'Macros that Move Specifiers', function () {
    it( 'GETSPC', function () {
        const vm = new VM();
        const N = 10,
              d = vm.d();
        vm.alloc( 32 );
        const s = vm.s();
        s.update( 11, 22, 33, 44, 55 );
        vm.alloc( 32 );
        sil.GETSPC.call( vm, s, d, N );
        const s_indirect = vm.s( s.addr + N );
        assert.deepEqual( s.raw(), s_indirect.raw() );
    } );

    it( 'PUTSPC', function () {
        const vm = new VM();
        const d = vm.d(),
              src = vm.s();
        d.addr = vm.alloc( 100 );
        const dst = vm.s();
        src.update( 55, 44, 33, 22, 11 );
        sil.PUTSPC.call( vm, d, dst.ptr - d.addr, src );
        assert.deepEqual( src.raw(), dst.raw() );
    } );

    it( 'SETSP', function () {
        const vm = new VM();
        const s1 = vm.s(),
              s2 = vm.s();
        s1.update( 10, 11, 12, 13, 14 );
        s2.update( 20, 21, 22, 23, 24 );
        sil.SETSP.call( vm, s1, s2 );
        assert.deepEqual( s1.raw(), [ 20, 21, 22, 23, 24 ] );
        assert.deepEqual( s1.raw(), s2.raw() );
    } );

} );


describe( 'Macros that Operate on Specifiers', function () {
    it( 'ADDLG', function () {
        const vm = new VM();
        const s = vm.s(),
              d = vm.d();
        s.length = 123;
        d.addr = 5;
        sil.ADDLG.call( vm, s, d );
        assert.equal( s.length, 123 + 5 );
    } );

    it( 'ADDLG accepts a zero increment', function () {
        const vm = new VM();
        const s = vm.s(),
              d = vm.d();
        s.length = 123;
        d.addr = 0;
        sil.ADDLG.call( vm, s, d );
        assert.equal( s.length, 123 );
    } );

    it( 'APDSP', function () {
        const vm = new VM();
        const s1 = vm.s( sil.STRING.call( vm, 'supercalifragilistic' ) );
        vm.alloc( 50 );
        const s2 = vm.s( sil.STRING.call( vm, 'expialidocious' ) );
        sil.APDSP.call( vm, s1, s2 );
        assert.equal( s1.specified, 'supercalifragilisticexpialidocious' );
    } );

    it( 'APDSP keeps logical length separate from descriptor padding', function () {
        const vm = new VM();
        const s1 = vm.s( sil.STRING.call( vm, '99' ) );

        vm.alloc( 50 );
        const s2 = vm.s( sil.STRING.call( vm, ' bottles of beer' ) );
        sil.APDSP.call( vm, s1, s2 );

        assert.equal( s1.length, '99 bottles of beer'.length );
        assert.equal( s1.specified, '99 bottles of beer' );
    } );

    it( 'FSHRTN', function () {
        const vm = new VM();
        const s = vm.s(),
              N = 4;
        s.update( 4, 5, 6, 7, 8 );
        sil.FSHRTN.call( vm, s, N );
        assert.equal( s.offset, 11 );
        assert.equal( s.length, 4 );
    } );

    it( 'GETBAL consumes the shortest balanced substring', function () {
        const vm = new VM();
        const spec = vm.s(),
              max = vm.d(),
              SLOC = 111,
              FLOC = 222;

        vm.specify( '(A*(B+C))-Z', spec );
        spec.length = 0;
        max.addr = '(A*(B+C))-Z'.length;

        sil.GETBAL.call( vm, spec, max, FLOC, SLOC );

        assert.equal( vm.ip, SLOC );
        assert.equal( spec.specified, '(A*(B+C))' );
    } );

    it( 'GETBAL consumes one non-parenthesis character', function () {
        const vm = new VM();
        const spec = vm.s(),
              max = vm.d(),
              SLOC = 111,
              FLOC = 222;

        vm.specify( 'ABC', spec );
        spec.length = 0;
        max.addr = 3;

        sil.GETBAL.call( vm, spec, max, FLOC, SLOC );

        assert.equal( vm.ip, SLOC );
        assert.equal( spec.specified, 'A' );
    } );

    it( 'GETBAL fails on right parenthesis', function () {
        const vm = new VM();
        const spec = vm.s(),
              max = vm.d(),
              SLOC = 111,
              FLOC = 222;

        vm.specify( ')ABC', spec );
        spec.length = 0;
        max.addr = 4;

        sil.GETBAL.call( vm, spec, max, FLOC, SLOC );

        assert.equal( vm.ip, FLOC );
        assert.equal( spec.specified, '' );
    } );

    it( 'INTSPC', function () {
        const vm = new VM();
        const d = vm.d(),
              s = vm.s();
        d.addr = -58;
        sil.INTSPC.call( vm, s, d );
        assert.equal( s.specified, '-58' );
        assert.equal( s.length, 3 );
    } );

    it( 'INTSPC uses a private conversion buffer', function () {
        const vm = new VM();
        const d = vm.d(),
              s = vm.s();

        vm.specify( 'abc', s );
        const original = s.addr;
        d.addr = 42;

        sil.INTSPC.call( vm, s, d );

        assert.equal( s.specified, '42' );
        assert.notEqual( s.addr, original );
        assert.equal( str.decode( vm.mem.slice( original, original + 3 ) ), 'abc' );
    } );

    it( 'LOCSP', function () {
        const vm = new VM();
        const CPD = 3,
              s = vm.s(),
              d = vm.d();

        // A = 0 (empty string)
        d.update( 0, 555, 666 );
        s.update( 1, 2, 3, 4, 5 );
        sil.LOCSP.call( vm, s, d );
        assert.deepEqual( s.raw(), [ 1, 2, 3, 4, 0 ] );

        // A != 0
        vm.alloc( 100 );
        const di = vm.d();
        d.addr = di.ptr;
        di.value = 9;
        sil.LOCSP.call( vm, s, d );
        assert.deepEqual( s.raw(), [ d.addr, d.flags, d.value, 4*CPD, di.value ] );
    } );

    it( 'PUTLG', function () {
        const vm = new VM();
        const s = vm.s(),
              d = vm.d();
        d.addr = 123;
        sil.PUTLG.call( vm, s, d );
        assert.equal( s.length, d.addr );
    } );

    it( 'REMSP', function () {
        const vm = new VM();
        const s1 = vm.s(),
              s2 = vm.s(),
              s3 = vm.s();
        s2.update( 1, 2, 3, 9, 5 );
        s3.update( 1, 2, 3, 4, 2 );
        sil.REMSP.call( vm, s1, s2, s3 );
        assert.deepEqual( s1.raw(), [ 1, 2, 3, s2.offset + s3.length, s2.length - s3.length ] );

        // If SPEC1 and SPEC3 are the same:
        s1.update( 0 );
        s2.update( 1, 2, 3, 9, 5 );
        const L3 = s1.length;
        sil.REMSP.call( vm, s1, s2, s1 );
        assert.deepEqual( s1.raw(), [ 1, 2, 3, s2.offset + L3, s2.length - L3 ] );
    } );

    it( 'SETLC', function () {
        const vm = new VM();
        const s = vm.s();
        sil.SETLC.call( vm, s, 555 );
        assert.equal( s.length, 555 );
    } );

    it( 'SHORTN', function () {
        const vm = new VM();
        const s = vm.s(),
              N = 4;
        s.length = 9;
        sil.SHORTN.call( vm, s, N );
        assert.equal( s.length, 5 );
    } );

    it( 'STREAM', function () {
        const vm = new VM();
        const s1 = vm.s(),
              s2 = vm.s( sil.STRING.call( vm, '43.2   ' ) ),
              stype = vm.d();

        vm.define( 'STYPE', stype.ptr );
        vm.define( 'FLITYP', 6 );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[ n ] ?? 0 );
        sil.STREAM.call( vm, s1, s2, 'INTGTB', -1, -2, -3 );

        assert.equal( s1.specified, '43.2' );
    } );

    it( 'STREAM runout', function () {
        const vm = new VM();
        const s1 = vm.s(),
              s2 = vm.s( sil.STRING.call( vm, '   ' ) ),
              stype = vm.d(),
              error = 1,
              runout = 2,
              sloc = 3;

        vm.define( 'STYPE', stype.ptr );
        vm.define( 'EQTYP', 4 );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[ n ] ?? 0 );
        sil.STREAM.call( vm, s1, s2, 'IBLKTB', error, runout, sloc );

        assert.equal( vm.ip, 2 );
        assert.equal( stype.addr, 0 );
        assert.equal( s1.specified, '   ' );
        assert.equal( s2.length, 0 );
    } );

    it( 'STREAM stop branches to success after consuming token', function () {
        const vm = new VM();
        const s1 = vm.s(),
              s2 = vm.s( sil.STRING.call( vm, ' = X' ) ),
              stype = vm.d(),
              error = 1,
              runout = 2,
              sloc = 3;

        vm.define( 'STYPE', stype.ptr );
        vm.define( 'EQTYP', 4 );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[ n ] ?? 0 );
        sil.STREAM.call( vm, s1, s2, 'IBLKTB', error, runout, sloc );

        assert.equal( vm.ip, 3 );
        assert.equal( stype.addr, vm.$( 'EQTYP' ) );
        assert.equal( s1.specified, ' =' );
        assert.equal( s2.specified, ' X' );
    } );

    it( 'STREAM routes non-byte characters to the table fallback', function () {
        const vm = new VM();
        const nonByteDigit = String.fromCharCode( 0x130 );
        const s1 = vm.s(),
              s2 = vm.s( sil.STRING.call( vm, nonByteDigit ) ),
              stype = vm.d(),
              error = 1,
              runout = 2,
              sloc = 3;

        vm.define( 'STYPE', stype.ptr );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[ n ] ?? 0 );
        sil.STREAM.call( vm, s1, s2, 'INTGTB', error, runout, sloc );

        assert.equal( vm.ip, error );
        assert.equal( stype.addr, 0 );
        assert.equal( s1.length, 1 );
    } );

    it( 'SUBSP', function () {
        const vm = new VM();
        const s1 = vm.s(),
              s2 = vm.s(),
              s3 = vm.s(),
              FLOC = 1,
              SLOC = 2;
        // L3 > L2
        s2.update( 5, 2, 3, 4, 5 );
        s3.update( 6, 7, 8, 9, 8 );
        sil.SUBSP.call( vm, s1, s2, s3, FLOC, SLOC );
        assert.equal( vm.ip, 2 );
        assert.deepEqual( s1.raw(), [ 6, 7, 8, 9, 5 ] );

        // L3 == L2
        s3.length = 5;
        s1.update( 0 );
        sil.SUBSP.call( vm, s1, s2, s3, FLOC, SLOC );
        assert.equal( vm.ip, 2 );
        assert.deepEqual( s1.raw(), [ 6, 7, 8, 9, 5 ] );

        // L3 < L2
        s3.length = 2;
        s1.update( 0 );
        sil.SUBSP.call( vm, s1, s2, s3, FLOC, SLOC );
        assert.equal( vm.ip, 1 );
        assert.deepEqual( s1.raw(), [ 0, 0, 0, 0, 0 ] );

        assert( sil.SUBSP ); 
    } );

    it( 'TRIMSP', function () {
        const vm = new VM();
        const s1 = vm.s(),
              s2 = vm.s( vm.specify( 'abcd   ' ) );

        sil.TRIMSP.call( vm, s1, s2 );
        assert.equal( s2.specified, 'abcd   ' );
        assert.equal( s1.specified, 'abcd' );

        vm.specify( 'efgh', s2 );
        sil.TRIMSP.call( vm, s1, s2 );
        assert.equal( s1.specified, 'efgh' );
    } );
} );


describe( 'Macros that Operate on Syntax Tables', function () {
    it( 'CLERTB resolves a table id and fills character entries', function () {
        const vm = new VM();
        sil.CLERTB.call( vm, 'SNABTB', 'ERROR' );

        const { actions, fallback } = vm.syntaxTables.SNABTB;
        assert.equal( actions.length, constants.ALPHSZ );
        assert.deepEqual( fallback, { put: 0, action: Action.RUNOUT, next: null } );
        for ( let code = 0; code < constants.ALPHSZ; code++ ) {
            assert.equal( actions[ code ], Action.ERROR );
        }
    } );

    it( 'binds non-byte fallback separately from byte slots', function () {
        const vm = new VM();
        vm.define( 'NBTYP', 77 );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[ n ] ?? 0 );

        const table = vm.syntaxTables.FRWDTB;
        assert.equal( table.actions.length, constants.ALPHSZ );
        assert.equal( table.puts.length, constants.ALPHSZ );
        assert.equal( table.next.length, constants.ALPHSZ );
        assert.deepEqual( table.fallback, {
            put: 77,
            action: Action.STOPSH,
            next: null,
        } );
    } );

    it( 'PLUGTB updates the entries selected by a specifier', function () {
        const vm = new VM();
        const spec = vm.s( sil.STRING.call( vm, 'AZ' ) );
        sil.CLERTB.call( vm, 'SNABTB', 'ERROR' );
        sil.PLUGTB.call( vm, 'SNABTB', 'STOP', spec );

        const { actions } = vm.syntaxTables.SNABTB;
        assert.equal( actions[ 'A'.charCodeAt( 0 ) ], Action.STOP );
        assert.equal( actions[ 'Z'.charCodeAt( 0 ) ], Action.STOP );
        assert.equal( actions[ 'B'.charCodeAt( 0 ) ], Action.ERROR );
    } );

    it( 'PLUGTB ignores non-byte entries in the plug specifier', function () {
        const vm = new VM();
        const nonByteDigit = String.fromCharCode( 0x130 );
        const spec = vm.s( sil.STRING.call(
            vm,
            'A' + nonByteDigit
        ) );
        sil.CLERTB.call( vm, 'SNABTB', 'ERROR' );
        sil.PLUGTB.call( vm, 'SNABTB', 'STOP', spec );

        const { actions, next } = vm.syntaxTables.SNABTB;
        assert.equal( actions[ 'A'.charCodeAt( 0 ) ], Action.STOP );
        assert.equal( next.length, constants.ALPHSZ );
        assert.equal( next[ 0x130 ], undefined );
    } );
} );


describe( 'Macros that Construct Pattern Nodes', function () {
    it( 'CPYPAT', function () {
        const vm = new VM();
        const dst = vm.d(),
              src = vm.d(),
              shift = vm.d(),
              offset = vm.d(),
              next = vm.d(),
              size = vm.d();

        dst.addr = vm.alloc( 20 );
        const dstBase = dst.addr;
        src.addr = vm.alloc( 20 );
        shift.addr = 100;
        offset.addr = 30;
        next.addr = 60;
        size.addr = 9;

        vm.d( src.addr + 3 ).update( 1, 2, 2 );
        vm.d( src.addr + 6 ).update( 6, 0, 9 );
        vm.d( src.addr + 9 ).update( 12, 0, 15 );

        sil.CPYPAT.call( vm, dst, src, shift, offset, next, size );

        assert.deepEqual( vm.d( dstBase + 3 ).raw(), [ 1, 2, 2 ] );
        assert.deepEqual( vm.d( dstBase + 6 ).raw(), [ 36, 0, 39 ] );
        assert.deepEqual( vm.d( dstBase + 9 ).raw(), [ 112, 0, 115 ] );
    } );

    it( 'MAKNOD', function () { // stub
        assert( sil.MAKNOD ); 
    } );
} );

describe( 'Macros that Operate on Tree Nodes', function () {
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
    it( 'BKSPCE', function () { // stub
        assert( sil.BKSPCE ); 
    } );

    it( 'ENFILE makes subsequent reads return EOF', function () {
        const vm = createFileVM();
        const file = path.join( os.tmpdir(), 'snoflake-enfile-' + process.pid + '.sno' ),
              unit = vm.d(),
              spec = vm.s(),
              eof = 1,
              error = 2,
              success = 3,
              ptr = vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( file, 'ABCD\nEFGH\n' );
        vm.options.file = file;
        unit.addr = 5;
        spec.update( ptr, 0, 0, 0, 4 );

        try {
            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( vm.ip, success );

            sil.ENFILE.call( vm, unit );

            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( vm.ip, eof );
            assert.equal( unit.addr, 0 );
        } finally {
            fs.unlinkSync( file );
        }
    } );

    it( 'FORMAT', function () {
        const vm = createVM();
        const ptr = sil.FORMAT.call( vm, 'test' );
        assert.equal( vm.s( ptr ).specified, 'test' );
    } );

    it( 'OUTPUT handles line-printer carriage control', function () {
        const vm = createVM();
        const unit = vm.d(),
              format = sil.FORMAT.call( vm, '(37H1SNOBOL4 (VERSION 3.11, MAY 19, 1975)/8H+_______)' ),
              logs = [],
              oldStdout = vm.units.stdout;

        vm.units.stdout = { write: function ( line ) { logs.push( line ); } };
        try {
            sil.OUTPUT.call( vm, unit.ptr, format );
        } finally {
            vm.units.stdout = oldStdout;
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
        const vm = createVM();
        const key = vm.d(),
              block = vm.d(),
              formatBase = vm.alloc( 20 ),
              item = sil.STRING.call( vm, 'HELLO' ),
              logs = [],
              oldStdout = vm.units.stdout,
              format = '(1H0,A)';

        block.addr = vm.alloc( 9 );
        vm.d( block.addr + D ).addr = 6;
        vm.d( block.addr + ( 2 * D ) ).addr = formatBase;
        vm.d( formatBase ).value = format.length;
        for ( let i = 0; i < format.length; i++ ) {
            vm.mem[ formatBase + ( 4 * D ) + i ] = format.charCodeAt( i );
        }

        vm.units.stdout = { write: function ( line ) { logs.push( line ); } };
        try {
            sil.STPRNT.call( vm, key.ptr, block.ptr, item );
        } finally {
            vm.units.stdout = oldStdout;
        }

        assert.deepEqual( logs, [ 'HELLO' ] );
    } );

    it( 'STPRNT does not treat letters in format control words as A-conversions', function () {
        const vm = createVM();
        const key = vm.d(),
              block = vm.d(),
              formatBase = vm.alloc( 40 ),
              item = sil.STRING.call( vm, 'HELLO' ),
              logs = [],
              oldStdout = vm.units.stdout,
              format = '(" " PAUSE,100A1)';

        block.addr = vm.alloc( 9 );
        vm.d( block.addr + D ).addr = 6;
        vm.d( block.addr + ( 2 * D ) ).addr = formatBase;
        vm.d( formatBase ).value = format.length;
        for ( let i = 0; i < format.length; i++ ) {
            vm.mem[ formatBase + ( 4 * D ) + i ] = format.charCodeAt( i );
        }

        vm.units.stdout = { write: function ( line ) { logs.push( line ); } };
        try {
            sil.STPRNT.call( vm, key.ptr, block.ptr, item );
        } finally {
            vm.units.stdout = oldStdout;
        }

        assert.deepEqual( logs, [ 'HELLO' ] );
    } );

    it( 'STPRNT preserves leading data characters when the format starts with A', function () {
        const vm = createVM();
        const key = vm.d(),
              block = vm.d(),
              formatBase = vm.alloc( 20 ),
              item = sil.STRING.call( vm, '0 DATA' ),
              logs = [],
              oldStdout = vm.units.stdout,
              format = '(121A1)';

        block.addr = vm.alloc( 9 );
        vm.d( block.addr + D ).addr = 6;
        vm.d( block.addr + ( 2 * D ) ).addr = formatBase;
        vm.d( formatBase ).value = format.length;
        for ( let i = 0; i < format.length; i++ ) {
            vm.mem[ formatBase + ( 4 * D ) + i ] = format.charCodeAt( i );
        }

        vm.units.stdout = { write: function ( line ) { logs.push( line ); } };
        try {
            sil.STPRNT.call( vm, key.ptr, block.ptr, item );
        } finally {
            vm.units.stdout = oldStdout;
        }

        assert.deepEqual( logs, [ '0 DATA' ] );
    } );

    it( 'STREAD', function () {
        const vm = createFileVM();
        const file = path.join( os.tmpdir(), 'snoflake-stread-' + process.pid + '.sno' ),
              unit = vm.d(),
              spec = vm.s(),
              eof = 1,
              error = 2,
              success = 3,
              ptr = vm.alloc( 16, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( file, 'END\n1234567890\n' );
        vm.options.file = file;
        unit.addr = 5;
        spec.update( ptr, 0, 0, 2, 8 );

        try {
            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( vm.ip, 3 );
            assert.equal( Array.from( vm.mem.slice( ptr, ptr + 2 ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), '..' );
            assert.equal( Array.from( vm.mem.slice( ptr + 2, ptr + 10 ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'END     ' );

            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( Array.from( vm.mem.slice( ptr + 2, ptr + 10 ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), '12345678' );

            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( vm.ip, 1 );
            assert.equal( unit.addr, 0 );

            unit.addr = 5;
            vm.ip = 7;
            sil.REWIND.call( vm, unit );
            sil.STREAD.call( vm, spec, unit, 7, error, 7 );
            sil.STREAD.call( vm, spec, unit, 7, error, 7 );
            sil.STREAD.call( vm, spec, unit, 7, error, 7 );
            assert.equal( vm.ip, 7 );
            assert.equal( unit.addr, 0 );
        } finally {
            fs.unlinkSync( file );
        }
    } );

    it( 'STREAD reads source then runtime input, with mode-appropriate length handling', function () {
        const vm = createFileVM();
        const sourceFile = path.join( os.tmpdir(), 'snoflake-stread-source-' + process.pid + '.sno' ),
              inputFile = path.join( os.tmpdir(), 'snoflake-stread-input-' + process.pid + '.txt' ),
              unit = vm.d(),
              spec = vm.s(),
              eof = vm.alloc( 1, 1 ),
              error = vm.alloc( 1, 2 ),
              success = vm.alloc( 1, 3 ),
              ptr = vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( sourceFile, 'SOURCE\n' );
        fs.writeFileSync( inputFile, 'DATA\n' );
        vm.options.file = sourceFile;
        vm.options.input = inputFile;
        unit.addr = constants.UNITI;
        spec.update( ptr, 0, 0, 0, 6 );

        try {
            // First read drains the card-padded source segment. SPEC.length
            // stays at the requested width because card reads are fixed-column.
            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( spec.length, 6 );
            assert.equal( Array.from( vm.mem.slice( ptr, ptr + 6 ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'SOURCE' );

            // Second read falls through to the input segment. SPEC.length is
            // updated to the actual record length so the caller sees DATA, not
            // a padded six-char field.
            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( spec.length, 4 );
            assert.equal( Array.from( vm.mem.slice( ptr, ptr + spec.length ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'DATA' );
        } finally {
            fs.unlinkSync( sourceFile );
            fs.unlinkSync( inputFile );
        }
    } );

    it( 'STREAD keeps runtime INPUT record length without discarding significant blanks', function () {
        const vm = createFileVM();
        const inputFile = path.join( os.tmpdir(), 'snoflake-stread-input-blanks-' + process.pid + '.txt' ),
              unit = vm.d(),
              spec = vm.s(),
              eof = vm.alloc( 1, 1 ),
              error = vm.alloc( 1, 2 ),
              success = vm.alloc( 1, 3 ),
              ptr = vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( inputFile, 'ABC   \n' );
        vm.options.input = inputFile;
        unit.addr = constants.UNITI;
        spec.update( ptr, 0, 0, 0, 8 );

        try {
            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( spec.length, 6 );
            assert.equal( Array.from( vm.mem.slice( ptr, ptr + spec.length ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'ABC   ' );
        } finally {
            fs.unlinkSync( inputFile );
        }
    } );

    it( 'STREAD treats an empty runtime INPUT record as data, not EOF', function () {
        const vm = createFileVM();
        const inputFile = path.join( os.tmpdir(), 'snoflake-stread-input-empty-' + process.pid + '.txt' ),
              unit = vm.d(),
              spec = vm.s(),
              eof = vm.alloc( 1, 1 ),
              error = vm.alloc( 1, 2 ),
              success = vm.alloc( 1, 3 ),
              ptr = vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( inputFile, '\nNEXT\n' );
        vm.options.input = inputFile;
        unit.addr = constants.UNITI;
        spec.update( ptr, 0, 0, 0, 8 );

        try {
            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( vm.ip, success );
            assert.equal( spec.length, 0 );

            spec.length = 8;
            sil.STREAD.call( vm, spec, unit, eof, error, success );
            assert.equal( spec.length, 4 );
            assert.equal( Array.from( vm.mem.slice( ptr, ptr + spec.length ) ).map( function ( c ) {
                return String.fromCharCode( c );
            } ).join( '' ), 'NEXT' );
        } finally {
            fs.unlinkSync( inputFile );
        }
    } );
} );


describe( 'Macros that Depend on Operating System Facilities', function () {
    it( 'DATE', function () {
        const vm = new VM();
        const s = vm.s(),
              year = new Date().getFullYear();
        sil.DATE.call( vm, s );
        assert( s.specified.includes( year ) );
    } );

    it( 'ENDEX', function () { // stub
        assert( sil.ENDEX ); 
    } );

    it( 'INIT', function () {
        const vm = new VM();
        vm.define( 'FRSGPT', vm.d().ptr );
        vm.define( 'HDSGPT', vm.d().ptr );
        vm.define( 'TLSGP1', vm.d().ptr );

        sil.INIT.call( vm );
        assert.equal( vm.d( 'TLSGP1' ).addr - vm.d( 'HDSGPT' ).addr, D * 50000 );
        assert.equal( vm.memPtr, vm.d( 'TLSGP1' ).addr );
        assert( vm.d( 'FRSGPT' ).addr < vm.d( 'TLSGP1' ).addr );
    } );

    it( 'LINK', function () { // stub
        assert( sil.LINK ); 
    } );

    it( 'LOAD', function () { // stub
        assert( sil.LOAD ); 
    } );

    it( 'MSTIME', function () {
        const vm = new VM();
        const d = vm.d();
        d.update( 1, 2, 3 );
        sil.MSTIME.call( vm, d );
        assert.deepEqual( d.raw(), [ 0, 0, 0 ] );
        assert( sil.MSTIME ); 
    } );

    it( 'UNLOAD', function () { // stub
        assert( sil.UNLOAD ); 
    } );
} );



describe( 'Miscellaneous Macros', function () {
    it( 'LINKOR', function () { // stub
        assert( sil.LINKOR ); 
    } );

    it( 'LOCAPT', function () {
        const vm = miscVM();
        const DESCR = constants.DESCR,
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
              result = vm.d(),
              list = vm.d(),
              key = vm.d(),
              found = FOUND_IP,
              missing = MISSING_IP,
              base = vm.alloc( DESCR + ( PAIR_COUNT * PAIR_WIDTH ) ),
              firstType = base + DESCR,
              firstValue = firstType + DESCR,
              secondType = firstType + PAIR_WIDTH,
              secondValue = secondType + DESCR;

        function setDescriptor( ptr, fields ) {
            vm.d( ptr ).update.apply( vm.d( ptr ), fields );
        }

        list.update( base, LIST_FLAGS, LIST_VALUE );
        vm.d( base ).update( 0, 0, PAIR_COUNT * PAIR_WIDTH );

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

        sil.LOCAPT.call( vm, result.ptr, list.ptr, key.ptr, missing, found );

        assert.equal( vm.ip, FOUND_IP );
        assert.deepEqual( result.raw(), [ firstValue, LIST_FLAGS, LIST_VALUE ] );

        key.update.apply( key, SAME_ADDRESS_DIFFERENT_FLAGS );
        vm.ip = 0;
        sil.LOCAPT.call( vm, result.ptr, list.ptr, key.ptr, missing, found );

        assert.equal( vm.ip, MISSING_IP );
    } );

    it( 'LOCAPV', function () {
        const vm = miscVM();
        const result = vm.d(),
              list = vm.d(),
              key = vm.d(),
              found = 123,
              missing = 456,
              base = vm.alloc( 15 );

        list.update( base, 7, 11 );
        vm.d( base ).update( 0, 0, 6 );
        vm.d( base + 3 ).update( 99, 0, 1 );
        vm.d( base + 6 ).update( 42, 0, 2 );
        vm.d( base + 12 ).update( 42, 0, 2 );
        key.update( 42, 0, 2 );

        sil.LOCAPV.call( vm, result.ptr, list.ptr, key.ptr, missing, found );

        assert.equal( vm.ip, 123 );
        assert.deepEqual( result.raw(), [ base, 7, 11 ] );

        key.update( 43, 0, 2 );
        vm.ip = 0;
        sil.LOCAPV.call( vm, result.ptr, list.ptr, key.ptr, missing, found );

        assert.equal( vm.ip, 456 );
    } );

    it( 'LVALUE', function () {
        const vm = miscVM();
        const values = [ 42, 28, 96, 14, 2, 77 ],
              least = Math.min.apply( Math, values ),
              DESCR1 = vm.d(),
              DESCR2 = vm.d(),
              step = 2*3;
        let offset = 0;

        DESCR2.addr = vm.alloc( values.length * step );
        while ( values.length ) {
            const value = values.pop();
            vm.mem.set( [
                values.length === 0 ? 0 : offset + step, 0, 0,
                value, 0, 0
            ], DESCR2.addr + offset );
            offset += step;
        }

        sil.LVALUE.call( vm, DESCR1, DESCR2 );
        assert.equal( DESCR1.addr, least );
    } );

    it( 'ORDVST', function () { // stub
        assert( sil.ORDVST ); 
    } );

    it( 'RPLACE replaces characters in place', function () {
        const vm = miscVM();
        const target = vm.s( sil.STRING.call( vm, 'spoon' ) ),
              from = vm.s( sil.STRING.call( vm, 'po' ) ),
              to = vm.s( sil.STRING.call( vm, 'PO' ) );

        sil.RPLACE.call( vm, target, from, to );

        assert.equal( target.specified, 'sPOOn' );
    } );

    it( 'RPLACE uses the last replacement for duplicate source characters', function () {
        const vm = miscVM();
        const target = vm.s( sil.STRING.call( vm, 'banana' ) ),
              from = vm.s( sil.STRING.call( vm, 'anab' ) ),
              to = vm.s( sil.STRING.call( vm, 'ANXY' ) );

        sil.RPLACE.call( vm, target, from, to );

        assert.equal( target.specified, 'YXNXNX' );
    } );

    it( 'RPLACE leaves a zero-length target unchanged', function () {
        const vm = miscVM();
        const target = vm.s( sil.STRING.call( vm, 'abc' ) ),
              from = vm.s( sil.STRING.call( vm, 'abc' ) ),
              to = vm.s( sil.STRING.call( vm, 'ABC' ) );

        target.length = 0;
        sil.RPLACE.call( vm, target, from, to );

        assert.equal( target.length, 0 );
        assert.equal( vm.mem[ target.addr ], 'a'.charCodeAt( 0 ) );
    } );

    it( 'RPLACE respects specifier offsets and lengths', function () {
        const vm = miscVM();
        const target = vm.s( sil.STRING.call( vm, 'xxabcdefxx' ) ),
              from = vm.s( sil.STRING.call( vm, '_bcd_' ) ),
              to = vm.s( sil.STRING.call( vm, '_BCD_' ) );

        target.offset = 2;
        target.length = 6;
        from.offset = 1;
        from.length = 3;
        to.offset = 1;
        to.length = 3;

        sil.RPLACE.call( vm, target, from, to );

        target.offset = 0;
        target.length = 10;
        assert.equal( target.specified, 'xxaBCDefxx' );
    } );

    it( 'SPCINT', function () {
        const vm = miscVM();
        const d = vm.d(),
              s = vm.s(),
              FLOC = 1,
              SLOC = 2,
              I = 6;
        vm.define( 'I', I );
        vm.specify( '-00521', s );
        sil.SPCINT.call( vm, d, s, FLOC, SLOC );
        assert.equal( d.addr, -521 );
        assert.equal( d.flags, 0 );
        assert.equal( d.value, I );
        assert.equal( vm.ip, 2 );
    } );

    it( 'TOP', function () {
        const vm = miscVM();
        const d1 = vm.d(),
              d2 = vm.d(),
              d3 = vm.d(),
              block = [],
              TTL = constants.TTL;
        vm.define( 'TTL', TTL );
        for ( let i = 0; i < 10; i++ ) {
            block.push( vm.d() );
        }

        // N = 6
        d3.update( block.at( -1 ).ptr, 123, 456 );
        block.at( -7 ).flags |= TTL;
        sil.TOP.call( vm, d1, d2, d3 );
        assert.equal( d2.addr, 6 * 3 );
        assert.deepEqual( d1.raw(), [ block.at( -7 ).ptr, 123, 456 ] );
        assert.equal( d3.addr - d2.addr, d1.addr );

        // N = 0
        block.at( -1 ).flags |= TTL;
        sil.TOP.call( vm, d1, d2, d3 );
        assert.equal( d2.addr, 0 );
        assert.deepEqual( d1.raw(), [ block.at( -1 ).ptr, 123, 456 ] );
        assert.equal( d3.addr - d2.addr, d1.addr );
    } );

    it( 'TOP throws if no title descriptor is found', function () {
        const vm = miscVM();
        const d1 = vm.d(),
              d2 = vm.d(),
              d3 = vm.d(),
              block = [];
        vm.define( 'TTL', constants.TTL );
        for ( let i = 0; i < 3; i++ ) {
            block.push( vm.d() );
        }

        d3.addr = block.at( -1 ).ptr;
        assert.throws( function () {
            sil.TOP.call( vm, d1, d2, d3 );
        }.bind( this ), RangeError );
    } );

    it( 'VARID', function () {
        const vm = miscVM();
        const d = vm.d(),
              s = vm.s( sil.STRING.call( vm, 'hello' ) );

        vm.define( 'OBSIZ', defaults.OBSIZ );
        sil.VARID.call( vm, d, s );
        assert.equal( d.addr, 744 );
        assert.equal( d.addr % D, 0 );
        assert.equal( d.value, 3679317 );
    } );
} );
