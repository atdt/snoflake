#!/usr/bin/env node
"use strict";

import SNOBOL from '../src/snobol.js';
import process from "node:process";

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

const vm = new SNOBOL.VM( process.argv.slice( 2 ).reduce( function ( p, c ) {
    const m = /--(\w+)(?:=(.*))?/g.exec( c );
    if ( c === '-f' ) {
        p.caseFold = false;
        return p;
    }
    if ( m ) {
        const k = m[1];
        const v = optionValue( m[2] );
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
process.exitCode = vm.exitCode;
