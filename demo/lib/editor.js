// Source panes are plain textareas in the markup, upgraded to CodeMirror
// editors here. CodeMirror is bundled with the page, so the upgrade is
// immediate. Examples talk to the pane only through getValue and setValue.

import { basicSetup, EditorView } from 'codemirror';
import { snobol } from 'codemirror-lang-snobol';

export function createEditor( textarea ) {
    const view = new EditorView( {
        doc: textarea.value,
        extensions: [ basicSetup, snobol() ],
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
