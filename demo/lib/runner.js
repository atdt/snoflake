import { run } from '../../src/snobol.js';

function captureWriter() {
    const lines = [];

    return {
        lines,
        write( line ) {
            lines.push( line );
        },
    };
}

function joinLines( lines ) {
    return lines.length === 0 ? '' : lines.join( '\n' ) + '\n';
}

// Run a SNOBOL program over in-memory source and input, capturing its output.
// The source is passed inline; the loader serves options.inputText as the
// program's INPUT file, the only path the runtime asks for here. Any failure
// is reported in the returned stderr rather than thrown.
export function runSnoflake( source, options = {} ) {
    const stdout = captureWriter(),
        stderr = captureWriter(),
        hasInput = options.inputText !== undefined;

    let exitCode = 0;
    try {
        ( { exitCode } = run( {
            ...options,
            source,
            sourcePath: options.file || 'demo.sno',
            input: hasInput ? ( options.input || 'input.txt' ) : undefined,
            loader: { load: () => options.inputText ?? '' },
            stdout,
            stderr,
        } ) );
    } catch ( e ) {
        stderr.write( 'Execution error: ' + ( e?.message || e ) );
    }

    return {
        stdout: joinLines( stdout.lines ),
        stderr: joinLines( stderr.lines ),
        exitCode,
    };
}
