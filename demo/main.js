"use strict";

import { runSnoflake } from './run-snoflake.js';

const sampleProgram = `* Snoflake browser demo: read input and match a pattern
READ LINE = INPUT :F(END)
 LINE ('GOLD' | 'BLUE') . SHADE ('FISH' | 'BIRD') . ANIMAL :S(SHOW)F(READ)
SHOW OUTPUT = SHADE
 OUTPUT = ANIMAL
 :(READ)
END
`;

const sampleInput = `THE BLUEBIRD
GOLDFISH
`;

const editor = document.querySelector( '#source' ),
      input = document.querySelector( '#input' ),
      output = document.querySelector( '#output' ),
      status = document.querySelector( '#status' ),
      runButton = document.querySelector( '#run' ),
      resetButton = document.querySelector( '#reset' );

function renderResult( result ) {
    const parts = [];

    if ( result.stdout ) {
        parts.push( result.stdout );
    }
    if ( result.stderr ) {
        parts.push( result.stderr );
    }

    output.textContent = parts.join( '\n' ) || '(no output)';
    status.textContent = result.stderr ? 'Error' : 'Finished';
}

function run() {
    status.textContent = 'Running';
    renderResult( runSnoflake( editor.value, { inputText: input.value } ) );
}

editor.value = sampleProgram;
input.value = sampleInput;
runButton.addEventListener( 'click', run );
resetButton.addEventListener( 'click', function () {
    editor.value = sampleProgram;
    input.value = sampleInput;
    run();
} );

run();
