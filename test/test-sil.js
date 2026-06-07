import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
    Action,
    assemble,
    bindSyntaxTables,
    constants,
    createVM,
    D,
    decodeString,
    defaults,
    FAIL,
    sil,
    VM,
} from '../src/snobol.js';
import { createHostLoader } from '../src/host.js';
import process from 'node:process';

// VM wired to the host filesystem, for tests that read or write real files.
function createFileVM() {
    // No extensions: these tests exercise raw I/O composition, where an
    // extension preamble would add an unrelated source segment.
    return createVM( { loader: createHostLoader(), extensions: null } );
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

describe('Assembly Control Macros', function () {
    it('keeps executable labels in the instruction stream', function () {
        const vm = new VM();
        vm.run( assemble( [
            { label: 'PAD', macro: 'BUFFER', operands: [ 10 ] },
            { label: 'DS', macro: 'DESCR', operands: [] },
            {
                label: null,
                macro: 'BRANCH',
                operands: [ { type: 'symbol', name: 'LBL' } ],
            },
            {
                label: null,
                macro: 'SETAC',
                operands: [ { type: 'symbol', name: 'DS' }, 11 ],
            },
            {
                label: 'LBL',
                macro: 'SETAC',
                operands: [ { type: 'symbol', name: 'DS' }, 22 ],
            },
            { label: null, macro: 'END', operands: [] },
        ] ) );

        // BUFFER and DESCR assemble data, but do not occupy runtime
        // instruction slots.
        assert.equal( vm.$( 'LBL' ), 2 );
        assert.equal( vm.d( 'DS' ).addr, 22 );
    });

    it('resolves forward labels in assembled descriptor data', function () {
        const vm = new VM();
        vm.run( assemble( [
            {
                label: 'DS',
                macro: 'DESCR',
                operands: [ { type: 'symbol', name: 'VALUE' } ],
            },
            {
                label: 'SP',
                macro: 'SPEC',
                operands: [ { type: 'symbol', name: 'VALUE' }, 0, 0, 0, 0 ],
            },
            { label: 'VALUE', macro: 'EQU', operands: [ 123 ] },
            { label: null, macro: 'END', operands: [] },
        ] ) );

        assert.equal( vm.d( 'DS' ).addr, 123 );
        assert.equal( vm.s( 'SP' ).addr, 123 );
    });
});

describe('Macros that Assemble Data', function () {
    it('ARRAY', function () {
        const vm = new VM();
        const allocated = vm.memPtr;
        sil.ARRAY.call( vm, 18 );
        assert.equal( vm.memPtr, allocated + ( 18 * 3 ) );
    });

    it('BUFFER', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) );
        s.addr = sil.BUFFER.call( vm, 4 );
        s.length = 4;
        assert.equal( s.specified, '    ' );
    });

    it('DESCR', function () {
        const vm = new VM();
        const ptr = sil.DESCR.call( vm, 1976, 1983, 2011 ),
            d = vm.d( ptr );
        assert.equal( d.addr, 1976 );
        assert.equal( d.flags, 1983 );
        assert.equal( d.value, 2011 );
    });

    it('SPEC', function () {
        const vm = new VM();
        const A = 55,
            F = 66,
            V = 77,
            O = 88,
            L = 99,
            s = vm.s( sil.SPEC.call( vm, A, F, V, O, L ) );
        assert.deepEqual( s.cells(), [ A, F, V, O, 0, L ] );
        assert.equal( vm.mem[s.ptr + 4], 0 );
        assert.equal( vm.mem[s.ptr + 5], L );
    });

    it('STRING', function () {
        const vm = new VM();
        const ptr = sil.STRING.call( vm, 'Bananaphone' );
        assert.equal( vm.s( ptr ).specified, 'Bananaphone' );
    });
});

describe('Branch Macros', function () {
    it('BRANCH', function () {
        const vm = new VM();
        vm.run( assemble( [
            { label: 'DS', macro: 'DESCR', operands: [] },
            {
                label: null,
                macro: 'SETAC',
                operands: [ { type: 'symbol', name: 'DS' }, 22 ],
            },
            {
                label: null,
                macro: 'BRANCH',
                operands: [ { type: 'symbol', name: 'LBL' } ],
            },
            {
                label: null,
                macro: 'SETAC',
                operands: [ { type: 'symbol', name: 'DS' }, 33 ],
            },
            { label: 'LBL', macro: 'LHERE', operands: [] },
            { label: null, macro: 'END', operands: [] },
        ] ) );
        assert.equal( vm.d( 'DS' ).addr, 22 );
    });

    it('BRANIC', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        d1.addr = d2.ptr;
        d2.addr = 1234;
        sil.BRANIC.call( vm, d1.ptr, 0 );
        assert.equal( vm.ip, 1234 );
    });

    it('SELBRA', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            LOC1 = 222,
            LOC2 = 333,
            LOC3 = 555;
        d.addr = 2;
        sil.SELBRA.call( vm, d.ptr, [ null, LOC1, LOC2, null, LOC3 ] );
        assert.equal( vm.ip, 222 );
        // TODO: Test I = N + 1 (see SELBRA spec).
    });
});

describe('Comparison Macros', function () {
    it('ACOMP', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
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
    });

    it('ACOMPC', function () {
        const vm = new VM();
        const DESCR = vm.d( vm.alloc( D ) ),
            N = 4,
            GTLOC = 1,
            EQLOC = 2,
            LTLOC = 3;

        sil.ACOMPC.call( vm, DESCR.ptr, N, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3, '0 < 4 jumps to LTLOC' );

        DESCR.addr = N;
        sil.ACOMPC.call( vm, DESCR.ptr, N, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 2, '4 == 4 jumps to EQLOC' );
    });

    it('AEQL', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            NELOC = 1,
            EQLOC = 2;

        d1.addr = 123;
        d2.addr = 456;
        sil.AEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d2.addr = d1.addr;
        sil.AEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    });

    it('AEQLC', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            N = 1000,
            NELOC = 1,
            EQLOC = 2;
        d.addr = -1000;
        sil.AEQLC.call( vm, d.ptr, N, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d.addr = N;
        sil.AEQLC.call( vm, d.ptr, N, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    });

    it('AEQLIC', function () {
        const vm = new VM();
        const NELOC = 1,
            EQLOC = 2,
            N1 = 50,
            N2 = 0;
        const d1 = vm.d( vm.alloc( D ) );
        vm.alloc( 77 );
        const d2 = vm.d( vm.alloc( D ) );

        d1.addr = d2.ptr - N1;
        d2.addr = N2 - 500;
        sil.AEQLIC.call( vm, d1.ptr, N1, N2, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d2.addr = N2;
        sil.AEQLIC.call( vm, d1.ptr, N1, N2, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    });

    it('CHKVAL', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) ),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            GTLOC = 1,
            LTLOC = 2,
            EQLOC = 3;

        s.length = 50;
        d1.addr = 20;
        d2.addr = 100;
        sil.CHKVAL.call( vm, d1.ptr, d2.ptr, s.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 1 );

        d1.addr = 500;
        sil.CHKVAL.call( vm, d1.ptr, d2.ptr, s.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 2 );

        d1.addr = d2.addr + s.length;
        sil.CHKVAL.call( vm, d1.ptr, d2.ptr, s.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3 );

        s.length = 0;
        d1.addr = 0;
        d2.addr = 0;
        sil.CHKVAL.call( vm, d1.ptr, d2.ptr, s.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3 );
    });

    it('DEQL', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            EQLOC = 1,
            NELOC = 2;

        d1.set( 123, 456, 789 );
        d2.copyFrom( d1 );
        sil.DEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d1.addr = 555;
        sil.DEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    });

    it('LCOMP', function () {
        const vm = new VM();
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( vm.alloc( 2 * D ) ),
            GTLOC = 1,
            EQLOC = 2,
            LTLOC = 3;
        s1.length = 55;
        s2.length = 44;
        sil.LCOMP.call( vm, s1.ptr, s2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 1 );
        s2.length = s1.length;
        sil.LCOMP.call( vm, s1.ptr, s2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 2 );
        s1.length = s2.length - 5;
        sil.LCOMP.call( vm, s1.ptr, s2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3 );
    });

    it('LEQLC', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) ),
            NELOC = 20,
            EQLOC = 30,
            N = 333;
        s.length = N;
        sil.LEQLC.call( vm, s.ptr, N, NELOC, EQLOC );
        assert.equal( vm.ip, 30 );
        sil.LEQLC.call( vm, s.ptr, N + 5, NELOC, EQLOC );
        assert.equal( vm.ip, 20 );
    });

    it('LEXCMP', function () {
        const vm = new VM();
        const SPEC1 = vm.s( vm.alloc( 2 * D ) ),
            SPEC2 = vm.s( vm.alloc( 2 * D ) ),
            GTLOC = 1,
            EQLOC = 2,
            LTLOC = 3;

        vm.specify( 'abd', SPEC1.ptr );
        vm.specify( 'abc', SPEC2.ptr );
        sil.LEXCMP.call( vm, SPEC1.ptr, SPEC2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 1 );

        vm.specify( 'abc', SPEC1.ptr );
        vm.specify( 'abc', SPEC2.ptr );
        sil.LEXCMP.call( vm, SPEC1.ptr, SPEC2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 2 );

        vm.specify( 'abc', SPEC1.ptr );
        vm.specify( 'abd', SPEC2.ptr );
        sil.LEXCMP.call( vm, SPEC1.ptr, SPEC2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 3 );

        vm.ip = 0;
        sil.LEXCMP.call( vm, SPEC1.ptr, SPEC2.ptr, GTLOC, EQLOC );
        assert.equal( vm.ip, 0 );
    });

    it('TESTF', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            FLAG = 4,
            FLOC = 1,
            SLOC = 2;
        sil.TESTF.call( vm, d.ptr, FLAG, FLOC, SLOC );
        assert.equal( vm.ip, 1 );
        d.flags |= FLAG;
        sil.TESTF.call( vm, d.ptr, FLAG, FLOC, SLOC );
        assert.equal( vm.ip, 2 );
    });

    it('TESTFI', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            FLAG = 4,
            FLOC = 1,
            SLOC = 2;
        vm.alloc( 50 );
        const da = vm.d( vm.alloc( D ) );
        d.addr = da.ptr;
        sil.TESTFI.call( vm, d.ptr, FLAG, FLOC, SLOC );
        assert.equal( vm.ip, 1 );
        da.flags |= FLAG;
        sil.TESTFI.call( vm, d.ptr, FLAG, FLOC, SLOC );
        assert.equal( vm.ip, 2 );
    });

    it('VCMPIC', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            N = 5,
            GTLOC = 10,
            EQLOC = 20,
            LTLOC = 30;
        vm.alloc( 30 );
        const src = vm.d( vm.alloc( D ) );
        d1.addr = src.ptr - N;

        // V1 > V2
        d2.value = 200;
        src.value = 300;
        sil.VCMPIC.call( vm, d1.ptr, N, d2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 10 );

        // V1 == V2
        src.value = d2.value;
        sil.VCMPIC.call( vm, d1.ptr, N, d2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 20 );

        // V1 < V2
        src.value = 100;
        sil.VCMPIC.call( vm, d1.ptr, N, d2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, 30 );
    });

    it('VEQL', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            NELOC = 1,
            EQLOC = 2;
        d1.value = 123;
        d2.value = 456;
        sil.VEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d1.value = d2.value;
        sil.VEQL.call( vm, d1.ptr, d2.ptr, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    });

    it('VEQLC', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            N = 555,
            NELOC = 1,
            EQLOC = 2;
        d.value = 444;
        sil.VEQLC.call( vm, d.ptr, N, NELOC, EQLOC );
        assert.equal( vm.ip, 1 );
        d.value = N;
        sil.VEQLC.call( vm, d.ptr, N, NELOC, EQLOC );
        assert.equal( vm.ip, 2 );
    });
});

