// Maps each statement to the source line it began on and logs compile
// errors, so the runtime can show where an error occurred. Formatting
// methods return lines for the caller to write; no VM memory or I/O here.

// "path:line", or "line N" when the line carries no path.
function formatLocation( line ) {
    return line.path ? `${line.path}:${line.lineNum}` : `line ${line.lineNum}`;
}

export class Diagnostics {
    constructor() {
        this.currentLine = null;
        this.statementLines = [];
        this.compileErrors = [];
    }

    noteSourceLine( source, text ) {
        this.currentLine = { text, ...source };
    }

    noteStatementStart( stno ) {
        this.statementLines[stno] = this.currentLine;
    }

    recordCompileError( stno, message ) {
        this.compileErrors.push( { stno, message } );
    }

    // The line statement `stno` began on, or the latest line for stno 0.
    #lineFor( stno ) {
        return stno > 0
            ? ( this.statementLines[stno] ?? null )
            : this.currentLine;
    }

    // Context appended to "ERROR n IN STATEMENT m": messages logged
    // against statement m, then the line it began on.
    errorContext( stno ) {
        const lines = [];
        for ( const err of this.compileErrors ) {
            if ( err.stno === stno && err.message ) {
                lines.push( '*** ' + err.message );
            }
        }
        const line = this.#lineFor( stno );
        if ( line ) {
            lines.push( `  at ${formatLocation( line )}` );
            lines.push( '    ' + line.text.trimEnd() );
        }
        return lines;
    }

    // Every compile error at once, under the "ERRORS DETECTED IN SOURCE
    // PROGRAM" header, not just the first that execution reaches.
    compileErrorSummary() {
        const lines = [];
        for ( const err of this.compileErrors ) {
            const line = this.#lineFor( err.stno );
            const at = line ? ` at ${formatLocation( line )}` : '';
            lines.push( `*** ${err.message} (in statement ${err.stno}${at})` );
            if ( line ) lines.push( '    ' + line.text.trimEnd() );
        }
        return lines;
    }
}
