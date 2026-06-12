// The CodeMirror configuration shared by the demo-page source panes and the
// standalone editor: minimalSetup, the SNOBOL language, and a little editing
// chrome (line numbers, active-line highlight, reindent on input). The
// standalone editor layers its own theme and highlight style on top.

import { minimalSetup } from 'codemirror';
import { highlightActiveLine, lineNumbers } from '@codemirror/view';
import { indentOnInput } from '@codemirror/language';
import { snobol } from 'codemirror-lang-snobol';

export const setup = [
    minimalSetup,
    lineNumbers(),
    highlightActiveLine(),
    indentOnInput(),
    snobol(),
];