describe('Macros that Relate to Recursive Procedures and Stack Management', function () {
    it('ISTACK', function () {
        const vm = stackVM();
        vm.callbacks.push( { dest: 0, locs: [], fallthroughLoc: 0, base: 0 } );
        sil.ISTACK.call( vm );
        assert.equal( vm.CSTACK, defaults.STACK );
        assert.equal( vm.callbacks.length, 0 );
    });

    it('POP', function () {
        const vm = stackVM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            d4 = vm.d( vm.alloc( D ) ),
            cur = vm.CSTACK;

        d1.set( 2, 4, 6 );
        d2.set( 3, 5, 7 );

        assert.equal( vm.CSTACK, cur );
        sil.PUSH.call( vm, [ d1.ptr, d2.ptr ] );
        assert.equal( vm.CSTACK, cur + d1.width + d2.width );
        sil.POP.call( vm, [ d3.ptr, d4.ptr ] );
        assert.equal( vm.CSTACK, cur );
        assert.deepEqual( d1.cells(), d4.cells() );
        assert.deepEqual( d2.cells(), d3.cells() );
    });

    it('PSTACK', function () {
        const vm = stackVM();
        const d = vm.d( vm.alloc( D ) );
        vm.CSTACK = 123;
        sil.PSTACK.call( vm, d.ptr );
        assert.deepEqual( d.cells(), [ 120, 0, 0 ] );
    });

    it('PUSH', function () {
        const vm = stackVM();
        const cur = vm.CSTACK;
        let d = vm.d( vm.alloc( D ) );
        d.set( 4, 1, 6 );
        sil.PUSH.call( vm, [ d.ptr ] );
        d = vm.d( cur + d.width );
        assert.deepEqual( d.cells(), [ 4, 1, 6 ] );
    });

    it('RCALL reserves a bookkeeping slot and pushes arguments', function () {
        const vm = stackVM();
        const base = vm.CSTACK,
            dest = vm.alloc( D ),
            arg = vm.d( vm.alloc( D ) );
        arg.set( 7, 1, 9 );
        vm.ip = 42; // operation following the call

        sil.RCALL.call( vm, dest, 100, [ arg.ptr ], [ 55 ] );

        assert.equal( vm.ip, 100, 'jumps to PROC' );
        assert.deepEqual(
            vm.d( base + D ).cells(),
            [ 0, 0, 0 ],
            'inert A0 slot',
        );
        assert.deepEqual(
            vm.d( base + 2 * D ).cells(),
            [ 7, 1, 9 ],
            'arg at A+2D',
        );
        assert.equal( vm.CSTACK, base + 2 * D );

        assert.equal( vm.callbacks.length, 1 );
        const frame = vm.callbacks[0];
        assert.equal( frame.dest, dest );
        assert.equal( frame.base, base );
        assert.equal( frame.fallthroughLoc, 42 );
        assert.deepEqual( frame.locs, [ 55 ] );
    });

    it('RCALL checks the whole frame against the stack limit', function () {
        function call( nargs ) {
            const vm = stackVM();
            const args = [];
            for ( let i = 0; i < nargs; i++ ) {
                const a = vm.alloc( D );
                vm.d( a ).set( 1, 0, 0 );
                args.push( a );
            }
            // Leave room for exactly two slots above CSTACK.
            vm.TSTACK = vm.CSTACK + 2 * D;
            return () => sil.RCALL.call( vm, 0, 1, args, [] );
        }
        // One argument needs the bookkeeping slot plus one: exactly two slots.
        assert.doesNotThrow( call( 1 ) );
        // Two arguments need three slots and overrun the limit.
        assert.throws( call( 2 ), /Stack overflow/ );
    });

    it('RRTURN restores the frame, returns a value, and selects a loc', function () {
        const vm = stackVM();
        const dest = vm.d( vm.alloc( D ) ),
            ret = vm.d( vm.alloc( D ) );

        ret.set( 7, 1, 9 );
        vm.callbacks.push( {
            dest: dest.ptr,
            base: 4242,
            fallthroughLoc: 77,
            locs: [ 11, 22, 33 ],
        } );

        sil.RRTURN.call( vm, ret.ptr, 2 );

        assert.equal( vm.CSTACK, 4242 );
        assert.deepEqual( dest.cells(), [ 7, 1, 9 ] );
        assert.equal( vm.ip, 22 );
        assert.equal( vm.callbacks.length, 0 );
    });

    it('RRTURN skips the value copy and falls through for an absent DESCR', function () {
        const vm = stackVM();
        const dest = vm.d( vm.alloc( D ) );

        dest.set( 1, 2, 3 );
        vm.callbacks.push( {
            dest: dest.ptr,
            base: 100,
            fallthroughLoc: 77,
            locs: [],
        } );

        sil.RRTURN.call( vm, null, 1 );

        assert.deepEqual( dest.cells(), [ 1, 2, 3 ] );
        assert.equal( vm.ip, 77 );
        assert.equal( vm.CSTACK, 100 );
    });

    it('SPOP', function () {
        const vm = stackVM();
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( vm.alloc( 2 * D ) ),
            s3 = vm.s( vm.alloc( 2 * D ) ),
            s4 = vm.s( vm.alloc( 2 * D ) ),
            cur = vm.CSTACK;

        s1.set( 0, 2, 4, 6, 8 );
        s2.set( 1, 3, 5, 7, 9 );
        assert.equal( vm.CSTACK, cur );
        sil.SPUSH.call( vm, [ s1.ptr, s2.ptr ] );
        assert.equal( vm.CSTACK, cur + s1.width + s2.width );
        sil.SPOP.call( vm, [ s3.ptr, s4.ptr ] );
        assert.equal( vm.CSTACK, cur );
        assert.deepEqual( s1.cells(), s4.cells() );
        assert.deepEqual( s2.cells(), s3.cells() );
    });

    it('SPUSH', function () {
        const vm = stackVM();
        const cur = vm.CSTACK;
        let s = vm.s( vm.alloc( 2 * D ) );

        s.set( 1, 2, 3, 4, 5 );
        sil.SPUSH.call( vm, [ s.ptr ] );

        s = vm.s( cur + D );
        assert.deepEqual( s.cells(), [ 1, 2, 3, 4, 0, 5 ] );
    });
});

describe('Macros that Move and Set Descriptors', function () {
    it('GETD', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) );
        vm.alloc( 111 );
        const src = vm.d( vm.alloc( D ) );
        d2.addr = src.ptr - 55;
        d3.addr = 55;
        src.set( 555, 666, 777 );
        sil.GETD.call( vm, d1.ptr, d2.ptr, d3.ptr );
        assert.deepEqual( src.cells(), d1.cells() );
    });

    it('GETDC', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        d2.addr = 50;
        vm.alloc( 111 );
        const di = vm.d( vm.alloc( D ) ),
            N = di.ptr - d2.addr;
        di.set( 4, 5, 6 );
        sil.GETDC.call( vm, d1.ptr, d2.ptr, N );
        assert.deepEqual( d1.cells(), di.cells() );
    });

    it('MOVBLK', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) );
        vm.alloc( 99 );
        d2.addr = vm.memPtr - 3;
        for ( let i = 0; i < 10; i++ ) {
            vm.d( vm.alloc( D ) ).set( i, i, i );
        }
        d3.addr = 10 * 3;
        // An offset of 9 makes sure source and destination regions overlap.
        d1.addr = d2.addr - 9;
        sil.MOVBLK.call( vm, d1.ptr, d2.ptr, d3.ptr );
        for ( let i = 0; i < 10; i++ ) {
            const ptr = d1.addr + 3 + ( 3 * i );
            assert.deepEqual( vm.d( ptr ).cells(), [ i, i, i ] );
        }
    });

    it('MOVD', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        d2.set( 123, 456, 789 );
        sil.MOVD.call( vm, d1.ptr, d2.ptr );
        assert.deepEqual( d1.cells(), [ 123, 456, 789 ] );
    });

    it('MOVDIC', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            N1 = 3,
            N2 = 4;
        vm.alloc( 11 );
        const src = vm.d( vm.alloc( D ) );
        d2.addr = src.ptr - N2;
        vm.alloc( 7 );
        const dst = vm.d( vm.alloc( D ) );
        d1.addr = dst.ptr - N1;
        src.set( 4, 5, 6 );
        sil.MOVDIC.call( vm, d1.ptr, N1, d2.ptr, N2 );
        assert.deepEqual( dst.cells(), src.cells() );
    });

    it('PUTD', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) );
        vm.alloc( 7 );
        d1.addr = vm.alloc( 9 );
        vm.alloc( 5 );
        const dst = vm.d( vm.alloc( D ) );
        d2.addr = dst.ptr - d1.addr;
        d3.set( 555, 666, 777 );
        sil.PUTD.call( vm, d1.ptr, d2.ptr, d3.ptr );
        assert.deepEqual( d3.cells(), dst.cells() );
    });

    it('PUTDC', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        vm.alloc( 50 );
        d1.addr = vm.alloc( 25 );
        vm.alloc( 17 );
        const dst = vm.d( vm.alloc( D ) ),
            N = dst.ptr - d1.addr;
        d2.set( 555, 666, 777 );
        sil.PUTDC.call( vm, d1.ptr, N, d2.ptr );
        assert.deepEqual( dst.cells(), d2.cells() );
    });

    it('ZERBLK', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        vm.alloc( 60 );
        const before = vm.d( vm.alloc( D ) ),
            ptr = vm.alloc( 60, 1 ),
            after = vm.d( vm.alloc( D ) );
        before.set( 1, 1, 1 );
        after.set( 1, 1, 1 );

        d1.addr = ptr;
        d2.addr = 19 * 3;

        sil.ZERBLK.call( vm, d1.ptr, d2.ptr );
        assert.deepEqual( before.cells(), [ 1, 1, 1 ] );
        for ( let i = ptr; i < after.ptr; i++ ) {
            assert.equal( vm.mem[i], 0, `mem at position ${i}` );
        }
        assert.deepEqual( after.cells(), [ 1, 1, 1 ] );
    });
});

