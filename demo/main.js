import { runSnoflake } from './run-snoflake.js';
import { presets, makeTurtleExtensions } from './lsystem-turtle.js';
import { presets as caPresets, makeCaExtensions } from './ca-host.js';
import { createScene } from './canvas3d.js';

const patternSourceUrl = new URL( './pattern-matcher.sno', import.meta.url ),
      shapeSourceUrl = new URL( './shape-grammar.sno', import.meta.url ),
      elizaSourceUrl = new URL( './eliza.sno', import.meta.url ),
      lsystemSourceUrl = new URL( './lsystem.sno', import.meta.url ),
      caSourceUrl = new URL( './ca.sno', import.meta.url ),
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
      elizaEofButton = document.querySelector( '#eliza-eof' ),
      lsystemSource = document.querySelector( '#lsystem-source' ),
      lsystemCanvas = document.querySelector( '#lsystem-canvas' ),
      lsystemStrings = document.querySelector( '#lsystem-strings' ),
      lsystemPreset = document.querySelector( '#lsystem-preset' ),
      lsystemRunButton = document.querySelector( '#lsystem-run' ),
      lsystemStatus = document.querySelector( '#lsystem-status' ),
      caSource = document.querySelector( '#ca-source' ),
      caCanvas = document.querySelector( '#ca-canvas' ),
      caPreset = document.querySelector( '#ca-preset' ),
      caRunButton = document.querySelector( '#ca-run' ),
      caStatus = document.querySelector( '#ca-status' ),
      shapeSource = document.querySelector( '#shape-source' ),
      shapeCanvas = document.querySelector( '#shape-canvas' ),
      shapeStatus = document.querySelector( '#shape-status' ),
      shapeRestartButton = document.querySelector( '#shape-restart' ),
      shapeResetButton = document.querySelector( '#shape-reset' );

let elizaWorker = null,
    elizaStdin = null,
    elizaRunning = false,
    shapeWorker = null,
    shapeScene = null;

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

function setLsystemStatus( text ) {
    lsystemStatus.textContent = text;
}

function populateLsystemPresets() {
    for ( const [ key, preset ] of Object.entries( presets ) ) {
        const opt = document.createElement( 'option' );
        opt.value = key;
        opt.textContent = preset.label;
        lsystemPreset.append( opt );
    }
}

function appendGenerationRow( gen, str ) {
    const row    = document.createElement( 'div' ),
          label  = document.createElement( 'div' ),
          body   = document.createElement( 'div' ),
          length = document.createElement( 'span' ),
          limit  = 160,
          shown  = str.length > limit ? str.slice( 0, limit ) + '…' : str;
    row.className = 'strings-row';
    label.className = 'gen';
    label.textContent = 'gen ' + gen;
    length.className = 'len';
    length.textContent = str.length + ' ch';
    label.append( length );
    body.className = 'body';
    body.textContent = shown;
    row.append( label, body );
    lsystemStrings.append( row );
}

function runLsystem() {
    const preset = presets[ lsystemPreset.value ];
    if ( !preset ) return;

    lsystemStrings.textContent = '';
    setLsystemStatus( 'Drawing' );

    // Defer to next frame so the status update paints before the synchronous
    // SNOBOL run blocks the main thread.
    requestAnimationFrame( function () {
        let gen = 0;
        const extensions = makeTurtleExtensions( lsystemCanvas, preset, function ( str ) {
            appendGenerationRow( gen++, str );
        } );

        try {
            const result = runSnoflake( lsystemSource.value, { extensions } );
            if ( result.stderr ) {
                setLsystemStatus( 'Error' );
                console.error( result.stderr );
            } else {
                setLsystemStatus( 'Drawn' );
            }
        } catch ( e ) {
            setLsystemStatus( 'Error' );
            console.error( e );
        }
    } );
}

async function resetLsystem() {
    setLsystemStatus( 'Loading' );
    try {
        lsystemSource.value = await loadSource( lsystemSourceUrl );
        populateLsystemPresets();
        setLsystemStatus( 'Ready' );
        runLsystem();
    } catch ( e ) {
        setLsystemStatus( 'Error' );
        console.error( e );
    }
}

function setCaStatus( text ) {
    caStatus.textContent = text;
}

function populateCaPresets() {
    for ( const [ key, preset ] of Object.entries( caPresets ) ) {
        const opt = document.createElement( 'option' );
        opt.value = key;
        opt.textContent = preset.label;
        caPreset.append( opt );
    }
}

function runCa() {
    const preset = caPresets[ caPreset.value ];
    if ( !preset ) return;

    setCaStatus( 'Running' );

    requestAnimationFrame( function () {
        const extensions = makeCaExtensions( caCanvas, preset );

        try {
            const result = runSnoflake( caSource.value, { extensions } );
            if ( result.stderr ) {
                setCaStatus( 'Error' );
                console.error( result.stderr );
            } else {
                setCaStatus( 'Done' );
            }
        } catch ( e ) {
            setCaStatus( 'Error' );
            console.error( e );
        }
    } );
}

async function resetCa() {
    setCaStatus( 'Loading' );
    try {
        caSource.value = await loadSource( caSourceUrl );
        populateCaPresets();
        setCaStatus( 'Ready' );
        runCa();
    } catch ( e ) {
        setCaStatus( 'Error' );
        console.error( e );
    }
}

function setShapeStatus( text ) {
    shapeStatus.textContent = text;
}

function stopShapeWorker() {
    if ( shapeWorker ) {
        shapeWorker.terminate();
        shapeWorker = null;
    }
}

function startShapeRun() {
    stopShapeWorker();
    shapeScene.clear();
    shapeScene.resetCamera();

    let count = 0;

    shapeWorker = new Worker( './shape-worker.js', { type: 'module' } );
    shapeWorker.addEventListener( 'message', function ( event ) {
        const message = event.data;
        if ( message.type === 'box' ) {
            shapeScene.addBox( message.box );
            count += 1;
            setShapeStatus( count + ' boxes' );
        } else if ( message.type === 'done' ) {
            setShapeStatus( count + ' boxes · finished' );
        } else if ( message.type === 'stderr' ) {
            setShapeStatus( 'Error: ' + message.line );
        }
    } );
    shapeWorker.addEventListener( 'error', function ( event ) {
        setShapeStatus( 'Error: ' + event.message );
    } );

    setShapeStatus( 'Running' );
    shapeWorker.postMessage( { type: 'start', source: shapeSource.value } );
}

async function resetShape() {
    stopShapeWorker();
    if ( shapeScene ) shapeScene.clear();
    setShapeStatus( 'Loading' );

    try {
        shapeSource.value = await loadSource( shapeSourceUrl );
        setShapeStatus( 'Ready' );
        startShapeRun();
    } catch ( e ) {
        setShapeStatus( e.message );
    }
}

patternRunButton.addEventListener( 'click', runPattern );
patternResetButton.addEventListener( 'click', resetPattern );
elizaRestartButton.addEventListener( 'click', startElizaSession );
elizaResetButton.addEventListener( 'click', resetEliza );
lsystemRunButton.addEventListener( 'click', runLsystem );
lsystemPreset.addEventListener( 'change', runLsystem );
caRunButton.addEventListener( 'click', runCa );
caPreset.addEventListener( 'change', runCa );
shapeRestartButton.addEventListener( 'click', startShapeRun );
shapeResetButton.addEventListener( 'click', resetShape );

setElizaInputEnabled( false );
shapeScene = createScene( shapeCanvas );
resetPattern();
resetEliza();
resetLsystem();
resetCa();
resetShape();
