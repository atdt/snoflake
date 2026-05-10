"use strict";

import { runSnoflake } from './run-snoflake.js';

const demos = {
          pattern: {
              title: 'Pattern matcher',
              description: 'The original browser demo: edit a short SNOBOL4 pattern program, feed it input, and inspect the output.',
              sourceUrl: new URL( './pattern-matcher.sno', import.meta.url ),
              input: 'THE BLUEBIRD\nGOLDFISH\n',
              defaultMode: 'batch'
          },
          eliza: {
              title: 'ELIZA',
              description: 'A modernized ELIZA program running on Snoflake, available as a scripted batch run or as a live conversation.',
              sourceUrl: new URL( './eliza.sno', import.meta.url ),
              input: 'I feel anxious about computers\nMy mother listens to me\nbye\n',
              defaultMode: 'interactive'
          }
      },
      maxInputBytes = 4096,
      workspace = document.querySelector( '#workspace' ),
      description = document.querySelector( '#demo-description' ),
      demoSelect = document.querySelector( '#demo-select' ),
      modeButtons = document.querySelectorAll( '.mode-button' ),
      editor = document.querySelector( '#source' ),
      batchInput = document.querySelector( '#input' ),
      batchOutput = document.querySelector( '#batch-output' ),
      conversation = document.querySelector( '#conversation' ),
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
    running = false,
    mode = 'batch',
    loadId = 0;

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
    conversation.textContent = '';
}

function clearBatchOutput() {
    batchOutput.textContent = '';
}

function appendLine( text, kind = 'program' ) {
    const line = document.createElement( 'div' );
    line.className = 'terminal-line ' + kind;
    line.textContent = text;
    conversation.append( line );
    conversation.scrollTop = conversation.scrollHeight;
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

function currentDemo() {
    return demos[ demoSelect.value ];
}

function updateDemoText() {
    const demo = currentDemo();
    description.textContent = demo.description;
}

async function loadSelectedProgram() {
    const id = ++loadId,
          demo = currentDemo();

    setStatus( 'Loading' );
    const response = await fetch( demo.sourceUrl );
    if ( !response.ok ) {
        throw new Error( 'Could not load ' + demo.sourceUrl.pathname );
    }
    const source = await response.text();
    if ( id !== loadId ) {
        return false;
    }
    editor.value = source;
    batchInput.value = demo.input;
    setStatus( 'Ready' );
    return true;
}

function renderBatchResult( result ) {
    const parts = [];

    if ( result.stdout ) {
        parts.push( result.stdout );
    }
    if ( result.stderr ) {
        parts.push( result.stderr );
    }

    batchOutput.textContent = parts.join( '\n' ) || '(no output)';
    setStatus( result.stderr || result.exitCode ? 'Error' : 'Finished' );
}

function runBatch() {
    stopSession();
    clearBatchOutput();
    setStatus( 'Running' );

    try {
        renderBatchResult( runSnoflake( editor.value, { inputText: batchInput.value } ) );
    } catch ( e ) {
        batchOutput.textContent = 'Execution error: ' + ( e && e.message || e );
        setStatus( 'Error' );
    }
}

function runCurrentMode() {
    if ( mode === 'interactive' ) {
        startSession();
    } else {
        runBatch();
    }
}

function setMode( nextMode, options = {} ) {
    if ( nextMode !== 'batch' && nextMode !== 'interactive' ) {
        return;
    }
    if ( mode === nextMode && !options.force ) {
        return;
    }

    if ( mode === 'interactive' ) {
        stopSession();
    }

    mode = nextMode;
    workspace.classList.toggle( 'mode-batch', mode === 'batch' );
    workspace.classList.toggle( 'mode-interactive', mode === 'interactive' );
    document.querySelector( '#batch-input-pane' ).hidden = mode !== 'batch';
    document.querySelector( '#batch-output-pane' ).hidden = mode !== 'batch';
    document.querySelector( '#conversation-pane' ).hidden = mode !== 'interactive';

    modeButtons.forEach( function ( button ) {
        const active = button.dataset.mode === mode;
        button.classList.toggle( 'active', active );
        button.setAttribute( 'aria-pressed', active ? 'true' : 'false' );
    } );

    runButton.textContent = mode === 'interactive' ? 'Restart' : 'Run';
    setInputEnabled( false );
    setStatus( 'Ready' );

    if ( mode === 'interactive' && options.start !== false ) {
        startSession();
    }
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
    clearBatchOutput();
    clearConversation();
    try {
        const loaded = await loadSelectedProgram();
        if ( loaded && mode === 'interactive' ) {
            startSession();
        }
    } catch ( e ) {
        appendLine( e.message, 'error' );
        batchOutput.textContent = e.message;
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

runButton.addEventListener( 'click', runCurrentMode );
resetButton.addEventListener( 'click', resetDemo );

demoSelect.addEventListener( 'change', async function () {
    stopSession();
    clearBatchOutput();
    clearConversation();
    updateDemoText();
    setMode( currentDemo().defaultMode, { force: true, start: false } );

    try {
        const loaded = await loadSelectedProgram();
        if ( loaded && mode === 'interactive' ) {
            startSession();
        }
    } catch ( e ) {
        appendLine( e.message, 'error' );
        batchOutput.textContent = e.message;
        setStatus( 'Error' );
    }
} );

modeButtons.forEach( function ( button ) {
    button.addEventListener( 'click', function () {
        setMode( button.dataset.mode );
    } );
} );

setInputEnabled( false );
updateDemoText();
setMode( 'batch', { force: true, start: false } );
resetDemo();
