// Worker host for the 2-D canvas demos (L-system, cellular automata). The
// interpreter runs here, off the main thread. With no real canvas, the
// canvas2d verbs only record their calls. The host replays that list on the
// live canvas, and L-system generations stream back as they are emitted.

import { run } from '../../src/snobol.js';
import { recordingCanvas } from '../lib/canvas2d.js';
import {
    makeTurtleExtensions,
    presets as turtlePresets,
} from '../lib/turtle.js';
import {
    makeAutomatonExtensions,
    presets as automatonPresets,
} from '../lib/automata.js';

self.addEventListener( 'message', function ( event ) {
    const { kind, source, width, height, preset } = event.data,
        { canvas, commands } = recordingCanvas( width, height ),
        extensions = kind === 'lsystem'
            ? makeTurtleExtensions(
                canvas,
                turtlePresets[preset],
                ( str ) => self.postMessage( { type: 'emit', str } ),
            )
            : makeAutomatonExtensions( canvas, automatonPresets[preset] );

    try {
        const { exitCode } = run( {
            source,
            sourcePath: kind + '.sno',
            stdout: { write() {} },
            stderr: {
                write: ( line ) => self.postMessage( { type: 'stderr', line } ),
            },
            extensions,
        } );
        self.postMessage( { type: 'done', exitCode, commands } );
    } catch ( e ) {
        self.postMessage( {
            type: 'stderr',
            line: 'Execution error: ' + ( e?.message || e ),
        } );
        self.postMessage( { type: 'done', exitCode: 1, commands } );
    }
} );
