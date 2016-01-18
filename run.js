var SNOBOL = require( './js/snobol.js' );

var vm = new SNOBOL.VM(),
    program = SNOBOL.interp( vm );

SNOBOL.DEBUG = ( process.argv.indexOf( '--debug' ) !== -1 );
vm.run( program );
