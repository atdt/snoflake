import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import peggy from 'peggy';
import { generate } from 'astring';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
      grammar = fs.readFileSync( path.join( __dirname, '..', 'translator', 'sil.peg' ), 'utf8' ),
      parser = peggy.generate( grammar );

function operandsFor( source, symbols ) {
    const ast = parser.parse( source ),
          code = generate( ast ),
          SNOBOL = {},
          vm = { $: function ( name ) { return symbols[ name ]; } };

    Function( 'SNOBOL', code )( SNOBOL );
    return SNOBOL.interp()[ 0 ][ 2 ]( vm );
}

describe( 'SIL translator', function () {
    it( 'parses unary minus as an operand', function () {
        const operands = operandsFor(
            '       GETAC   TVAL,PDLPTR,-2*DESCR\n END\n',
            { TVAL: 10, PDLPTR: 20, DESCR: 3 }
        );

        assert.deepEqual( operands, [ 10, 20, -6 ] );
    } );

    it( 'keeps unary minus tighter than addition', function () {
        const operands = operandsFor(
            '       TEST    -A+B\n END\n',
            { A: 2, B: 5 }
        );

        assert.deepEqual( operands, [ 3 ] );
    } );
} );
