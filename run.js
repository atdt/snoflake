var SNOBOL = require( './js/snobol.js' ),
    vm = new SNOBOL.VM(),
    assert = require( 'assert' );


SNOBOL.DEBUG = ( process.argv.indexOf( '--debug' ) !== -1 );

vm.reset();
vm.run( SNOBOL.interp( vm ) );
