// Shape grammar: SNOBOL rewrites a worklist of NAME(args) symbols into a
// 3-D scene, emitting one box at a time through an EMIT extension. The
// program runs in a worker; each box streams to the canvas3d renderer.

import { loadSource } from '../lib/dom.js';
import { createScene } from '../lib/canvas3d.js';

const sourceUrl = new URL( '../programs/shape-grammar.sno', import.meta.url ),
      workerUrl = new URL( '../workers/shape-worker.js', import.meta.url );

export function init() {
    const source  = document.querySelector( '#shape-grammar-source' ),
          canvas  = document.querySelector( '#shape-grammar-canvas' ),
          status  = document.querySelector( '#shape-grammar-status' ),
          restart = document.querySelector( '#shape-grammar-restart' ),
          reset   = document.querySelector( '#shape-grammar-reset' );

    const scene = createScene( canvas );
    let worker = null;

    function setStatus( text ) {
        status.textContent = text;
    }

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
        worker.postMessage( { type: 'start', source: source.value } );
    }

    async function reload() {
        stop();
        scene.clear();
        setStatus( 'Loading' );
        try {
            source.value = await loadSource( sourceUrl );
            setStatus( 'Ready' );
            start();
        } catch ( e ) {
            setStatus( e.message );
        }
    }

    restart.addEventListener( 'click', start );
    reset.addEventListener( 'click', reload );
    reload();
}