describe('Macros that Modify Address Fields of Descriptors', function () {
    it('ADJUST', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            di = vm.d( vm.alloc( D ) );
        di.addr = 5;
        d2.addr = di.ptr;
        d3.addr = 7;
        sil.ADJUST.call( vm, d1.ptr, d2.ptr, d3.ptr );
        assert.equal( d1.addr, d3.addr + di.addr );
    });

    it('BKSIZE', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            di = vm.d( vm.alloc( D ) );
        let FV;
        d2.addr = di.ptr;

        // F contains STTL
        di.set( 3, constants.STTL, 5 );
        sil.BKSIZE.call( vm, d1.ptr, d2.ptr );
        FV = 3 * ( 4 + Math.floor( ( di.value - 1 ) / 3 + 1 ) );
        assert.deepEqual( d1.cells(), [ FV, 0, 0 ] );

        // F does not contain STTL
        di.set( 3, 0, 5 );
        sil.BKSIZE.call( vm, d1.ptr, d2.ptr );
        FV = di.value + 3;
        assert.deepEqual( d1.cells(), [ FV, 0, 0 ] );
    });

    it('DECRA', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) );
        d.addr = 55;
        sil.DECRA.call( vm, d.ptr, 33 );
        assert.equal( d.addr, 22 );
        sil.DECRA.call( vm, d.ptr, 44 );
        assert.equal( d.addr, -22 );
    });

    it('GETAC', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            N = 5;
        vm.alloc( 10 );
        const src = vm.d( vm.alloc( D ) );
        d2.addr = src.ptr - N;
        src.addr = 123;
        sil.GETAC.call( vm, d1.ptr, d2.ptr, N );
        assert.equal( d1.addr, src.addr );
    });

    it('GETLG', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) ),
            d = vm.d( vm.alloc( D ) );
        s.length = 1212;
        sil.GETLG.call( vm, d.ptr, s.ptr );
        assert.deepEqual( d.cells(), [ s.length, 0, 0 ] );
    });

    it('GETLTH', function () {
        const vm = new VM();
        const s = 'Beauty is truth, truth beauty',
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        d2.addr = s.length;
        // F(L) = D*(3 + ceil(L/CPD)); here D=3, CPD=3, L=29 → 3*(3+10) = 39.
        sil.GETLTH.call( vm, d1.ptr, d2.ptr );
        assert.equal( d1.addr, 39 );
    });

    it('GETSIZ', function () {
        const vm = new VM();
        const d_indirect = sil.DESCR.call( vm, 123, 456, 789 ),
            d1 = sil.DESCR.call( vm, 0, 0, 0 ),
            d2 = sil.DESCR.call( vm, d_indirect.ptr, 0, 0 );

        sil.GETSIZ.call( vm, d1, d2 );
        assert.equal( vm.d( d1 ).addr, vm.d( d_indirect ).value );
    });

    it('INCRA', function () {
        const vm = new VM();
        const d = sil.DESCR.call( vm, 123, 0, 0 );
        sil.INCRA.call( vm, d, 10 );
        assert.equal( vm.d( d ).addr, 133 );
    });

    it('MOVA', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        d1.addr = 111;
        d2.addr = 999;
        sil.MOVA.call( vm, d1.ptr, d2.ptr );
        assert.equal( d1.addr, 999 );
        assert.equal( d2.addr, 999 );
    });

    it('PUTAC', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        vm.alloc( 100 );
        d1.addr = 15;
        const d3 = vm.d( vm.alloc( D ) ),
            N = d3.ptr - d1.addr;
        d2.addr = 789;
        sil.PUTAC.call( vm, d1.ptr, N, d2.ptr );
        assert.equal( d3.addr, d2.addr );
    });

    it('SETAC', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            N = 123;
        d.set( 5, 6, 7 );
        sil.SETAC.call( vm, d.ptr, N );
        assert.equal( d.addr, N );
    });

    it('SETAV', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        d1.set( 1, 2, 3 );
        d2.set( 5, 6, 7 );
        sil.SETAV.call( vm, d1.ptr, d2.ptr );
        assert.deepEqual( d1.cells(), [ d2.value, 0, 0 ] );
    });
});

describe('Macros that Modify Value Fields of Descriptors', function () {
    it('INCRV', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            N = 55;
        d.value = 44;
        sil.INCRV.call( vm, d.ptr, N );
        assert.equal( d.value, 55 + 44 );
    });

    it('MOVV', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        d2.value = 999;
        sil.MOVV.call( vm, d1.ptr, d2.ptr );
        assert.equal( d1.value, 999 );
    });

    it('PUTVC', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            N = 3;
        vm.alloc( 13 );
        const dst = vm.d( vm.alloc( D ) );
        d1.addr = dst.ptr - N;
        d2.value = 777;
        sil.PUTVC.call( vm, d1.ptr, N, d2.ptr );
        assert.equal( dst.value, d2.value );
    });

    it('SETSIZ', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            dst = vm.d( vm.alloc( D ) );
        d1.addr = dst.ptr;
        d2.addr = 12345;
        sil.SETSIZ.call( vm, d1.ptr, d2.ptr );
        assert.equal( dst.value, 12345 );
    });

    it('SETVA', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );
        d2.addr = 999;
        sil.SETVA.call( vm, d1.ptr, d2.ptr );
        assert.equal( d1.value, 999 );
    });

    it('SETVC', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) );
        sil.SETVC.call( vm, d.ptr, 77 );
        assert.equal( d.value, 77 );
    });
});

describe('Macros that Modify Flag Fields of Descriptors', function () {
    it('RESETF', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) );
        d.flags = 0x8 | 0x4 | 0x2;
        sil.RESETF.call( vm, d.ptr, 0x4 );
        assert.equal( d.flags, 0x8 | 0x2 );
        sil.RESETF.call( vm, d.ptr, 0x2 );
        assert.equal( d.flags, 0x8 );
    });

    it('RSETFI', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) );

        vm.alloc( 50 );
        const a = vm.d( vm.alloc( D ) );
        d.addr = a.ptr;
        a.flags |= 5;
        sil.RSETFI.call( vm, d.ptr, 4 );
        assert.equal( a.flags, 1 );
        sil.RSETFI.call( vm, d.ptr, 4 );
        assert.equal( a.flags, 1 );
        sil.RSETFI.call( vm, d.ptr, 1 );
        assert.equal( a.flags, 0 );
    });

    it('SETF', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) );
        sil.SETF.call( vm, d.ptr, 0x4 );
        assert.equal( d.flags, 0x4 );
        sil.SETF.call( vm, d.ptr, 0x8 );
        assert.equal( d.flags, 0x4 | 0x8 );
        sil.SETF.call( vm, d.ptr, 0x4 );
        assert.equal( d.flags, 0x4 | 0x8 );
    });

    it('SETFI', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            dst = vm.d( vm.alloc( D ) );
        d.addr = dst.ptr;
        sil.SETFI.call( vm, d.ptr, 0x4 );
        assert.equal( dst.flags, 0x4 );
    });
});

describe('Macros that Perform Integer Arithmetic on Address Fields', function () {
    it('DIVIDE truncates toward zero and preserves type fields', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) );

        d2.set( -7, 44, 55 );
        d3.addr = 3;
        sil.DIVIDE.call( vm, d1.ptr, d2.ptr, d3.ptr, 7, 9 );

        assert.equal( d1.addr, -2 );
        assert.equal( d1.flags, 44 );
        assert.equal( d1.value, 55 );
        assert.equal( vm.ip, 9 );
    });

    it('EXPINT raises an integer to a power and overflows to FLOC', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            FLOC = 7,
            SLOC = 9;

        d2.set( 2, 44, 55 );
        d3.addr = 10;
        sil.EXPINT.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.deepEqual( d1.cells(), [ 1024, 44, 55 ] );
        assert.equal( vm.ip, SLOC );

        // A negative exponent truncates toward zero.
        d2.addr = 2;
        d3.addr = -1;
        sil.EXPINT.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.equal( d1.addr, 0 );
        assert.equal( vm.ip, SLOC );

        d2.addr = 2;
        d3.addr = 100;
        sil.EXPINT.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.equal( vm.ip, FLOC );
    });

    it('MNSINT negates an integer', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );

        d2.set( 42, 44, 55 );
        sil.MNSINT.call( vm, d1.ptr, d2.ptr, 7, 9 );
        assert.deepEqual( d1.cells(), [ -42, 44, 55 ] );
        assert.equal( vm.ip, 9 );
    });

    it('MULT multiplies and overflows to FLOC', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            FLOC = 7,
            SLOC = 9;

        d2.set( 6, 44, 55 );
        d3.addr = 7;
        sil.MULT.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.deepEqual( d1.cells(), [ 42, 44, 55 ] );
        assert.equal( vm.ip, SLOC );

        d2.addr = Number.MAX_SAFE_INTEGER;
        d3.addr = 2;
        sil.MULT.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.equal( vm.ip, FLOC );
    });

    it('MULTC multiplies the address field by a constant', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );

        d2.addr = 9;
        sil.MULTC.call( vm, d1.ptr, d2.ptr, 4 );
        assert.equal( d1.addr, 36 );
    });

    it('SUBTRT subtracts and preserves type fields', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            FLOC = 7,
            SLOC = 9;

        d2.set( 100, 44, 55 );
        d3.addr = 30;
        sil.SUBTRT.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.deepEqual( d1.cells(), [ 70, 44, 55 ] );
        assert.equal( vm.ip, SLOC );

        d2.addr = -Number.MAX_SAFE_INTEGER;
        d3.addr = Number.MAX_SAFE_INTEGER;
        sil.SUBTRT.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.equal( vm.ip, FLOC );
    });

    it('SUM', function () {
        const vm = new VM();
        const INT_MAX = Number.MAX_SAFE_INTEGER,
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            FLOC = 7,
            SLOC = 9;
        d2.set( 555, 666, 777 );

        // A+I in range:
        d3.addr = 999;
        sil.SUM.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.deepEqual( d1.cells(), [
            d2.addr + d3.addr,
            d2.flags,
            d2.value,
        ] );
        assert.equal( vm.ip, 9 );

        // A+I overflow:
        d1.set( 11, 22, 33 );
        d3.addr = INT_MAX;
        sil.SUM.call( vm, d1.ptr, d2.ptr, d3.ptr, FLOC, SLOC );
        assert.deepEqual( d1.cells(), [ 11, 22, 33 ] );
        assert.equal( vm.ip, 7 );
    });
});

