// L-systems: SNOBOL rewrites the grammar string and walks the result as a
// turtle, drawing through the canvas bindings.

import { fillSelect, textSetter } from '../lib/dom.js';
import { createEditor } from '../lib/editor.js';
import { replay } from '../lib/canvas2d.js';
import { presets } from '../lib/turtle.js';
import program from '../programs/lsystem.sno';

// Emitted next to this bundle by build.js, so the path is output-relative.
const workerUrl = new URL( './canvas-worker.js', import.meta.url );
const lineLimit = 160;

export function init() {
    const source = createEditor( document.querySelector( '#lsystem-source' ) ),
        canvas = document.querySelector( '#lsystem-canvas' ),
        strings = document.querySelector( '#lsystem-strings' ),
        picker = document.querySelector( '#lsystem-preset' ),
        run = document.querySelector( '#lsystem-run' ),
        setStatus = textSetter( document.querySelector( '#lsystem-status' ) );

    let worker = null;

    // Add a "gen N — NN ch — <string>" row to the generations pane.
    function appendGeneration( gen, str ) {
        const row = document.createElement( 'div' ),
            label = document.createElement( 'div' ),
            length = document.createElement( 'span' ),
            body = document.createElement( 'div' );
        row.className = 'strings-row';
        label.className = 'gen';
        label.textContent = 'gen ' + gen;
        length.className = 'len';
        length.textContent = str.length + ' ch';
        label.append( length );
        body.className = 'body';
        body.textContent = str.length > lineLimit
            ? str.slice( 0, lineLimit ) + '…'
            : str;
        row.append( label, body );
        strings.append( row );
    }

    function stop() {
        if ( worker ) {
            worker.terminate();
            worker = null;
        }
    }

    function draw() {
        if ( !presets[picker.value] ) return;
        stop();
        strings.textContent = '';
        setStatus( 'Drawing' );

        let gen = 0,
            errored = false;
        worker = new Worker( workerUrl, { type: 'module' } );
        worker.addEventListener( 'message', function ( event ) {
            const message = event.data;
            if ( message.type === 'emit' ) {
                appendGeneration( gen++, message.str );
            } else if ( message.type === 'stderr' ) {
                errored = true;
                setStatus( 'Error' );
                console.error( message.line );
            } else if ( message.type === 'done' ) {
                replay( canvas, message.commands );
                worker = null;
                if ( !errored ) setStatus( 'Drawn' );
            }
        } );
        worker.addEventListener( 'error', function ( event ) {
            setStatus( 'Error: ' + event.message );
        } );

        worker.postMessage( {
            kind: 'lsystem',
            source: source.getValue(),
            width: canvas.width,
            height: canvas.height,
            preset: picker.value,
        } );
    }

    function reload() {
        source.setValue( program );
        fillSelect( picker, presets );
        draw();
    }

    run.addEventListener( 'click', draw );
    picker.addEventListener( 'change', draw );
    reload();
}
