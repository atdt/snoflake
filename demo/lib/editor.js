// Source panes are plain textareas that we progressively enhance into
// CodeMirror editors. The editor loads from a CDN, so when the CDN is
// unreachable the upgrade is skipped and the textarea stays a working editor,
// minus syntax highlighting. Examples talk to the pane only through getValue
// and setValue, which read whichever of the two is live.

const CODEMIRROR = 'https://esm.sh/codemirror@6.0.2';
const LANG_SNOBOL = 'https://esm.sh/codemirror-lang-snobol@0.2.0';

export function createEditor( textarea ) {
    let view = null;

    upgrade();

    async function upgrade() {
        try {
            const [ cm, lang ] = await Promise.all( [
                import( CODEMIRROR ),
                import( LANG_SNOBOL ),
            ] );
            view = new cm.EditorView( {
                doc: textarea.value,
                extensions: [ cm.basicSetup, lang.snobol() ],
            } );
            view.contentDOM.setAttribute(
                'aria-label',
                textarea.getAttribute( 'aria-label' ) || '',
            );
            textarea.replaceWith( view.dom );
        } catch {
            // CDN unreachable: leave the textarea in place.
        }
    }

    return {
        getValue() {
            return view ? view.state.doc.toString() : textarea.value;
        },
        setValue( text ) {
            if ( view ) {
                view.dispatch( {
                    changes: {
                        from: 0,
                        to: view.state.doc.length,
                        insert: text,
                    },
                } );
            } else {
                textarea.value = text;
            }
        },
    };
}
