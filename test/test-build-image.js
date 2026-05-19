import assert from 'node:assert';
import { describe, it } from 'node:test';
import { assemble } from '../src/snobol.js';
import { parse } from '../build/sil-parser.js';

describe( 'SIL build pipeline', function () {
    it( 'parses symbol operands as data', function () {
        const listing = parse( '       GETAC   TVAL,PDLPTR\n END\n' );

        assert.deepEqual( listing[ 0 ], {
            label: null,
            macro: 'GETAC',
            operands: [ { type: 'symbol', name: 'TVAL' }, { type: 'symbol', name: 'PDLPTR' } ]
        } );
    } );

    it( 'assembles parsed operand expressions', function () {
        const listing = parse( '       TEST    DESCR,-DESCR+UNITI,-2*DESCR\n END\n' ),
              image = assemble( listing );

        assert.deepEqual( image.instructions[ 0 ][ 2 ], [ 3, 2, -6 ] );
    } );

    it( 'treats a trailing comma before a comment as punctuation', function () {
        const listing = parse( 'BEGIN  INIT    ,          Initialize system\n END\n' );

        assert.deepEqual( listing[ 0 ], {
            label: 'BEGIN',
            macro: 'INIT',
            operands: [ null ]
        } );
    } );
} );
