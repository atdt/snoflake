// Batch I/O: run a SNOBOL program synchronously over a block of input
// text and show whatever it writes to stdout/stderr.

import { runSnoflake } from '../lib/runner.js';
import { createEditor } from '../lib/editor.js';
import program from '../programs/segmentation.sno';

const sampleInput =
    'Hello world!\nこんにちは世界。\nสวัสดีชาวโลก!\nПривет мир!\n';

export function init() {
    const source = createEditor( document.querySelector( '#batch-io-source' ) ),
        input = document.querySelector( '#batch-io-input' ),
        output = document.querySelector( '#batch-io-output' ),
        status = document.querySelector( '#batch-io-status' ),
        run = document.querySelector( '#batch-io-run' ),
        reset = document.querySelector( '#batch-io-reset' );

    function setStatus( text ) {
        status.textContent = text;
    }

    function execute() {
        output.textContent = '';
        setStatus( 'Running' );

        try {
            const result = runSnoflake( source.getValue(), {
                inputText: input.value,
            } );
            output.textContent = [ result.stdout, result.stderr ]
                .filter( Boolean ).join( '\n' ) || '(no output)';
            setStatus(
                result.stderr || result.exitCode ? 'Error' : 'Finished',
            );
        } catch ( e ) {
            output.textContent = 'Execution error: ' + ( e && e.message || e );
            setStatus( 'Error' );
        }
    }

    function reload() {
        output.textContent = '';
        source.setValue( program );
        input.value = sampleInput;
        setStatus( 'Ready' );
    }

    run.addEventListener( 'click', execute );
    reset.addEventListener( 'click', reload );
    reload();
}