describe('Macros that Deal with Real Numbers', function () {
    it('ADREAL adds real values and preserves type fields', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) );

        d2.set( 1.5, 44, 55 );
        d3.addr = 2.25;
        sil.ADREAL.call( vm, d1.ptr, d2.ptr, d3.ptr, 7, 9 );
        assert.equal( d1.addr, 3.75 );
        assert.equal( d1.flags, 44 );
        assert.equal( d1.value, 55 );
        assert.equal( vm.ip, 9 );

        d2.addr = Number.MAX_VALUE;
        d3.addr = Number.MAX_VALUE;
        sil.ADREAL.call( vm, d1.ptr, d2.ptr, d3.ptr, 7, 9 );
        assert.equal( vm.ip, 7 );
    });

    it('DVREAL divides real values and preserves type fields', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) );

        d2.addr = 7.5;
        d2.flags = 44;
        d2.value = 55;
        d3.addr = 2.5;
        sil.DVREAL.call( vm, d1.ptr, d2.ptr, d3.ptr, 7, 9 );

        assert.equal( d1.addr, 3 );
        assert.equal( d1.flags, 44 );
        assert.equal( d1.value, 55 );
        assert.equal( vm.ip, 9 );
    });

    it('EXREAL raises a real to a power', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) );

        d2.set( 2, 44, 55 );
        d3.addr = 0.5;
        sil.EXREAL.call( vm, d1.ptr, d2.ptr, d3.ptr, 7, 9 );
        assert.equal( d1.addr, Math.SQRT2 );
        assert.equal( d1.flags, 44 );
        assert.equal( d1.value, 55 );
        assert.equal( vm.ip, 9 );

        d2.addr = Number.MAX_VALUE;
        d3.addr = 2;
        sil.EXREAL.call( vm, d1.ptr, d2.ptr, d3.ptr, 7, 9 );
        assert.equal( vm.ip, 7 );
    });

    it('INTRL converts an integer to a real', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );

        vm.define( 'R', 9 );
        d2.set( 42, 44, 55 );
        sil.INTRL.call( vm, d1.ptr, d2.ptr );
        assert.deepEqual( d1.cells(), [ 42, 0, 9 ] );
    });

    it('MNREAL negates a real and keeps type fields', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );

        d2.set( 2.5, 44, 55 );
        sil.MNREAL.call( vm, d1.ptr, d2.ptr );
        assert.deepEqual( d1.cells(), [ -2.5, 44, 55 ] );
    });

    it('MPREAL multiplies real values and preserves type fields', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) );

        d2.addr = 1.5;
        d2.flags = 44;
        d2.value = 55;
        d3.addr = 2;
        sil.MPREAL.call( vm, d1.ptr, d2.ptr, d3.ptr, 7, 9 );

        assert.equal( d1.addr, 3 );
        assert.equal( d1.flags, 44 );
        assert.equal( d1.value, 55 );
        assert.equal( vm.ip, 9 );
    });

    it('RCOMP branches on real comparison', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            GTLOC = 1,
            EQLOC = 2,
            LTLOC = 3;

        d1.addr = 2.5;
        d2.addr = 1.5;
        sil.RCOMP.call( vm, d1.ptr, d2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, GTLOC );

        d2.addr = 2.5;
        sil.RCOMP.call( vm, d1.ptr, d2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, EQLOC );

        d2.addr = 9.5;
        sil.RCOMP.call( vm, d1.ptr, d2.ptr, GTLOC, EQLOC, LTLOC );
        assert.equal( vm.ip, LTLOC );
    });

    it('REALST writes plain decimal strings, never exponent form', function () {
        const vm = new VM(),
            d = vm.d( vm.alloc( D ) ),
            spec = vm.alloc( 2 * D );

        const cases = [
            [ 1.5, '1.5' ],
            [ -3, '-3.' ],
            [ 1e-7, '0.0000001' ],
            [ -2.5e-10, '-0.00000000025' ],
            [ 1e24, '1000000000000000000000000.' ],
            [ 1.2246467991473532e-16, '0.00000000000000012246467991473532' ],
        ];
        for ( const [ value, text ] of cases ) {
            d.addr = value;
            sil.REALST.call( vm, spec, d.ptr );
            assert.equal( vm.s( spec ).specified, text );
        }
    });

    it('RLINT discards the fractional part', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) );

        vm.define( 'I', 6 );

        d2.addr = -3.2;
        sil.RLINT.call( vm, d1.ptr, d2.ptr, 7, 9 );
        assert.equal( d1.addr, -3 );
        assert.equal( d1.flags, 0 );
        assert.equal( d1.value, 6 );
        assert.equal( vm.ip, 9 );

        d2.addr = 3.8;
        sil.RLINT.call( vm, d1.ptr, d2.ptr, 7, 9 );
        assert.deepEqual( d1.cells(), [ 3, 0, 6 ] );
        assert.equal( vm.ip, 9 );
    });

    it('SBREAL subtracts real values and preserves type fields', function () {
        const vm = new VM(),
            d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) );

        d2.addr = 5.5;
        d2.flags = 44;
        d2.value = 55;
        d3.addr = 2.25;
        sil.SBREAL.call( vm, d1.ptr, d2.ptr, d3.ptr, 7, 9 );

        assert.equal( d1.addr, 3.25 );
        assert.equal( d1.flags, 44 );
        assert.equal( d1.value, 55 );
        assert.equal( vm.ip, 9 );
    });

    it('SPREAL', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ), s = sil.STRING.call( vm, '-0.5' );
        vm.define( 'R', 9 );
        sil.SPREAL.call( vm, d.ptr, s, 1, 2 );
        assert.equal( d.addr, -0.5 );
        assert.equal( d.value, 9 );
    });

    it('SPREAL reads back every string REALST writes', function () {
        const vm = new VM(),
            d = vm.d( vm.alloc( D ) ),
            out = vm.d( vm.alloc( D ) ),
            spec = vm.alloc( 2 * D );
        vm.define( 'R', 9 );

        const values = [
            1.5,
            -3,
            1e-7,
            -2.5e-10,
            1e24,
            5e-324,
            1.2246467991473532e-16,
        ];
        for ( const value of values ) {
            d.addr = value;
            sil.REALST.call( vm, spec, d.ptr );
            sil.SPREAL.call( vm, out.ptr, spec, 1, 2 );
            assert.equal( vm.ip, 2, `SPREAL rejected REALST's ${value}` );
            assert.equal( out.addr, value );
        }
    });
});

describe('Macros that Move Specifiers', function () {
    it('GETSPC', function () {
        const vm = new VM();
        const N = 10,
            d = vm.d( vm.alloc( D ) );
        vm.alloc( 32 );
        const s = vm.s( vm.alloc( 2 * D ) );
        s.set( 11, 22, 33, 44, 55 );
        vm.alloc( 32 );
        sil.GETSPC.call( vm, s.ptr, d.ptr, N );
        const s_indirect = vm.s( s.addr + N );
        assert.deepEqual( s.cells(), s_indirect.cells() );
    });

    it('PUTSPC', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            src = vm.s( vm.alloc( 2 * D ) );
        d.addr = vm.alloc( 100 );
        const dst = vm.s( vm.alloc( 2 * D ) );
        src.set( 55, 44, 33, 22, 11 );
        sil.PUTSPC.call( vm, d.ptr, dst.ptr - d.addr, src.ptr );
        assert.deepEqual( src.cells(), dst.cells() );
    });

    it('SETSP', function () {
        const vm = new VM();
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( vm.alloc( 2 * D ) );
        s1.set( 10, 11, 12, 13, 14 );
        s2.set( 20, 21, 22, 23, 24 );
        sil.SETSP.call( vm, s1.ptr, s2.ptr );
        assert.deepEqual( s1.cells(), [ 20, 21, 22, 23, 0, 24 ] );
        assert.deepEqual( s1.cells(), s2.cells() );
    });
});

