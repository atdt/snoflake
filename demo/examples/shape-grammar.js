// Shape grammar: SNOBOL rewrites a worklist of NAME(args) symbols into a
// 3-D scene, emitting one box at a time through an EMIT extension. The
// program runs in a worker; each box streams to the canvas3d renderer.

import { createEditor } from '../lib/editor.js';
import { createScene } from '../lib/canvas3d.js';
import { textSetter } from '../lib/dom.js';
import program from '../programs/shape-grammar.sno';

// Emitted next to this bundle by build.js, so the path is output-relative.
const workerUrl = new URL( './shape-worker.js', import.meta.url );

export function init() {
    const source = createEditor(
            document.querySelector( '#shape-grammar-source' ),
        ),
        canvas = document.querySelector( '#shape-grammar-canvas' ),
        setStatus = textSetter(
            document.querySelector( '#shape-grammar-status' ),
        ),
        restart = document.querySelector( '#shape-grammar-restart' ),
        reset = document.querySelector( '#shape-grammar-reset' );

    const scene = createScene( canvas );
    let worker = null;

    function stop() {
        if ( worker ) {
            worker.terminate();
            worker = null;
        }
    }

    function start() {
        stop();
        scene.clear();
        scene.resetCamera();

        let count = 0;
        worker = new Worker( workerUrl, { type: 'module' } );
        worker.addEventListener( 'message', function ( event ) {
            const message = event.data;
            if ( message.type === 'box' ) {
                scene.addBox( message.box );
                setStatus( ++count + ' boxes' );
            } else if ( message.type === 'done' ) {
                setStatus( count + ' boxes · finished' );
            } else if ( message.type === 'stderr' ) {
                setStatus( 'Error: ' + message.line );
            }
        } );
        worker.addEventListener( 'error', function ( event ) {
            setStatus( 'Error: ' + event.message );
        } );

        setStatus( 'Running' );
        worker.postMessage( { type: 'start', source: source.getValue() } );
    }

    function reload() {
        source.setValue( program );
        start();
    }

    restart.addEventListener( 'click', start );
    reset.addEventListener( 'click', reload );
    reload();
}
