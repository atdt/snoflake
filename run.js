var SNOBOL = require( './js/snobol.js' ),
    vm = new SNOBOL.VM(),
    assert = require( 'assert' );


SNOBOL.options = process.argv.reduce( function ( p, c ) {
    var k, v, m = /--(\w+)(?:=(.*))?/g.exec( c );
    if ( m ) {
        k = m[1];
        v = m[2] === undefined || m[2].split(',');
        p[k] = v;
    }
    return p;
}, {} );

SNOBOL.DEBUG = SNOBOL.options.debug;

vm.reset();
vm.run( SNOBOL.interp( vm ) );
