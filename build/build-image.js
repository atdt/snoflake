// Translate SIL source into the JavaScript runtime image.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { assemble } from '../src/assemble.js';
import { normalizeListOperands, parse as parseSil } from './sil-parser.js';

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const sourcePath = path.join(
    __dirname,
    '..',
    'external',
    'v311-snoflake.sil',
);

const listing = normalizeListOperands(
    parseSil( fs.readFileSync( sourcePath, 'utf8' ) ),
);
const image = assemble( listing );

process.stdout.write( serializeImage( image ) );

// JSON rather than a JS module, so the image is readable as plain data.
// The memory snapshot is stored as a plain array; the importer
// rehydrates it into a Float64Array.
function serializeImage( image ) {
    const symbols = JSON.stringify( image.symbols, null, 4 )
        .replace( /\n/g, '\n    ' );
    return [
        '{',
        '    "symbols": ' + symbols + ',',
        '    "instructions": [',
        serializeInstructions( image.instructions ),
        '    ],',
        '    "memory": [',
        serializeMemory( image.memory ),
        '    ]',
        '}',
        '',
    ].join( '\n' );
}

function serializeMemory( memory ) {
    const cellsPerLine = 16;
    const lines = [];

    for ( let i = 0; i < memory.length; i += cellsPerLine ) {
        const chunk = memory.subarray( i, i + cellsPerLine );
        lines.push( '        ' + chunk.join( ',' ) );
    }

    return lines.join( ',\n' );
}

function serializeInstructions( instructions ) {
    return instructions
        .map( ( stmt ) => '        ' + JSON.stringify( stmt ) )
        .join( ',\n' );
}
