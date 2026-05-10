"use strict";

const sampleProgramUrl = new URL( './eliza.sno', import.meta.url ),
      maxInputBytes = 4096,
      editor = document.querySelector( '#source' ),
      output = document.querySelector( '#output' ),
      status = document.querySelector( '#status' ),
      runButton = document.querySelector( '#run' ),
      resetButton = document.querySelector( '#reset' ),
      inputForm = document.querySelector( '#input-form' ),
      inputLine = document.querySelector( '#input-line' ),
      sendButton = document.querySelector( '#send' ),
      eofButton = document.querySelector( '#eof' ),
      encoder = new TextEncoder();

let worker = null,
    stdin = null,
    running = false;

function setStatus( text ) {
    status.textContent = text;
}

function setInputEnabled( enabled ) {
    inputLine.disabled = !enabled;
    sendButton.disabled = !enabled;
    eofButton.disabled = !enabled;
    inputForm.classList.toggle( 'disabled', !enabled );
}

function clearConversation() {
    output.textContent = '';
}

function appendLine( text, kind = 'program' ) {
    const line = document.createElement( 'div' );
    line.className = 'terminal-line ' + kind;
    line.textContent = text;
    output.append( line );
    output.scrollTop = output.scrollHeight;
}

function stopSession() {
    if ( worker ) {
        worker.terminate();
        worker = null;
    }
    if ( stdin ) {
        stdin.close();
        stdin = null;
    }
    running = false;
    setInputEnabled( false );
}

async function loadSampleProgram() {
    setStatus( 'Loading' );
    const response = await fetch( sampleProgramUrl );
    if ( !response.ok ) {
        throw new Error( 'Could not load ' + sampleProgramUrl.pathname );
    }
    editor.value = await response.text();
    setStatus( 'Ready' );
}

function createSharedStdin() {
    if ( !globalThis.SharedArrayBuffer || !globalThis.crossOriginIsolated ) {
        throw new Error( 'Interactive input needs the demo server headers. Run `npm run demo` and open the printed URL.' );
    }

    const stateBuffer = new SharedArrayBuffer( Int32Array.BYTES_PER_ELEMENT * 2 ),
          lineBuffer = new SharedArrayBuffer( maxInputBytes ),
          state = new Int32Array( stateBuffer ),
          bytes = new Uint8Array( lineBuffer );

    return {
        shared() {
            return {
                state: stateBuffer,
                line: lineBuffer
            };
        },

        writeLine( line ) {
            const encoded = encoder.encode( line );
            if ( encoded.length > bytes.length ) {
                throw new Error( 'Input line is longer than ' + bytes.length + ' bytes.' );
            }
            if ( Atomics.load( state, 0 ) !== 0 ) {
                throw new Error( 'The previous input line is still pending.' );
            }

            bytes.fill( 0 );
            bytes.set( encoded );
            Atomics.store( state, 1, encoded.length );
            Atomics.store( state, 0, 1 );
            Atomics.notify( state, 0 );
        },

        close() {
            Atomics.store( state, 0, 2 );
            Atomics.notify( state, 0 );
        }
    };
}

function startSession() {
    stopSession();
    clearConversation();

    try {
        stdin = createSharedStdin();
    } catch ( e ) {
        appendLine( e.message, 'error' );
        setStatus( 'Error' );
        return;
    }

    worker = new Worker( './worker.js', { type: 'module' } );
    worker.addEventListener( 'message', function ( event ) {
        const message = event.data;

        if ( message.type === 'stdout' ) {
            appendLine( message.line );
        } else if ( message.type === 'stderr' ) {
            appendLine( message.line, 'error' );
        } else if ( message.type === 'done' ) {
            running = false;
            setInputEnabled( false );
            setStatus( message.exitCode ? 'Error' : 'Finished' );
        }
    } );
    worker.addEventListener( 'error', function ( event ) {
        appendLine( event.message, 'error' );
        running = false;
        setInputEnabled( false );
        setStatus( 'Error' );
    } );

    running = true;
    setStatus( 'Running' );
    setInputEnabled( true );
    worker.postMessage( {
        type: 'start',
        source: editor.value,
        stdin: stdin.shared()
    } );
    inputLine.focus();
}

async function resetDemo() {
    stopSession();
    clearConversation();
    try {
        await loadSampleProgram();
        startSession();
    } catch ( e ) {
        appendLine( e.message, 'error' );
        setStatus( 'Error' );
    }
}

inputForm.addEventListener( 'submit', function ( event ) {
    event.preventDefault();
    if ( !running || !stdin ) return;

    const line = inputLine.value;
    inputLine.value = '';
    appendLine( '> ' + line, 'input' );

    try {
        stdin.writeLine( line );
    } catch ( e ) {
        appendLine( e.message, 'error' );
    }
} );

inputLine.addEventListener( 'keydown', function ( event ) {
    if ( event.key !== 'Enter' || event.shiftKey ) return;
    event.preventDefault();
    inputForm.requestSubmit();
} );

eofButton.addEventListener( 'click', function () {
    if ( !running || !stdin ) return;
    appendLine( '<EOF>', 'input' );
    stdin.close();
    setInputEnabled( false );
} );

runButton.addEventListener( 'click', startSession );
resetButton.addEventListener( 'click', resetDemo );

setInputEnabled( false );
resetDemo();
