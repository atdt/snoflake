var SNOBOL = require( './js/snobol.js' ),
    vm;

vm = new SNOBOL.VM( process.argv.reduce( function ( p, c ) {
    var k, v, m = /--(\w+)(?:=(.*))?/g.exec( c );
    if ( m ) {
        k = m[1];
        if ( m[2] === undefined ) {
            v = true;
        } else if ( m[2].includes( ',' ) ) {
            v = m[2].split( ',' );
        } else {
            v = m[2];
        }
        p[k] = v;
    }
    return p;
}, {} ) );

vm.reset();
vm.run( SNOBOL.interp( vm ) );
