// L-systems: SNOBOL rewrites the grammar string and walks the result as
// a turtle, drawing through the canvas bindings. Runs synchronously on
// the main thread, deferred one frame so the status text paints first.

import { runSnoflake } from '../lib/runner.js';
import { fillSelect, loadSource } from '../lib/dom.js';
import { createEditor } from '../lib/editor.js';
import { makeTurtleExtensions, presets } from '../lib/turtle.js';

const sourceUrl = new URL( '../programs/lsystem.sno', import.meta.url ),
    lineLimit = 160;

export function init() {
    const source = createEditor( document.querySelector( '#lsystem-source' ) ),
        canvas = document.querySelector( '#lsystem-canvas' ),
        strings = document.querySelector( '#lsystem-strings' ),
        picker = document.querySelector( '#lsystem-preset' ),
        run = document.querySelector( '#lsystem-run' ),
        status = document.querySelector( '#lsystem-status' );

    function setStatus( text ) {
        status.textContent = text;
    }

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

    function draw() {
        const preset = presets[picker.value];
        if ( !preset ) return;

        strings.textContent = '';
        setStatus( 'Drawing' );

        requestAnimationFrame( function () {
            let gen = 0;
            const extensions = makeTurtleExtensions(
                canvas,
                preset,
                function ( str ) {
                    appendGeneration( gen++, str );
                },
            );

            try {
                const result = runSnoflake( source.getValue(), { extensions } );
                if ( result.stderr ) {
                    setStatus( 'Error' );
                    console.error( result.stderr );
                } else {
                    setStatus( 'Drawn' );
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
            draw();
        } catch ( e ) {
            setStatus( 'Error' );
            console.error( e );
        }
    }

    run.addEventListener( 'click', draw );
    picker.addEventListener( 'change', draw );
    reload();
}
