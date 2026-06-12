// Source panes are plain textareas in the markup, upgraded to CodeMirror
// editors here. CodeMirror is bundled with the page, so the upgrade is
// immediate. Examples talk to the pane only through getValue and setValue.

import { EditorView } from 'codemirror';
import { setup } from './setup.js';

export function createEditor( textarea ) {
    const view = new EditorView( {
        doc: textarea.value,
        extensions: [ setup ],
    } );
    view.contentDOM.setAttribute(
        'aria-label',
        textarea.getAttribute( 'aria-label' ) || '',
    );
    textarea.replaceWith( view.dom );

    return {
        getValue() {
            return view.state.doc.toString();
        },
        setValue( text ) {
            view.dispatch( {
                changes: { from: 0, to: view.state.doc.length, insert: text },
            } );
        },
    };
}
