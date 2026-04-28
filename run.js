"use strict";

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

vm = new SNOBOL.VM( process.argv.slice( 2 ).reduce( function ( p, c ) {
    var k, v, m = /--(\w+)(?:=(.*))?/g.exec( c );
    if ( c === '-f' ) {
        p.caseFold = false;
        return p;
    }
    if ( m ) {
        k = m[1];
        v = optionValue( m[2] );
        p[k] = v;
        return p;
    }
    if ( p.file === undefined ) {
        p.file = c;
    }
    return p;
}, {} ) );

vm.reset();
vm.run( SNOBOL.interp( vm ) );
