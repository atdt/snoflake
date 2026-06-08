import { basicSetup, EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { snobol } from 'codemirror-lang-snobol';

import EXAMPLES from 'examples:all';

const DEFAULT_EXAMPLE = 'Pattern matching';

const statusEl = document.querySelector( '#status' ),
    mainEl = document.querySelector( 'main' ),
    input = document.querySelector( '#input' ),
    out = document.querySelector( '#out' ),
    exampleSel = document.querySelector( '#example' ),
    themeSel = document.querySelector( '#theme' ),
    showInputEl = document.querySelector( '#show-input' ),
    runBtn = document.querySelector( '#run' ),
    fileTabs = document.querySelector( '#file-tabs' ),
    editorStack = document.querySelector( '#editor-stack' ),
    addFileBtn = document.querySelector( '#add-file' );

let runningTimer;

function setStatus( message, error = false ) {
    clearTimeout( runningTimer );
    statusEl.textContent = message;
    statusEl.classList.toggle( 'error', error );
}

// Theme tokens are CSS variables resolved with light-dark(), so switching
// themes is just a color-scheme change; the editor needs no reconfiguring.
const THEME_KEY = 'snoflake-theme';

function applyTheme( theme ) {
    if ( theme === 'auto' ) {
        delete document.documentElement.dataset.theme;
    } else {
        document.documentElement.dataset.theme = theme;
    }
    themeSel.value = theme;
    localStorage.setItem( THEME_KEY, theme );
}

themeSel.addEventListener( 'change', () => applyTheme( themeSel.value ) );
applyTheme( localStorage.getItem( THEME_KEY ) || 'auto' );

const editorTheme = EditorView.theme( {
    '&': { backgroundColor: 'var(--bg)', color: 'var(--fg)' },
    '.cm-gutters': {
        backgroundColor: 'var(--panel)',
        color: 'var(--muted)',
        border: 'none',
    },
    '.cm-activeLine': { backgroundColor: 'var(--active-line)' },
    '.cm-activeLineGutter': { backgroundColor: 'var(--active-line)' },
    '.cm-content': { caretColor: 'var(--accent)' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--accent)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
        { backgroundColor: 'var(--selection)' },
} );

const highlight = HighlightStyle.define( [
    { tag: tags.lineComment, color: 'var(--muted)', fontStyle: 'italic' },
    { tag: tags.meta, color: 'var(--muted)' },
    { tag: tags.labelName, color: 'var(--accent)', fontWeight: '600' },
    { tag: tags.controlKeyword, color: 'var(--accent)' },
    { tag: tags.keyword, color: 'var(--accent)' },
    { tag: tags.standard( tags.variableName ), color: 'var(--builtin)' },
    { tag: tags.string, color: 'var(--literal)' },
    { tag: tags.special( tags.string ), color: 'var(--literal)' },
    { tag: tags.number, color: 'var(--literal)' },
] );

// Emitted next to this bundle by build.js, so the path is output-relative.
const workerUrl = new URL( './editor-worker.js', import.meta.url );

function write( line ) {
    out.textContent += line + '\n';
}

// A single worker is kept warm and reused across runs. Spawning one per run
// reloads the runtime each time, and that startup cost lands right around the
// 100ms threshold below, so the status would flicker between 'Running…' and
// 'Ready' from boot latency alone. run() makes a fresh VM per message, so
// reuse is safe.
let worker, busy = false, onWarm = null;

function spawnWorker() {
    worker = new Worker( workerUrl, { type: 'module' } );
    worker.onmessage = ( event ) => {
        const message = event.data;
        if ( message.type === 'ready' ) {
            onWarm?.();
            onWarm = null;
        } else if ( message.type === 'line' ) {
            write( message.line );
        } else if ( message.type === 'done' ) {
            busy = false;
            setStatus( 'Ready' );
        } else {
            busy = false;
            setStatus( `Error: ${message.message}`, true );
        }
    };
    worker.onerror = ( event ) => {
        busy = false;
        setStatus( `Error: ${event.message}`, true );
    };
}

function run() {
    // Reuse the warm worker; only a still-running program needs killing, which
    // means dropping its worker and booting a fresh one.
    if ( busy ) {
        worker.terminate();
        spawnWorker();
    }
    busy = true;
    out.textContent = '';

    // A genuinely slow program shows 'Running…'; fast ones finish before the
    // timer fires, so the status never changes.
    clearTimeout( runningTimer );
    runningTimer = setTimeout( () => setStatus( 'Running…' ), 200 );

    // files[0] is the program; the rest are named -INCLUDE/INPUT files. The
    // active file's edits live in the view, so fold them back first.
    syncActive();
    const fileMap = {};
    for ( const file of files.slice( 1 ) ) {
        fileMap[file.name] = file.state.doc.toString();
    }

    worker.postMessage( {
        source: files[0].state.doc.toString(),
        input: input.value,
        files: fileMap,
    } );
}

spawnWorker();

const extensions = [
    basicSetup,
    snobol(),
    editorTheme,
    syntaxHighlighting( highlight ),
];

// One editor backs every file. Each file keeps its own EditorState (so its
// text, cursor, and undo history survive tab switches); switching saves the
// live state back to the outgoing file and loads the next. files[0] is the
// program (fixed: not renamable or removable); the rest are the named files
// served to the loader.
const view = new EditorView( { parent: editorStack } );

let files = [],
    activeFile = 0;

const fileState = ( content ) =>
    EditorState.create( { doc: content, extensions } );

function syncActive() {
    if ( files[activeFile] ) {
        files[activeFile].state = view.state;
    }
}

function renderTabs() {
    fileTabs.replaceChildren();
    files.forEach( ( file, i ) => {
        const active = i === activeFile,
            tab = document.createElement( 'span' ),
            name = document.createElement( 'span' );
        tab.className = active ? 'tab active' : 'tab';
        name.className = 'name';
        name.textContent = file.name;
        name.title = file.name;
        tab.append( name );

        tab.addEventListener( 'click', () => {
            if ( i !== activeFile ) {
                selectFile( i );
            } else if ( !file.fixed ) {
                renameFile( name, file );
            }
        } );

        if ( !file.fixed ) {
            const close = document.createElement( 'button' );
            close.className = 'close';
            close.type = 'button';
            close.title = 'Remove file';
            close.textContent = '×';
            close.addEventListener( 'click', ( event ) => {
                event.stopPropagation();
                removeFile( i );
            } );
            tab.append( close );
        }
        fileTabs.append( tab );
    } );
}

function selectFile( i ) {
    syncActive();
    activeFile = i;
    view.setState( files[i].state );
    renderTabs();
    view.focus();
}

function renameFile( nameEl, file ) {
    const nameInput = document.createElement( 'input' );
    nameInput.value = file.name;
    nameInput.setAttribute( 'aria-label', 'File name' );
    nameEl.replaceChildren( nameInput );
    nameInput.focus();
    nameInput.select();
    nameInput.addEventListener( 'click', ( e ) => e.stopPropagation() );
    nameInput.addEventListener( 'blur', () => {
        const name = nameInput.value.trim();
        if (
            name && name !== file.name &&
            !files.some( ( f ) => f.name === name )
        ) {
            file.name = name;
        }
        renderTabs();
    } );
    nameInput.addEventListener( 'keydown', ( event ) => {
        if ( event.key === 'Escape' ) {
            nameInput.value = file.name;
        }
        if ( event.key === 'Enter' || event.key === 'Escape' ) {
            nameInput.blur();
        }
    } );
}

function addFile( name, content = '' ) {
    files.push( { name, state: fileState( content ) } );
    selectFile( files.length - 1 );
}

function removeFile( i ) {
    syncActive();
    files.splice( i, 1 );
    activeFile = activeFile > i
        ? activeFile - 1
        : Math.min( activeFile, files.length - 1 );
    view.setState( files[activeFile].state );
    renderTabs();
}

addFileBtn.addEventListener( 'click', () => {
    let n = files.length;
    let name;
    do {
        name = `FILE${n}.INC`;
        n++;
    } while ( files.some( ( f ) => f.name === name ) );
    addFile( name );
} );

runBtn.addEventListener( 'click', run );

// Ctrl/Cmd+Enter runs from anywhere, including inside the editor.
addEventListener( 'keydown', ( event ) => {
    if ( ( event.metaKey || event.ctrlKey ) && event.key === 'Enter' ) {
        event.preventDefault();
        run();
    }
} );

showInputEl.addEventListener( 'change', () => {
    mainEl.classList.toggle( 'input-hidden', !showInputEl.checked );
    layoutPanes();
} );

// Resizable columns: dragging a gutter repartitions the two panes it sits
// between. Widths are held as grid fr units so a split keeps its proportion
// when the window resizes. The narrow-screen layout stacks the panes into
// rows, so there the inline template is dropped and the gutters hide.
const sourcesPane = document.querySelector( '#sources' ),
    inputPane = document.querySelector( '#input-section' ),
    outputPane = out.closest( 'section' ),
    gutters = [ ...mainEl.querySelectorAll( '.gutter' ) ],
    narrow = matchMedia( '(max-width: 720px)' );

const GUTTER_PX = 6,
    MIN_PANE_PX = 120,
    DEFAULT_FR = new Map( [
        [ sourcesPane, 1.1 ],
        [ inputPane, 0.55 ],
        [ outputPane, 0.8 ],
    ] ),
    paneFr = new Map( DEFAULT_FR );

function layoutPanes() {
    if ( narrow.matches ) {
        mainEl.style.gridTemplateColumns = '';
        return;
    }
    const showInput = !mainEl.classList.contains( 'input-hidden' );
    gutters[1].style.display = showInput ? '' : 'none';
    const cols = [ paneFr.get( sourcesPane ) + 'fr', GUTTER_PX + 'px' ];
    if ( showInput ) {
        cols.push( paneFr.get( inputPane ) + 'fr', GUTTER_PX + 'px' );
    }
    cols.push( paneFr.get( outputPane ) + 'fr' );
    mainEl.style.gridTemplateColumns = cols.join( ' ' );
}

// The nearest visible <section> on one side of a gutter; with the input pane
// hidden, the first gutter resizes the source pane against the output pane.
function paneBeside( gutter, step ) {
    let el = gutter[step];
    while (
        el && !( el.matches( 'section' ) &&
            getComputedStyle( el ).display !== 'none' )
    ) {
        el = el[step];
    }
    return el;
}

let drag = null;

function startDrag( event, gutter ) {
    const left = paneBeside( gutter, 'previousElementSibling' ),
        right = paneBeside( gutter, 'nextElementSibling' );
    if ( !left || !right ) {
        return;
    }
    gutter.setPointerCapture( event.pointerId );
    gutter.classList.add( 'dragging' );
    mainEl.classList.add( 'resizing' );
    drag = {
        gutter,
        left,
        right,
        startX: event.clientX,
        leftPx: left.getBoundingClientRect().width,
        spanPx: left.getBoundingClientRect().width +
            right.getBoundingClientRect().width,
        spanFr: paneFr.get( left ) + paneFr.get( right ),
    };
}

function moveDrag( event ) {
    if ( !drag ) {
        return;
    }
    const leftPx = Math.max(
            MIN_PANE_PX,
            Math.min(
                drag.spanPx - MIN_PANE_PX,
                drag.leftPx + ( event.clientX - drag.startX ),
            ),
        ),
        leftFr = drag.spanFr * leftPx / drag.spanPx;
    paneFr.set( drag.left, leftFr );
    paneFr.set( drag.right, drag.spanFr - leftFr );
    layoutPanes();
}

function endDrag() {
    if ( !drag ) {
        return;
    }
    drag.gutter.classList.remove( 'dragging' );
    mainEl.classList.remove( 'resizing' );
    drag = null;
}

// Double-clicking any gutter restores the default split.
function resetPanes() {
    for ( const [ pane, fr ] of DEFAULT_FR ) {
        paneFr.set( pane, fr );
    }
    layoutPanes();
}

for ( const gutter of gutters ) {
    gutter.addEventListener( 'pointerdown', ( e ) => startDrag( e, gutter ) );
    gutter.addEventListener( 'pointermove', moveDrag );
    gutter.addEventListener( 'pointerup', endDrag );
    gutter.addEventListener( 'lostpointercapture', endDrag );
    gutter.addEventListener( 'dblclick', resetPanes );
}

narrow.addEventListener( 'change', layoutPanes );
layoutPanes();

function loadExample( example ) {
    files = [
        {
            name: 'Program',
            state: fileState( example.source ),
            fixed: true,
        },
        ...Object.entries( example.files ).map(
            ( [ name, content ] ) => ( {
                name,
                state: fileState( content ),
            } ),
        ),
    ];
    activeFile = 0;
    view.setState( files[0].state );
    renderTabs();
    input.value = example.input;
}

for ( const name of Object.keys( EXAMPLES ) ) {
    exampleSel.add( new Option( name ) );
}

// Selecting a whole program is a deliberate action, so show its output at
// once; edits afterward wait for the Run button.
exampleSel.addEventListener( 'change', () => {
    loadExample( EXAMPLES[exampleSel.value] );
    run();
} );

loadExample( EXAMPLES[DEFAULT_EXAMPLE] );
// Hold the first run until the worker has loaded the runtime, so the status
// doesn't flash 'Running…' during startup.
onWarm = run;
