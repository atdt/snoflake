// Cellular automata: SNOBOL computes each row from the previous one by
// sliding a 3-cell window; the automata module supplies the rule tables
// and paints the accumulated rows as a pixel grid.

import { runSnoflake } from '../lib/runner.js';
import { fillSelect, loadSource } from '../lib/dom.js';
import { createEditor } from '../lib/editor.js';
import { makeAutomatonExtensions, presets } from '../lib/automata.js';

const sourceUrl = new URL(
    '../programs/cellular-automata.sno',
    import.meta.url,
);

export function init() {
    const source = createEditor(
            document.querySelector( '#cellular-automata-source' ),
        ),
        canvas = document.querySelector( '#cellular-automata-canvas' ),
        picker = document.querySelector( '#cellular-automata-preset' ),
        run = document.querySelector( '#cellular-automata-run' ),
        status = document.querySelector( '#cellular-automata-status' );

    function setStatus( text ) {
        status.textContent = text;
    }

    function execute() {
        const preset = presets[picker.value];
        if ( !preset ) return;

        setStatus( 'Running' );
        requestAnimationFrame( function () {
            const extensions = makeAutomatonExtensions( canvas, preset );
            try {
                const result = runSnoflake( source.getValue(), { extensions } );
                if ( result.stderr ) {
                    setStatus( 'Error' );
                    console.error( result.stderr );
                } else {
                    setStatus( 'Done' );
                }
            } catch ( e ) {
                setStatus( 'Error' );
                console.error( e );
            }
        } );
    }

    async function reload() {
        setStatus( 'Loading' );
        try {
            source.setValue( await loadSource( sourceUrl ) );
            fillSelect( picker, presets );
            setStatus( 'Ready' );
            execute();
        } catch ( e ) {
            setStatus( 'Error' );
            console.error( e );
        }
    }

    run.addEventListener( 'click', execute );
    picker.addEventListener( 'change', execute );
    reload();
}
