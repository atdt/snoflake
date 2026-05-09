import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import peggy from 'peggy';
import SNOBOL from '../src/snobol.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) ),
      grammar = fs.readFileSync( path.join( __dirname, '..', 'translator', 'sil.peg' ), 'utf8' ),
      parser = peggy.generate( grammar );

describe( 'SIL translator', function () {
    it( 'parses symbol operands as data', function () {
        const listing = parser.parse( '       GETAC   TVAL,PDLPTR\n END\n' );

        assert.deepEqual( listing[ 0 ], {
            label: null,
            macro: 'GETAC',
            operands: [ { symbol: 'TVAL' }, { symbol: 'PDLPTR' } ],
            comment: ''
        } );
    } );

    it( 'assembles parsed operand expressions', function () {
        const listing = parser.parse( '       TEST    DESCR,-DESCR+UNITI,-2*DESCR\n END\n' ),
              image = SNOBOL.assemble( listing );

        assert.deepEqual( image.instructions[ 0 ][ 2 ], [ 3, 2, -6 ] );
    } );
} );
