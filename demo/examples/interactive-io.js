// Interactive I/O: run a SNOBOL program whose blocking reads wait for
// input typed into the terminal pane. createSession() runs the program on
// this thread, suspending whenever it reads and resuming as the user sends
// lines. Eliza's work between reads is light, so no Web Worker is needed.

import { createSession } from '../../src/snobol.js';
import { loadSource } from '../lib/dom.js';

const sourceUrl = new URL( '../programs/eliza.sno', import.meta.url );

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

    let session = null,
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
        // On the main thread the session is just an object; dropping the
        // reference is all the teardown there is.
        session = null;
        running = false;
        setInputEnabled( false );
    }

    function start() {
        stop();
        log.textContent = '';
        setStatus( 'Running' );

        session = createSession( {
            source:   source.value,
            onOutput: ( text ) => append( text ),
            onError:  ( text ) => append( text, 'error' ),
            onDone:   ( exitCode ) => {
                running = false;
                setInputEnabled( false );
                setStatus( exitCode ? 'Error' : 'Finished' );
            },
        } );

        running = true;
        setInputEnabled( true );
        session.start();
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
        if ( !running || !session ) return;
        const text = line.value;
        line.value = '';
        append( '> ' + text, 'input' );
        session.send( text );
    } );

    line.addEventListener( 'keydown', function ( event ) {
        if ( event.key !== 'Enter' || event.shiftKey ) return;
        event.preventDefault();
        form.requestSubmit();
    } );

    eof.addEventListener( 'click', function () {
        if ( !running || !session ) return;
        append( '<EOF>', 'input' );
        session.end();
        setInputEnabled( false );
    } );

    restart.addEventListener( 'click', start );
    reset.addEventListener( 'click', reload );
    setInputEnabled( false );
    reload();
}