describe('Macros that Operate on Specifiers', function () {
    it('ADDLG', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) ),
            d = vm.d( vm.alloc( D ) );
        s.length = 123;
        d.addr = 5;
        sil.ADDLG.call( vm, s.ptr, d.ptr );
        assert.equal( s.length, 123 + 5 );
    });

    it('APDSP', function () {
        const vm = new VM();
        const s1 = vm.s( sil.STRING.call( vm, 'supercalifragilistic' ) );
        vm.alloc( 50 );
        const s2 = vm.s( sil.STRING.call( vm, 'expialidocious' ) );
        sil.APDSP.call( vm, s1.ptr, s2.ptr );
        assert.equal( s1.specified, 'supercalifragilisticexpialidocious' );
    });

    it('APDSP keeps logical length separate from descriptor padding', function () {
        const vm = new VM();
        const s1 = vm.s( sil.STRING.call( vm, '99' ) );

        vm.alloc( 50 );
        const s2 = vm.s( sil.STRING.call( vm, ' bottles of beer' ) );
        sil.APDSP.call( vm, s1.ptr, s2.ptr );

        assert.equal( s1.length, '99 bottles of beer'.length );
        assert.equal( s1.specified, '99 bottles of beer' );
    });

    it('FSHRTN', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) ),
            N = 4;
        s.set( 4, 5, 6, 7, 8 );
        sil.FSHRTN.call( vm, s.ptr, N );
        assert.equal( s.offset, 11 );
        assert.equal( s.length, 4 );
    });

    it('GETBAL consumes the shortest balanced substring', function () {
        const vm = new VM();
        const spec = vm.s( vm.alloc( 2 * D ) ),
            max = vm.d( vm.alloc( D ) ),
            SLOC = 111,
            FLOC = 222;

        vm.specify( '(A*(B+C))-Z', spec.ptr );
        spec.length = 0;
        max.addr = '(A*(B+C))-Z'.length;

        sil.GETBAL.call( vm, spec.ptr, max.ptr, FLOC, SLOC );

        assert.equal( vm.ip, SLOC );
        assert.equal( spec.specified, '(A*(B+C))' );
    });

    it('GETBAL consumes one non-parenthesis character', function () {
        const vm = new VM();
        const spec = vm.s( vm.alloc( 2 * D ) ),
            max = vm.d( vm.alloc( D ) ),
            SLOC = 111,
            FLOC = 222;

        vm.specify( 'ABC', spec.ptr );
        spec.length = 0;
        max.addr = 3;

        sil.GETBAL.call( vm, spec.ptr, max.ptr, FLOC, SLOC );

        assert.equal( vm.ip, SLOC );
        assert.equal( spec.specified, 'A' );
    });

    it('GETBAL fails on right parenthesis', function () {
        const vm = new VM();
        const spec = vm.s( vm.alloc( 2 * D ) ),
            max = vm.d( vm.alloc( D ) ),
            SLOC = 111,
            FLOC = 222;

        vm.specify( ')ABC', spec.ptr );
        spec.length = 0;
        max.addr = 4;

        sil.GETBAL.call( vm, spec.ptr, max.ptr, FLOC, SLOC );

        assert.equal( vm.ip, FLOC );
        assert.equal( spec.specified, '' );
    });

    it('INTSPC', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            s = vm.s( vm.alloc( 2 * D ) );
        d.addr = -58;
        sil.INTSPC.call( vm, s.ptr, d.ptr );
        assert.equal( s.specified, '-58' );
        assert.equal( s.length, 3 );
    });

    it('INTSPC uses a private conversion buffer', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            s = vm.s( vm.alloc( 2 * D ) );

        vm.specify( 'abc', s.ptr );
        const original = s.addr;
        d.addr = 42;

        sil.INTSPC.call( vm, s.ptr, d.ptr );

        assert.equal( s.specified, '42' );
        assert.notEqual( s.addr, original );
        assert.equal( decodeString( vm.mem, original, 3 ), 'abc' );
    });

    it('LOCSP', function () {
        const vm = new VM();
        const CPD = 3,
            s = vm.s( vm.alloc( 2 * D ) ),
            d = vm.d( vm.alloc( D ) );

        // A = 0 (empty string)
        d.set( 0, 555, 666 );
        s.set( 1, 2, 3, 4, 5 );
        sil.LOCSP.call( vm, s.ptr, d.ptr );
        assert.deepEqual( s.cells(), [ 1, 2, 3, 4, 0, 0 ] );

        // A != 0
        vm.alloc( 100 );
        const di = vm.d( vm.alloc( D ) );
        d.addr = di.ptr;
        di.value = 9;
        sil.LOCSP.call( vm, s.ptr, d.ptr );
        assert.deepEqual( s.cells(), [
            d.addr,
            d.flags,
            d.value,
            4 * CPD,
            0,
            di.value,
        ] );
    });

    it('PUTLG', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) ),
            d = vm.d( vm.alloc( D ) );
        d.addr = 123;
        sil.PUTLG.call( vm, s.ptr, d.ptr );
        assert.equal( s.length, d.addr );
    });

    it('REMSP', function () {
        const vm = new VM();
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( vm.alloc( 2 * D ) ),
            s3 = vm.s( vm.alloc( 2 * D ) );
        s2.set( 1, 2, 3, 9, 5 );
        s3.set( 1, 2, 3, 4, 2 );
        sil.REMSP.call( vm, s1.ptr, s2.ptr, s3.ptr );
        assert.deepEqual( s1.cells(), [
            1,
            2,
            3,
            s2.offset + s3.length,
            0,
            s2.length - s3.length,
        ] );

        // If SPEC1 and SPEC3 are the same:
        s1.set( 0 );
        s2.set( 1, 2, 3, 9, 5 );
        const L3 = s1.length;
        sil.REMSP.call( vm, s1.ptr, s2.ptr, s1.ptr );
        assert.deepEqual( s1.cells(), [
            1,
            2,
            3,
            s2.offset + L3,
            0,
            s2.length - L3,
        ] );
    });

    it('SETLC', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) );
        sil.SETLC.call( vm, s.ptr, 555 );
        assert.equal( s.length, 555 );
    });

    it('SHORTN', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) ),
            N = 4;
        s.length = 9;
        sil.SHORTN.call( vm, s.ptr, N );
        assert.equal( s.length, 5 );
    });

    it('STREAM', function () {
        const vm = new VM();
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( sil.STRING.call( vm, '43.2   ' ) ),
            stype = vm.d( vm.alloc( D ) );

        vm.define( 'STYPE', stype.ptr );
        vm.define( 'FLITYP', 6 );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[n] ?? 0 );
        sil.STREAM.call( vm, s1.ptr, s2.ptr, 'INTGTB', -1, -2, -3 );

        assert.equal( s1.specified, '43.2' );
    });

    it('STREAM runout', function () {
        const vm = new VM();
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( sil.STRING.call( vm, '   ' ) ),
            stype = vm.d( vm.alloc( D ) ),
            error = 1,
            runout = 2,
            sloc = 3;

        vm.define( 'STYPE', stype.ptr );
        vm.define( 'EQTYP', 4 );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[n] ?? 0 );
        sil.STREAM.call( vm, s1.ptr, s2.ptr, 'IBLKTB', error, runout, sloc );

        assert.equal( vm.ip, 2 );
        assert.equal( stype.addr, 0 );
        assert.equal( s1.specified, '   ' );
        assert.equal( s2.length, 0 );
    });

    it('STREAM stop branches to success after consuming token', function () {
        const vm = new VM();
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( sil.STRING.call( vm, ' = X' ) ),
            stype = vm.d( vm.alloc( D ) ),
            error = 1,
            runout = 2,
            sloc = 3;

        vm.define( 'STYPE', stype.ptr );
        vm.define( 'EQTYP', 4 );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[n] ?? 0 );
        sil.STREAM.call( vm, s1.ptr, s2.ptr, 'IBLKTB', error, runout, sloc );

        assert.equal( vm.ip, 3 );
        assert.equal( stype.addr, vm.$( 'EQTYP' ) );
        assert.equal( s1.specified, ' =' );
        assert.equal( s2.specified, ' X' );
    });

    it('STREAM routes non-byte characters to the table fallback', function () {
        const vm = new VM();
        const nonByteDigit = String.fromCharCode( 0x130 );
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( sil.STRING.call( vm, nonByteDigit ) ),
            stype = vm.d( vm.alloc( D ) ),
            error = 1,
            runout = 2,
            sloc = 3;

        vm.define( 'STYPE', stype.ptr );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[n] ?? 0 );
        sil.STREAM.call( vm, s1.ptr, s2.ptr, 'INTGTB', error, runout, sloc );

        assert.equal( vm.ip, error );
        assert.equal( stype.addr, 0 );
        assert.equal( s1.length, 1 );
    });

    it('SUBSP', function () {
        const vm = new VM();
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( vm.alloc( 2 * D ) ),
            s3 = vm.s( vm.alloc( 2 * D ) ),
            FLOC = 1,
            SLOC = 2;
        // L3 > L2
        s2.set( 5, 2, 3, 4, 5 );
        s3.set( 6, 7, 8, 9, 8 );
        sil.SUBSP.call( vm, s1.ptr, s2.ptr, s3.ptr, FLOC, SLOC );
        assert.equal( vm.ip, 2 );
        assert.deepEqual( s1.cells(), [ 6, 7, 8, 9, 0, 5 ] );

        // L3 == L2
        s3.length = 5;
        s1.set( 0 );
        sil.SUBSP.call( vm, s1.ptr, s2.ptr, s3.ptr, FLOC, SLOC );
        assert.equal( vm.ip, 2 );
        assert.deepEqual( s1.cells(), [ 6, 7, 8, 9, 0, 5 ] );

        // L3 < L2
        s3.length = 2;
        s1.set( 0 );
        sil.SUBSP.call( vm, s1.ptr, s2.ptr, s3.ptr, FLOC, SLOC );
        assert.equal( vm.ip, 1 );
        assert.deepEqual( s1.cells(), [ 0, 0, 0, 0, 0, 0 ] );
    });

    it('TRIMSP', function () {
        const vm = new VM();
        const s1 = vm.s( vm.alloc( 2 * D ) ),
            s2 = vm.s( vm.specify( 'abcd   ' ) );

        sil.TRIMSP.call( vm, s1.ptr, s2.ptr );
        assert.equal( s2.specified, 'abcd   ' );
        assert.equal( s1.specified, 'abcd' );

        vm.specify( 'efgh', s2.ptr );
        sil.TRIMSP.call( vm, s1.ptr, s2.ptr );
        assert.equal( s1.specified, 'efgh' );
    });
});

describe('Macros that Operate on Syntax Tables', function () {
    it('CLERTB resolves a table id and fills character entries', function () {
        const vm = new VM();
        sil.CLERTB.call( vm, 'SNABTB', 'ERROR' );

        const { actions, fallback } = vm.syntaxTables.SNABTB;
        assert.equal( actions.length, constants.ALPHSZ );
        assert.deepEqual( fallback, {
            put: 0,
            action: Action.RUNOUT,
            next: null,
        } );
        for ( let code = 0; code < constants.ALPHSZ; code++ ) {
            assert.equal( actions[code], Action.ERROR );
        }
    });

    it('binds non-byte fallback separately from byte slots', function () {
        const vm = new VM();
        vm.define( 'NBTYP', 77 );
        bindSyntaxTables( vm.syntaxTables, ( n ) => vm.symbols[n] ?? 0 );

        const table = vm.syntaxTables.FRWDTB;
        assert.equal( table.actions.length, constants.ALPHSZ );
        assert.equal( table.puts.length, constants.ALPHSZ );
        assert.equal( table.next.length, constants.ALPHSZ );
        assert.deepEqual( table.fallback, {
            put: 77,
            action: Action.STOPSH,
            next: null,
        } );
    });

    it('PLUGTB updates the entries selected by a specifier', function () {
        const vm = new VM();
        const spec = vm.s( sil.STRING.call( vm, 'AZ' ) );
        sil.CLERTB.call( vm, 'SNABTB', 'ERROR' );
        sil.PLUGTB.call( vm, 'SNABTB', 'STOP', spec.ptr );

        const { actions } = vm.syntaxTables.SNABTB;
        assert.equal( actions['A'.charCodeAt( 0 )], Action.STOP );
        assert.equal( actions['Z'.charCodeAt( 0 )], Action.STOP );
        assert.equal( actions['B'.charCodeAt( 0 )], Action.ERROR );
    });

    it('PLUGTB ignores non-byte entries in the plug specifier', function () {
        const vm = new VM();
        const nonByteDigit = String.fromCharCode( 0x130 );
        const spec = vm.s( sil.STRING.call(
            vm,
            'A' + nonByteDigit,
        ) );
        sil.CLERTB.call( vm, 'SNABTB', 'ERROR' );
        sil.PLUGTB.call( vm, 'SNABTB', 'STOP', spec.ptr );

        const { actions, next } = vm.syntaxTables.SNABTB;
        assert.equal( actions['A'.charCodeAt( 0 )], Action.STOP );
        assert.equal( next.length, constants.ALPHSZ );
        assert.equal( next[0x130], undefined );
    });
});

