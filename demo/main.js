"use strict";

import { runSnoflake } from './run-snoflake.js';

const patternSourceUrl = new URL( './pattern-matcher.sno', import.meta.url ),
      elizaSourceUrl = new URL( './eliza.sno', import.meta.url ),
      patternSampleInput = 'THE BLUEBIRD\nGOLDFISH\n',
      patternSource = document.querySelector( '#pattern-source' ),
      patternInput = document.querySelector( '#pattern-input' ),
      patternOutput = document.querySelector( '#pattern-output' ),
      patternStatus = document.querySelector( '#pattern-status' ),
      patternRunButton = document.querySelector( '#pattern-run' ),
      patternResetButton = document.querySelector( '#pattern-reset' ),
      elizaSource = document.querySelector( '#eliza-source' ),
      elizaConversation = document.querySelector( '#eliza-conversation' ),
      elizaStatus = document.querySelector( '#eliza-status' ),
      elizaRestartButton = document.querySelector( '#eliza-restart' ),
      elizaResetButton = document.querySelector( '#eliza-reset' ),
      elizaInputForm = document.querySelector( '#eliza-input-form' ),
      elizaInputLine = document.querySelector( '#eliza-input-line' ),
      elizaSendButton = document.querySelector( '#eliza-send' ),
      elizaEofButton = document.querySelector( '#eliza-eof' );

let elizaWorker = null,
    elizaStdin = null,
    elizaRunning = false;

async function loadSource( url ) {
    const response = await fetch( url );
    if ( !response.ok ) {
        throw new Error( 'Could not load ' + url.pathname );
    }
    return response.text();
}

function setPatternStatus( text ) {
    patternStatus.textContent = text;
}

function setElizaStatus( text ) {
    elizaStatus.textContent = text;
}

function setElizaInputEnabled( enabled ) {
    elizaInputLine.disabled = !enabled;
    elizaSendButton.disabled = !enabled;
    elizaEofButton.disabled = !enabled;
    elizaInputForm.classList.toggle( 'disabled', !enabled );
}

function clearElizaConversation() {
    elizaConversation.textContent = '';
}

function appendElizaLine( text, kind = 'program' ) {
    const line = document.createElement( 'div' );
    line.className = 'terminal-line ' + kind;
    line.textContent = text;
    elizaConversation.append( line );
    elizaConversation.scrollTop = elizaConversation.scrollHeight;
}

function renderPatternResult( result ) {
    const parts = [];

    if ( result.stdout ) {
        parts.push( result.stdout );
    }
    if ( result.stderr ) {
        parts.push( result.stderr );
    }

    patternOutput.textContent = parts.join( '\n' ) || '(no output)';
    setPatternStatus( result.stderr || result.exitCode ? 'Error' : 'Finished' );
}

function runPattern() {
    patternOutput.textContent = '';
    setPatternStatus( 'Running' );

    try {
        renderPatternResult( runSnoflake( patternSource.value, {
            inputText: patternInput.value
        } ) );
    } catch ( e ) {
        patternOutput.textContent = 'Execution error: ' + ( e && e.message || e );
        setPatternStatus( 'Error' );
    }
}

async function resetPattern() {
    patternOutput.textContent = '';
    setPatternStatus( 'Loading' );

    try {
        patternSource.value = await loadSource( patternSourceUrl );
        patternInput.value = patternSampleInput;
        setPatternStatus( 'Ready' );
    } catch ( e ) {
        patternOutput.textContent = e.message;
        setPatternStatus( 'Error' );
    }
}

function createWorkerStdin( worker ) {
    return {
        writeLine( line ) {
            worker.postMessage( {
                type: 'input',
                line
            } );
        },

        close() {
            worker.postMessage( { type: 'eof' } );
        }
    };
}

function stopElizaSession() {
    if ( elizaWorker ) {
        elizaWorker.terminate();
        elizaWorker = null;
    }
    if ( elizaStdin ) {
        elizaStdin.close();
        elizaStdin = null;
    }
    elizaRunning = false;
    setElizaInputEnabled( false );
}

function startElizaSession() {
    stopElizaSession();
    clearElizaConversation();

    elizaWorker = new Worker( './worker.js', { type: 'module' } );
    elizaStdin = createWorkerStdin( elizaWorker );
    elizaWorker.addEventListener( 'message', function ( event ) {
        const message = event.data;

        if ( message.type === 'stdout' ) {
            appendElizaLine( message.line );
        } else if ( message.type === 'stderr' ) {
            appendElizaLine( message.line, 'error' );
        } else if ( message.type === 'done' ) {
            elizaRunning = false;
            setElizaInputEnabled( false );
            setElizaStatus( message.exitCode ? 'Error' : 'Finished' );
        }
    } );
    elizaWorker.addEventListener( 'error', function ( event ) {
        appendElizaLine( event.message, 'error' );
        elizaRunning = false;
        setElizaInputEnabled( false );
        setElizaStatus( 'Error' );
    } );

    elizaRunning = true;
    setElizaStatus( 'Running' );
    setElizaInputEnabled( true );
    elizaWorker.postMessage( {
        type: 'start',
        source: elizaSource.value
    } );
}

async function resetEliza() {
    stopElizaSession();
    clearElizaConversation();
    setElizaStatus( 'Loading' );

    try {
        elizaSource.value = await loadSource( elizaSourceUrl );
        setElizaStatus( 'Ready' );
        startElizaSession();
    } catch ( e ) {
        appendElizaLine( e.message, 'error' );
        setElizaStatus( 'Error' );
    }
}

elizaInputForm.addEventListener( 'submit', function ( event ) {
    event.preventDefault();
    if ( !elizaRunning || !elizaStdin ) return;

    const line = elizaInputLine.value;
    elizaInputLine.value = '';
    appendElizaLine( '> ' + line, 'input' );

    try {
        elizaStdin.writeLine( line );
    } catch ( e ) {
        appendElizaLine( e.message, 'error' );
    }
} );

elizaInputLine.addEventListener( 'keydown', function ( event ) {
    if ( event.key !== 'Enter' || event.shiftKey ) return;
    event.preventDefault();
    elizaInputForm.requestSubmit();
} );

elizaEofButton.addEventListener( 'click', function () {
    if ( !elizaRunning || !elizaStdin ) return;
    appendElizaLine( '<EOF>', 'input' );
    elizaStdin.close();
    setElizaInputEnabled( false );
} );

patternRunButton.addEventListener( 'click', runPattern );
patternResetButton.addEventListener( 'click', resetPattern );
elizaRestartButton.addEventListener( 'click', startElizaSession );
elizaResetButton.addEventListener( 'click', resetEliza );

setElizaInputEnabled( false );
resetPattern();
resetEliza();
