// Interactive I/O: run a SNOBOL program in a Web Worker so its blocking
// reads can wait for input typed into the terminal pane. The worker
// suspends on each read; this module feeds it lines as the user sends them.

import { loadSource } from '../lib/dom.js';

const sourceUrl = new URL( '../programs/eliza.sno', import.meta.url ),
      workerUrl = new URL( '../workers/eliza-worker.js', import.meta.url );

export function init() {
    const source  = document.querySelector( '#interactive-io-source' ),
          log     = document.querySelector( '#interactive-io-conversation' ),
          status  = document.querySelector( '#interactive-io-status' ),
          restart = document.querySelector( '#interactive-io-restart' ),
          reset   = document.querySelector( '#interactive-io-reset' ),
          form    = document.querySelector( '#interactive-io-input-form' ),
          line    = document.querySelector( '#interactive-io-input-line' ),
          send    = document.querySelector( '#interactive-io-send' ),
          eof     = document.querySelector( '#interactive-io-eof' );

    let worker = null,
        running = false;

    function setStatus( text ) {
        status.textContent = text;
    }

    function setInputEnabled( enabled ) {
        line.disabled = send.disabled = eof.disabled = !enabled;
        form.classList.toggle( 'disabled', !enabled );
    }

    function append( text, kind = 'program' ) {
        const el = document.createElement( 'div' );
        el.className = 'terminal-line ' + kind;
        el.textContent = text;
        log.append( el );
        log.scrollTop = log.scrollHeight;
    }

    function stop() {
        if ( worker ) {
            worker.terminate();
            worker = null;
        }
        running = false;
        setInputEnabled( false );
    }

    function start() {
        stop();
        log.textContent = '';

        worker = new Worker( workerUrl, { type: 'module' } );
        worker.addEventListener( 'message', function ( event ) {
            const message = event.data;
            if ( message.type === 'stdout' ) {
                append( message.line );
            } else if ( message.type === 'stderr' ) {
                append( message.line, 'error' );
            } else if ( message.type === 'done' ) {
                running = false;
                setInputEnabled( false );
                setStatus( message.exitCode ? 'Error' : 'Finished' );
            }
        } );
        worker.addEventListener( 'error', function ( event ) {
            append( event.message, 'error' );
            running = false;
            setInputEnabled( false );
            setStatus( 'Error' );
        } );

        running = true;
        setStatus( 'Running' );
        setInputEnabled( true );
        worker.postMessage( { type: 'start', source: source.value } );
    }

    async function reload() {
        stop();
        log.textContent = '';
        setStatus( 'Loading' );
        try {
            source.value = await loadSource( sourceUrl );
            setStatus( 'Ready' );
            start();
        } catch ( e ) {
            append( e.message, 'error' );
            setStatus( 'Error' );
        }
    }

    form.addEventListener( 'submit', function ( event ) {
        event.preventDefault();
        if ( !running || !worker ) return;
        const text = line.value;
        line.value = '';
        append( '> ' + text, 'input' );
        worker.postMessage( { type: 'input', line: text } );
    } );

    line.addEventListener( 'keydown', function ( event ) {
        if ( event.key !== 'Enter' || event.shiftKey ) return;
        event.preventDefault();
        form.requestSubmit();
    } );

    eof.addEventListener( 'click', function () {
        if ( !running || !worker ) return;
        append( '<EOF>', 'input' );
        worker.postMessage( { type: 'eof' } );
        setInputEnabled( false );
    } );

    restart.addEventListener( 'click', start );
    reset.addEventListener( 'click', reload );
    setInputEnabled( false );
    reload();
}