describe('Macros that Construct Pattern Nodes', function () {
    it('CPYPAT', function () {
        const vm = new VM();
        const dst = vm.d( vm.alloc( D ) ),
            src = vm.d( vm.alloc( D ) ),
            shift = vm.d( vm.alloc( D ) ),
            offset = vm.d( vm.alloc( D ) ),
            next = vm.d( vm.alloc( D ) ),
            size = vm.d( vm.alloc( D ) );

        dst.addr = vm.alloc( 20 );
        const dstBase = dst.addr;
        src.addr = vm.alloc( 20 );
        shift.addr = 100;
        offset.addr = 30;
        next.addr = 60;
        size.addr = 9;

        vm.d( src.addr + 3 ).set( 1, 2, 2 );
        vm.d( src.addr + 6 ).set( 6, 0, 9 );
        vm.d( src.addr + 9 ).set( 12, 0, 15 );

        sil.CPYPAT.call(
            vm,
            dst.ptr,
            src.ptr,
            shift.ptr,
            offset.ptr,
            next.ptr,
            size.ptr,
        );

        assert.deepEqual( vm.d( dstBase + 3 ).cells(), [ 1, 2, 2 ] );
        assert.deepEqual( vm.d( dstBase + 6 ).cells(), [ 36, 0, 39 ] );
        assert.deepEqual( vm.d( dstBase + 9 ).cells(), [ 112, 0, 115 ] );
    });

    it('MAKNOD fills a node and returns it through DESCR1', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            d4 = vm.d( vm.alloc( D ) ),
            d5 = vm.d( vm.alloc( D ) ),
            d6 = vm.d( vm.alloc( D ) );

        d2.addr = vm.alloc( 5 * D );
        d3.addr = 30;
        d4.addr = 40;
        d5.set( 1, 2, 3 );
        d6.set( 4, 5, 6 );

        sil.MAKNOD.call( vm, d1.ptr, d2.ptr, d3.ptr, d4.ptr, d5.ptr, d6.ptr );

        assert.deepEqual( vm.d( d2.addr + D ).cells(), [ 1, 2, 3 ] );
        assert.equal( vm.d( d2.addr + 2 * D ).addr, 40 );
        assert.equal( vm.d( d2.addr + 3 * D ).addr, 30 );
        assert.deepEqual( vm.d( d2.addr + 4 * D ).cells(), [ 4, 5, 6 ] );
        assert.deepEqual( d1.cells(), d2.cells() );
    });

    it('MAKNOD without DESCR6 leaves the fourth field untouched', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            d4 = vm.d( vm.alloc( D ) ),
            d5 = vm.d( vm.alloc( D ) );

        d2.addr = vm.alloc( 5 * D );
        vm.d( d2.addr + 4 * D ).set( 9, 9, 9 );
        d5.set( 1, 2, 3 );

        sil.MAKNOD.call( vm, d1.ptr, d2.ptr, d3.ptr, d4.ptr, d5.ptr );

        assert.deepEqual( vm.d( d2.addr + 4 * D ).cells(), [ 9, 9, 9 ] );
    });
});

describe('Macros that Operate on Tree Nodes', function () {
    // Tree-node field offsets are program symbols; the image places
    // FATHER/LSON/RSIB/CODE at these descriptor-cell offsets within a node.
    function treeVM() {
        const vm = new VM();
        vm.define( 'FATHER', 3 );
        vm.define( 'LSON', 6 );
        vm.define( 'RSIB', 9 );
        vm.define( 'CODE', 12 );
        return vm;
    }

    it('ADDSON links a new son under a parent node', function () {
        const vm = treeVM();
        const parent = vm.d( vm.alloc( D ) ),
            son = vm.d( vm.alloc( D ) ),
            pNode = vm.alloc( 5 * D ),
            sNode = vm.alloc( 5 * D );

        parent.set( pNode, 1, 2 );
        son.set( sNode, 3, 4 );
        vm.d( pNode + 6 ).set( 700, 7, 8 ); // existing left son
        vm.d( pNode + 12 ).value = 5; // CODE count

        sil.ADDSON.call( vm, parent.ptr, son.ptr );

        assert.deepEqual( vm.d( sNode + 3 ).cells(), [ pNode, 1, 2 ] );
        assert.deepEqual( vm.d( sNode + 9 ).cells(), [ 700, 7, 8 ] );
        assert.deepEqual( vm.d( pNode + 6 ).cells(), [ sNode, 3, 4 ] );
        assert.equal( vm.d( pNode + 12 ).value, 6 );
    });

    it('ADDSIB links a new sibling after an existing node', function () {
        const vm = treeVM();
        const node = vm.d( vm.alloc( D ) ),
            sib = vm.d( vm.alloc( D ) ),
            nNode = vm.alloc( 5 * D ),
            sNode = vm.alloc( 5 * D ),
            fNode = vm.alloc( 5 * D );

        node.addr = nNode;
        sib.set( sNode, 3, 4 );
        vm.d( nNode + 3 ).set( fNode, 5, 6 ); // node FATHER -> fNode
        vm.d( nNode + 9 ).set( 800, 7, 8 ); // node existing RSIB
        vm.d( fNode + 12 ).value = 2; // father CODE count

        sil.ADDSIB.call( vm, node.ptr, sib.ptr );

        assert.deepEqual( vm.d( sNode + 9 ).cells(), [ 800, 7, 8 ] );
        assert.deepEqual( vm.d( sNode + 3 ).cells(), [ fNode, 5, 6 ] );
        assert.deepEqual( vm.d( nNode + 9 ).cells(), [ sNode, 3, 4 ] );
        assert.equal( vm.d( fNode + 12 ).value, 3 );
    });

    it('INSERT splices a new node above an existing one', function () {
        const vm = treeVM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            a1 = vm.alloc( 5 * D ),
            a2 = vm.alloc( 5 * D ),
            a3 = vm.alloc( 5 * D ),
            a4 = vm.alloc( 5 * D );

        d1.set( a1, 1, 2 );
        d2.set( a2, 3, 4 );
        vm.d( a1 + 3 ).set( a3, 5, 6 ); // A1 FATHER -> a3
        vm.d( a3 + 6 ).addr = a4; // A3 LSON -> a4
        vm.d( a2 + 12 ).value = 7; // A2 CODE count

        sil.INSERT.call( vm, d1.ptr, d2.ptr );

        assert.deepEqual( vm.d( a1 + 3 ).cells(), [ a2, 3, 4 ] );
        assert.deepEqual( vm.d( a4 + 9 ).cells(), [ a2, 3, 4 ] );
        assert.deepEqual( vm.d( a2 + 3 ).cells(), [ a3, 5, 6 ] );
        assert.deepEqual( vm.d( a2 + 6 ).cells(), [ a1, 1, 2 ] );
        assert.equal( vm.d( a2 + 12 ).value, 8 );
    });
});

