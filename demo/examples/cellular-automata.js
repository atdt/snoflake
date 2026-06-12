// Cellular automata: SNOBOL computes each row from the previous one by
// sliding a 3-cell window and paints the accumulated rows as a pixel grid.

import { fillSelect, textSetter } from '../lib/dom.js';
import { createEditor } from '../lib/editor.js';
import { replay } from '../lib/canvas2d.js';
import { presets } from '../lib/automata.js';
import program from '../programs/cellular-automata.sno';

// Emitted next to this bundle by build.js, so the path is output-relative.
const workerUrl = new URL( './canvas-worker.js', import.meta.url );

export function init() {
    const source = createEditor(
            document.querySelector( '#cellular-automata-source' ),
        ),
        canvas = document.querySelector( '#cellular-automata-canvas' ),
        picker = document.querySelector( '#cellular-automata-preset' ),
        run = document.querySelector( '#cellular-automata-run' ),
        setStatus = textSetter(
            document.querySelector( '#cellular-automata-status' ),
        );

    let worker = null;

    function stop() {
        if ( worker ) {
            worker.terminate();
            worker = null;
        }
    }

    function execute() {
        if ( !presets[picker.value] ) return;
        stop();
        setStatus( 'Running' );

        let errored = false;
        worker = new Worker( workerUrl, { type: 'module' } );
        worker.addEventListener( 'message', function ( event ) {
            const message = event.data;
            if ( message.type === 'stderr' ) {
                errored = true;
                setStatus( 'Error' );
                console.error( message.line );
            } else if ( message.type === 'done' ) {
                replay( canvas, message.commands );
                worker = null;
                if ( !errored ) setStatus( 'Done' );
            }
        } );
        worker.addEventListener( 'error', function ( event ) {
            setStatus( 'Error: ' + event.message );
        } );

        worker.postMessage( {
            kind: 'ca',
            source: source.getValue(),
            width: canvas.width,
            height: canvas.height,
            preset: picker.value,
        } );
    }

    function reload() {
        source.setValue( program );
        fillSelect( picker, presets );
        execute();
    }

    run.addEventListener( 'click', execute );
    picker.addEventListener( 'change', execute );
    reload();
}
