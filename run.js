var SNOBOL = require( './js/snobol.js' ),
    vm = new SNOBOL.VM(),
    assert = require( 'assert' );

vm.reset();

SNOBOL.DEBUG = ( process.argv.indexOf( '--debug' ) !== -1 );

vm.run( SNOBOL.interp( vm ) );

var s1 = vm.s(), s2 = vm.s(), s3 = vm.s(), s4 = vm.s(), s5 = vm.s();
var s6 = vm.s(), s7 = vm.s(), s8 = vm.s(), s9 = vm.s(), s0 = vm.s();

s1.update( 1, 2, 3, 4, 5 );
s2.update( 6, 7, 8, 9, 0 );
s3.update( 8, 3, 8, 7, 5 );
s4.update( 9, 3, 9, 2, 8 );
s5.update( 4, 3, 9, 2, 8 );

SNOBOL.sil.SPUSH.call( vm, [ s1.ptr, s2.ptr, s3.ptr ] );
SNOBOL.sil.SPUSH.call( vm, [ s4.ptr, s5.ptr ] );
SNOBOL.sil.SPOP.call( vm, [ s6.ptr, s7.ptr, s8.ptr ] );
SNOBOL.sil.SPOP.call( vm, [ s9.ptr, s0.ptr ] );

assert( s6.isEqualTo( s5 ) );
assert( s7.isEqualTo( s4 ) );
assert( s8.isEqualTo( s3 ) );
assert( s9.isEqualTo( s2 ) );
assert( s0.isEqualTo( s1 ) );


var d1 = vm.s(), d2 = vm.s(), d3 = vm.s(), d4 = vm.s(), d5 = vm.s();
var d6 = vm.s(), d7 = vm.s(), d8 = vm.s(), d9 = vm.s(), d0 = vm.s();

d1.update( 3, 4, 5 );
d2.update( 8, 9, 0 );
d3.update( 8, 7, 5 );
d4.update( 9, 2, 8 );
d5.update( 9, 2, 8 );

SNOBOL.sil.PUSH.call( vm, [ d1.ptr, d2.ptr, d3.ptr ] );
SNOBOL.sil.PUSH.call( vm, [ d4.ptr, d5.ptr ] );
SNOBOL.sil.POP.call( vm, [ d6.ptr, d7.ptr, d8.ptr ] );
SNOBOL.sil.POP.call( vm, [ d9.ptr, d0.ptr ] );

assert( d6.isEqualTo( d5 ) );
assert( d7.isEqualTo( d4 ) );
assert( d8.isEqualTo( d3 ) );
assert( d9.isEqualTo( d2 ) );
assert( d0.isEqualTo( d1 ) );

/*
var d1 = vm.s(), d2 = vm.s();

d1.update( 1, 2, 3 );

console.log( 'd1 before: ' + d1.toString() );
console.log( 'd2 before: ' + d2.toString() );
SNOBOL.sil.PUSH.call( vm, d1.ptr );
SNOBOL.sil.POP.call( vm, d2.ptr );
console.log( 'd1 after: ' + d1.toString() );
console.log( 'd2 after: ' + d2.toString() );

// vm.run( SNOBOL.interp( vm ) );
*/