describe('Input and Output Macros', function () {
    it('ENFILE makes subsequent reads return EOF', function () {
        const vm = createFileVM();
        const file = path.join(
                os.tmpdir(),
                'snoflake-enfile-' + process.pid + '.sno',
            ),
            unit = vm.d( vm.alloc( D ) ),
            spec = vm.s( vm.alloc( 2 * D ) ),
            eof = 1,
            error = 2,
            success = 3,
            ptr = vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( file, 'ABCD\nEFGH\n' );
        vm.options.file = file;
        unit.addr = 5;
        spec.set( ptr, 0, 0, 0, 4 );

        try {
            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( vm.ip, success );

            sil.ENFILE.call( vm, unit.ptr );

            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( vm.ip, eof );
            assert.equal( unit.addr, 0 );
        } finally {
            fs.unlinkSync( file );
        }
    });

    it('FORMAT', function () {
        const vm = createVM();
        const ptr = sil.FORMAT.call( vm, 'test' );
        assert.equal( vm.s( ptr ).specified, 'test' );
    });

    it('OUTPUT renders %d fields', function () {
        const vm = createVM();
        const unit = vm.d( vm.alloc( D ) ),
            format = sil.FORMAT.call(
                vm,
                'Error %d in statement %d at level %d',
            ),
            args = [ 8, 12345, 2 ].map( ( n ) => {
                const descr = vm.d( vm.alloc( D ) );
                descr.addr = n;
                return descr.ptr;
            } ),
            logs = [],
            oldStdout = vm.units.stdout;

        vm.units.stdout = {
            write: function ( line ) {
                logs.push( line );
            },
        };
        try {
            sil.OUTPUT.call( vm, unit.ptr, format, args );
        } finally {
            vm.units.stdout = oldStdout;
        }

        assert.deepEqual( logs, [ 'Error 8 in statement 12345 at level 2' ] );
    });

    it('OUTPUT renders %f fields and splits lines on \\n', function () {
        const vm = createVM();
        const unit = vm.d( vm.alloc( D ) ),
            format = sil.FORMAT.call(
                vm,
                '%f ms. average per statement executed\\n',
            ),
            descr = vm.d( vm.alloc( D ) ),
            logs = [],
            oldStdout = vm.units.stdout;

        descr.addr = 1234.5678;
        vm.units.stdout = {
            write: function ( line ) {
                logs.push( line );
            },
        };
        try {
            sil.OUTPUT.call( vm, unit.ptr, format, [ descr.ptr ] );
        } finally {
            vm.units.stdout = oldStdout;
        }

        assert.deepEqual( logs, [
            '1234.57 ms. average per statement executed',
            '',
        ] );
    });

    it('REWIND restarts a unit from its first record', function () {
        const vm = createFileVM();
        const file = path.join(
                os.tmpdir(),
                'snoflake-rewind-' + process.pid + '.sno',
            ),
            unit = vm.d( vm.alloc( D ) ),
            spec = vm.s( vm.alloc( 2 * D ) ),
            eof = 1,
            error = 2,
            success = 3,
            ptr = vm.alloc( 8, '.'.charCodeAt( 0 ) ),
            read = () =>
                Array.from( vm.mem.slice( ptr, ptr + 4 ) ).map(
                    ( c ) => String.fromCharCode( c ),
                ).join( '' );

        fs.writeFileSync( file, 'AAAA\nBBBB\n' );
        vm.options.file = file;
        unit.addr = 5;
        spec.set( ptr, 0, 0, 0, 4 );

        try {
            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( read(), 'AAAA' );
            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( read(), 'BBBB' );

            sil.REWIND.call( vm, unit.ptr );

            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( read(), 'AAAA' );
        } finally {
            fs.unlinkSync( file );
        }
    });

    it('STPRNT writes the record raw, dropping NULs', function () {
        const vm = createVM();
        const key = vm.d( vm.alloc( D ) ),
            block = vm.d( vm.alloc( D ) ),
            item = sil.STRING.call( vm, '0 DATA\0\0' ),
            logs = [],
            oldStdout = vm.units.stdout;

        block.addr = vm.alloc( 9 );
        vm.d( block.addr + D ).addr = 6;

        vm.units.stdout = {
            write: function ( line ) {
                logs.push( line );
            },
        };
        try {
            sil.STPRNT.call( vm, key.ptr, block.ptr, item );
        } finally {
            vm.units.stdout = oldStdout;
        }

        assert.deepEqual( logs, [ '0 DATA' ] );
    });

    it('STREAD', function () {
        const vm = createFileVM();
        const file = path.join(
                os.tmpdir(),
                'snoflake-stread-' + process.pid + '.sno',
            ),
            unit = vm.d( vm.alloc( D ) ),
            spec = vm.s( vm.alloc( 2 * D ) ),
            eof = 1,
            error = 2,
            success = 3,
            ptr = vm.alloc( 16, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( file, 'END\n1234567890\n' );
        vm.options.file = file;
        unit.addr = 5;
        spec.set( ptr, 0, 0, 2, 8 );
        // Read as the compiler's source feed, so reads are fixed-column cards.
        vm.symbols.UNIT = unit.ptr;

        try {
            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( vm.ip, 3 );
            assert.equal(
                Array.from( vm.mem.slice( ptr, ptr + 2 ) ).map(
                    function ( c ) {
                        return String.fromCharCode( c );
                    },
                ).join( '' ),
                '..',
            );
            assert.equal(
                Array.from( vm.mem.slice( ptr + 2, ptr + 10 ) ).map(
                    function ( c ) {
                        return String.fromCharCode( c );
                    },
                ).join( '' ),
                'END     ',
            );

            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal(
                Array.from( vm.mem.slice( ptr + 2, ptr + 10 ) ).map(
                    function ( c ) {
                        return String.fromCharCode( c );
                    },
                ).join( '' ),
                '12345678',
            );

            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( vm.ip, 1 );
            assert.equal( unit.addr, 0 );

            unit.addr = 5;
            vm.ip = 7;
            sil.REWIND.call( vm, unit.ptr );
            sil.STREAD.call( vm, spec.ptr, unit.ptr, 7, error, 7 );
            sil.STREAD.call( vm, spec.ptr, unit.ptr, 7, error, 7 );
            sil.STREAD.call( vm, spec.ptr, unit.ptr, 7, error, 7 );
            assert.equal( vm.ip, 7 );
            assert.equal( unit.addr, 0 );
        } finally {
            fs.unlinkSync( file );
        }
    });

    it('STREAD reads source then runtime input, with mode-appropriate length handling', function () {
        const vm = createFileVM();
        const sourceFile = path.join(
                os.tmpdir(),
                'snoflake-stread-source-' + process.pid + '.sno',
            ),
            inputFile = path.join(
                os.tmpdir(),
                'snoflake-stread-input-' + process.pid + '.txt',
            ),
            unit = vm.d( vm.alloc( D ) ),
            spec = vm.s( vm.alloc( 2 * D ) ),
            eof = vm.alloc( 1, 1 ),
            error = vm.alloc( 1, 2 ),
            success = vm.alloc( 1, 3 ),
            ptr = vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( sourceFile, 'SO\n' );
        fs.writeFileSync( inputFile, 'DATA\n' );
        vm.options.file = sourceFile;
        vm.options.input = inputFile;
        unit.addr = constants.UNITI;
        spec.set( ptr, 0, 0, 0, 6 );

        try {
            // The compiler reads source as cards, so the short line pads to the
            // requested width and SPEC.length stays put.
            vm.symbols.UNIT = unit.ptr;
            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( spec.length, 6 );
            assert.equal(
                Array.from( vm.mem.slice( ptr, ptr + 6 ) ).map(
                    function ( c ) {
                        return String.fromCharCode( c );
                    },
                ).join( '' ),
                'SO    ',
            );

            // INPUT reads the post-source segment as a stream. SPEC.length is
            // updated to the actual record length so the caller sees DATA, not
            // a padded six-char field.
            vm.symbols.UNIT = undefined;
            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( spec.length, 4 );
            assert.equal(
                Array.from( vm.mem.slice( ptr, ptr + spec.length ) ).map(
                    function ( c ) {
                        return String.fromCharCode( c );
                    },
                ).join( '' ),
                'DATA',
            );
        } finally {
            fs.unlinkSync( sourceFile );
            fs.unlinkSync( inputFile );
        }
    });

    it('STREAD keeps runtime INPUT record length without discarding significant blanks', function () {
        const vm = createFileVM();
        const inputFile = path.join(
                os.tmpdir(),
                'snoflake-stread-input-blanks-' + process.pid + '.txt',
            ),
            unit = vm.d( vm.alloc( D ) ),
            spec = vm.s( vm.alloc( 2 * D ) ),
            eof = vm.alloc( 1, 1 ),
            error = vm.alloc( 1, 2 ),
            success = vm.alloc( 1, 3 ),
            ptr = vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( inputFile, 'ABC   \n' );
        vm.options.input = inputFile;
        unit.addr = constants.UNITI;
        spec.set( ptr, 0, 0, 0, 8 );

        try {
            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( spec.length, 6 );
            assert.equal(
                Array.from( vm.mem.slice( ptr, ptr + spec.length ) ).map(
                    function ( c ) {
                        return String.fromCharCode( c );
                    },
                ).join( '' ),
                'ABC   ',
            );
        } finally {
            fs.unlinkSync( inputFile );
        }
    });

    it('STREAD treats an empty runtime INPUT record as data, not EOF', function () {
        const vm = createFileVM();
        const inputFile = path.join(
                os.tmpdir(),
                'snoflake-stread-input-empty-' + process.pid + '.txt',
            ),
            unit = vm.d( vm.alloc( D ) ),
            spec = vm.s( vm.alloc( 2 * D ) ),
            eof = vm.alloc( 1, 1 ),
            error = vm.alloc( 1, 2 ),
            success = vm.alloc( 1, 3 ),
            ptr = vm.alloc( 8, '.'.charCodeAt( 0 ) );

        fs.writeFileSync( inputFile, '\nNEXT\n' );
        vm.options.input = inputFile;
        unit.addr = constants.UNITI;
        spec.set( ptr, 0, 0, 0, 8 );

        try {
            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( vm.ip, success );
            assert.equal( spec.length, 0 );

            spec.length = 8;
            sil.STREAD.call( vm, spec.ptr, unit.ptr, eof, error, success );
            assert.equal( spec.length, 4 );
            assert.equal(
                Array.from( vm.mem.slice( ptr, ptr + spec.length ) ).map(
                    function ( c ) {
                        return String.fromCharCode( c );
                    },
                ).join( '' ),
                'NEXT',
            );
        } finally {
            fs.unlinkSync( inputFile );
        }
    });
});

describe('Macros that Depend on Operating System Facilities', function () {
    it('DATE', function () {
        const vm = new VM();
        const s = vm.s( vm.alloc( 2 * D ) ),
            year = new Date().getFullYear();
        sil.DATE.call( vm, s.ptr );
        assert( s.specified.includes( year ) );
    });

    it('ENDEX sets the exit code and halts', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) );

        d.addr = 0;
        assert.equal( sil.ENDEX.call( vm, d.ptr ), true );
        assert.equal( vm.exitCode, 0 );
        assert.equal( vm.ip, -1 );

        d.addr = 4;
        assert.equal( sil.ENDEX.call( vm, d.ptr ), false );
        assert.equal( vm.exitCode, 1 );
    });

    it('INIT', function () {
        const vm = new VM();
        vm.define( 'FRSGPT', vm.d( vm.alloc( D ) ).ptr );
        vm.define( 'HDSGPT', vm.d( vm.alloc( D ) ).ptr );
        vm.define( 'TLSGP1', vm.d( vm.alloc( D ) ).ptr );

        sil.INIT.call( vm );
        assert.equal(
            vm.d( 'TLSGP1' ).addr - vm.d( 'HDSGPT' ).addr,
            D * 50000,
        );
        assert.equal( vm.memPtr, vm.d( 'TLSGP1' ).addr );
        assert( vm.d( 'FRSGPT' ).addr < vm.d( 'TLSGP1' ).addr );
    });

    it('LINK calls a slotted extension and returns its result', function () {
        const vm = new VM( {
            extensions: { 'ADD2(INTEGER,INTEGER)INTEGER': ( a, b ) => a + b },
        } );
        vm.define( 'I', 6 );
        const result = vm.d( vm.alloc( D ) ),
            argsBase = vm.alloc( 2 * D ),
            argsPtr = vm.d( vm.alloc( D ) ),
            slot = vm.d( vm.alloc( D ) );

        vm.d( argsBase ).addr = 20;
        vm.d( argsBase + D ).addr = 22;
        argsPtr.addr = argsBase;
        slot.addr = vm.extensionsBySlot.push( vm.extensions.ADD2 ) - 1;

        sil.LINK.call( vm, result.ptr, argsPtr.ptr, 0, slot.ptr, 7, 9 );

        assert.deepEqual( result.cells(), [ 42, 0, 6 ] );
    });

    it('LINK routes a FAIL result to FLOC', function () {
        const vm = new VM( {
            extensions: {
                'NEG(INTEGER)INTEGER': ( n ) => ( n < 0 ? FAIL : n ),
            },
        } );
        vm.define( 'I', 6 );
        const result = vm.d( vm.alloc( D ) ),
            argsBase = vm.alloc( D ),
            argsPtr = vm.d( vm.alloc( D ) ),
            slot = vm.d( vm.alloc( D ) ),
            FLOC = 7;

        vm.d( argsBase ).addr = -5;
        argsPtr.addr = argsBase;
        slot.addr = vm.extensionsBySlot.push( vm.extensions.NEG ) - 1;

        sil.LINK.call( vm, result.ptr, argsPtr.ptr, 0, slot.ptr, FLOC, 9 );

        assert.equal( vm.ip, FLOC );
    });

    it('LOAD binds a registered extension into a slot', function () {
        const vm = new VM( {
            extensions: { 'DUP(INTEGER)INTEGER': ( n ) => n * 2 },
        } );
        const d = vm.d( vm.alloc( D ) ),
            name = sil.STRING.call( vm, 'DUP' ),
            empty = sil.STRING.call( vm, '' );

        sil.LOAD.call( vm, d.ptr, name, empty, 7, 9 );
        assert.equal( vm.extensionsBySlot[d.addr].args[0], 'INTEGER' );
    });

    it('LOAD fails to FLOC for an unknown extension', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) ),
            name = sil.STRING.call( vm, 'NOPE' ),
            empty = sil.STRING.call( vm, '' ),
            FLOC = 7;

        sil.LOAD.call( vm, d.ptr, name, empty, FLOC, 9 );
        assert.equal( vm.ip, FLOC );
    });

    it('MSTIME', function () {
        const vm = new VM();
        const d = vm.d( vm.alloc( D ) );
        d.set( 1, 2, 3 );
        sil.MSTIME.call( vm, d.ptr );
        assert.deepEqual( d.cells(), [ 0, 0, 0 ] );
    });
});

