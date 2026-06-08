// Interactive I/O: run a SNOBOL program whose blocking reads wait for
// input typed into the terminal pane. createSession() runs the program on
// this thread, suspending whenever it reads and resuming as the user sends
// lines. Eliza's work between reads is light, so no Web Worker is needed.

import { createSession } from '../../src/snobol.js';
import { createEditor } from '../lib/editor.js';
import { textSetter } from '../lib/dom.js';
import program from '../programs/eliza.sno';

export function init() {
    const source = createEditor(
            document.querySelector( '#interactive-io-source' ),
        ),
        log = document.querySelector( '#interactive-io-conversation' ),
        setStatus = textSetter(
            document.querySelector( '#interactive-io-status' ),
        ),
        restart = document.querySelector( '#interactive-io-restart' ),
        reset = document.querySelector( '#interactive-io-reset' ),
        form = document.querySelector( '#interactive-io-input-form' ),
        line = document.querySelector( '#interactive-io-input-line' ),
        send = document.querySelector( '#interactive-io-send' ),
        eof = document.querySelector( '#interactive-io-eof' );

    let session = null;

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
        setInputEnabled( false );
    }

    function start() {
        stop();
        log.textContent = '';
        setStatus( 'Running' );

        session = createSession( {
            source: source.getValue(),
            onOutput: ( text ) => append( text ),
            onError: ( text ) => append( text, 'error' ),
            onDone: ( exitCode ) => {
                session = null;
                setInputEnabled( false );
                setStatus( exitCode ? 'Error' : 'Finished' );
            },
        } );

        setInputEnabled( true );
        session.start();
    }

    function reload() {
        source.setValue( program );
        start();
    }

    form.addEventListener( 'submit', function ( event ) {
        event.preventDefault();
        if ( !session ) return;
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
        if ( !session ) return;
        append( '<EOF>', 'input' );
        session.end();
        setInputEnabled( false );
    } );

    restart.addEventListener( 'click', start );
    reset.addEventListener( 'click', reload );
    setInputEnabled( false );
    reload();
}
