var SNOBOL = require( './js/snobol.js' ),
    vm;

function optionValue( value ) {
    if ( value === undefined ) {
        return true;
    }
    if ( value === 'true' ) {
        return true;
    }
    if ( value === 'false' ) {
        return false;
    }
    if ( value.includes( ',' ) ) {
        return value.split( ',' );
    }
    return value;
}

vm = new SNOBOL.VM( process.argv.reduce( function ( p, c ) {
    var k, v, m = /--(\w+)(?:=(.*))?/g.exec( c );
    if ( c === '-f' ) {
        p.caseFold = false;
        return p;
    }
    if ( m ) {
        k = m[1];
        v = optionValue( m[2] );
        p[k] = v;
    }
    return p;
}, {} ) );

vm.reset();
vm.run( SNOBOL.interp( vm ) );