describe('Miscellaneous Macros', function () {
    it('LINKOR appends to the end of a node or-chain', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            A = vm.alloc( 10 * D );

        d1.addr = A;
        d2.addr = 555;
        vm.d( A + 2 * D ).addr = 9; // first link points further along
        vm.d( A + 2 * D + 9 ).addr = 0; // chain tail

        sil.LINKOR.call( vm, d1.ptr, d2.ptr );

        assert.equal( vm.d( A + 2 * D + 9 ).addr, 555 );
        assert.equal( vm.d( A + 2 * D ).addr, 9 );
    });

    it('LINKOR sets the field directly when the chain is empty', function () {
        const vm = new VM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            A = vm.alloc( 5 * D );

        d1.addr = A;
        d2.addr = 77;
        vm.d( A + 2 * D ).addr = 0;

        sil.LINKOR.call( vm, d1.ptr, d2.ptr );
        assert.equal( vm.d( A + 2 * D ).addr, 77 );
    });

    it('LOCAPT', function () {
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
            result = vm.d( vm.alloc( D ) ),
            list = vm.d( vm.alloc( D ) ),
            key = vm.d( vm.alloc( D ) ),
            found = FOUND_IP,
            missing = MISSING_IP,
            base = vm.alloc( DESCR + ( PAIR_COUNT * PAIR_WIDTH ) ),
            firstType = base + DESCR,
            firstValue = firstType + DESCR,
            secondType = firstType + PAIR_WIDTH,
            secondValue = secondType + DESCR;

        function setDescriptor( ptr, fields ) {
            vm.d( ptr ).set.apply( vm.d( ptr ), fields );
        }

        list.set( base, LIST_FLAGS, LIST_VALUE );
        vm.d( base ).set( 0, 0, PAIR_COUNT * PAIR_WIDTH );

        // LOCAPT searches only type descriptors: A+D, A+3D, ...
        // The first type has the same value field as ZEROCL but is not the
        // same descriptor, so it must not be treated as a hole.
        setDescriptor.call( this, firstType, SAME_VALUE_AS_ZEROCL );
        setDescriptor.call( this, firstValue, FIRST_VALUE_DESCRIPTOR );

        // The second type is an exact ZEROCL descriptor.  AUGATL relies on
        // LOCAPT returning the descriptor immediately before that slot.
        setDescriptor.call( this, secondType, ZEROCL );
        setDescriptor.call( this, secondValue, SECOND_VALUE_DESCRIPTOR );
        key.set.apply( key, ZEROCL );

        sil.LOCAPT.call( vm, result.ptr, list.ptr, key.ptr, missing, found );

        assert.equal( vm.ip, FOUND_IP );
        assert.deepEqual( result.cells(), [
            firstValue,
            LIST_FLAGS,
            LIST_VALUE,
        ] );

        key.set.apply( key, SAME_ADDRESS_DIFFERENT_FLAGS );
        vm.ip = 0;
        sil.LOCAPT.call( vm, result.ptr, list.ptr, key.ptr, missing, found );

        assert.equal( vm.ip, MISSING_IP );
    });

    it('LOCAPV', function () {
        const vm = miscVM();
        const result = vm.d( vm.alloc( D ) ),
            list = vm.d( vm.alloc( D ) ),
            key = vm.d( vm.alloc( D ) ),
            found = 123,
            missing = 456,
            base = vm.alloc( 15 );

        list.set( base, 7, 11 );
        vm.d( base ).set( 0, 0, 6 );
        vm.d( base + 3 ).set( 99, 0, 1 );
        vm.d( base + 6 ).set( 42, 0, 2 );
        vm.d( base + 12 ).set( 42, 0, 2 );
        key.set( 42, 0, 2 );

        sil.LOCAPV.call( vm, result.ptr, list.ptr, key.ptr, missing, found );

        assert.equal( vm.ip, 123 );
        assert.deepEqual( result.cells(), [ base, 7, 11 ] );

        key.set( 43, 0, 2 );
        vm.ip = 0;
        sil.LOCAPV.call( vm, result.ptr, list.ptr, key.ptr, missing, found );

        assert.equal( vm.ip, 456 );
    });

    it('LVALUE', function () {
        const vm = miscVM();
        const values = [ 42, 28, 96, 14, 2, 77 ],
            least = Math.min.apply( Math, values ),
            DESCR1 = vm.d( vm.alloc( D ) ),
            DESCR2 = vm.d( vm.alloc( D ) ),
            step = 2 * 3;
        let offset = 0;

        DESCR2.addr = vm.alloc( values.length * step );
        while ( values.length ) {
            const value = values.pop();
            vm.mem.set( [
                values.length === 0 ? 0 : offset + step,
                0,
                0,
                value,
                0,
                0,
            ], DESCR2.addr + offset );
            offset += step;
        }

        sil.LVALUE.call( vm, DESCR1.ptr, DESCR2.ptr );
        assert.equal( DESCR1.addr, least );
    });

    it('RPLACE replaces characters in place', function () {
        const vm = miscVM();
        const target = vm.s( sil.STRING.call( vm, 'spoon' ) ),
            from = vm.s( sil.STRING.call( vm, 'po' ) ),
            to = vm.s( sil.STRING.call( vm, 'PO' ) );

        sil.RPLACE.call( vm, target.ptr, from.ptr, to.ptr );

        assert.equal( target.specified, 'sPOOn' );
    });

    it('RPLACE uses the last replacement for duplicate source characters', function () {
        const vm = miscVM();
        const target = vm.s( sil.STRING.call( vm, 'banana' ) ),
            from = vm.s( sil.STRING.call( vm, 'anab' ) ),
            to = vm.s( sil.STRING.call( vm, 'ANXY' ) );

        sil.RPLACE.call( vm, target.ptr, from.ptr, to.ptr );

        assert.equal( target.specified, 'YXNXNX' );
    });

    it('RPLACE leaves a zero-length target unchanged', function () {
        const vm = miscVM();
        const target = vm.s( sil.STRING.call( vm, 'abc' ) ),
            from = vm.s( sil.STRING.call( vm, 'abc' ) ),
            to = vm.s( sil.STRING.call( vm, 'ABC' ) );

        target.length = 0;
        sil.RPLACE.call( vm, target.ptr, from.ptr, to.ptr );

        assert.equal( target.length, 0 );
        assert.equal( vm.mem[target.addr], 'a'.charCodeAt( 0 ) );
    });

    it('RPLACE respects specifier offsets and lengths', function () {
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

        sil.RPLACE.call( vm, target.ptr, from.ptr, to.ptr );

        target.offset = 0;
        target.length = 10;
        assert.equal( target.specified, 'xxaBCDefxx' );
    });

    it('SPCINT', function () {
        const vm = miscVM();
        const d = vm.d( vm.alloc( D ) ),
            s = vm.s( vm.alloc( 2 * D ) ),
            FLOC = 1,
            SLOC = 2,
            I = 6;
        vm.define( 'I', I );
        vm.specify( '-00521', s.ptr );
        sil.SPCINT.call( vm, d.ptr, s.ptr, FLOC, SLOC );
        assert.equal( d.addr, -521 );
        assert.equal( d.flags, 0 );
        assert.equal( d.value, I );
        assert.equal( vm.ip, 2 );
    });

    it('TOP', function () {
        const vm = miscVM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            block = [],
            TTL = constants.TTL;
        vm.define( 'TTL', TTL );
        for ( let i = 0; i < 10; i++ ) {
            block.push( vm.d( vm.alloc( D ) ) );
        }

        // N = 6
        d3.set( block.at( -1 ).ptr, 123, 456 );
        block.at( -7 ).flags |= TTL;
        sil.TOP.call( vm, d1.ptr, d2.ptr, d3.ptr );
        assert.equal( d2.addr, 6 * 3 );
        assert.deepEqual( d1.cells(), [ block.at( -7 ).ptr, 123, 456 ] );
        assert.equal( d3.addr - d2.addr, d1.addr );

        // N = 0
        block.at( -1 ).flags |= TTL;
        sil.TOP.call( vm, d1.ptr, d2.ptr, d3.ptr );
        assert.equal( d2.addr, 0 );
        assert.deepEqual( d1.cells(), [ block.at( -1 ).ptr, 123, 456 ] );
        assert.equal( d3.addr - d2.addr, d1.addr );
    });

    it('TOP throws if no title descriptor is found', function () {
        const vm = miscVM();
        const d1 = vm.d( vm.alloc( D ) ),
            d2 = vm.d( vm.alloc( D ) ),
            d3 = vm.d( vm.alloc( D ) ),
            block = [];
        vm.define( 'TTL', constants.TTL );
        for ( let i = 0; i < 3; i++ ) {
            block.push( vm.d( vm.alloc( D ) ) );
        }

        d3.addr = block.at( -1 ).ptr;
        assert.throws(
            function () {
                sil.TOP.call( vm, d1.ptr, d2.ptr, d3.ptr );
            }.bind( this ),
            RangeError,
        );
    });

    it('VARID', function () {
        const vm = miscVM();
        const d = vm.d( vm.alloc( D ) ),
            s = vm.s( sil.STRING.call( vm, 'hello' ) );

        vm.define( 'OBSIZ', defaults.OBSIZ );
        sil.VARID.call( vm, d.ptr, s.ptr );
        assert.equal( d.addr, 744 );
        assert.equal( d.addr % D, 0 );
        assert.equal( d.value, 3679317 );
    });
});
