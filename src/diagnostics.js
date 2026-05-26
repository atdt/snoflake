// The compiler's statement-to-source-card map and compile-error log, plus
// the error context the runtime prints. Formatting methods return lines
// for the caller to write, so this stays free of VM memory and I/O.
//
// The compiler reads one card per STREAD, the latest held by
// noteSourceCard. CMPILE bumps its statement counter as each statement
// begins, so noteStatementStart can pin that number to the current card.
// Statements sharing a card (a ';'-separated group, or a continuation's
// first line) all point at it. An error before any statement is numbered
// (stno 0, a failed -INCLUDE) has no entry and uses the latest card.

// "path:line", or "line N" when the card carries no path.
function formatLocation( card ) {
    return card.path ? `${ card.path }:${ card.lineNum }` : `line ${ card.lineNum }`;
}

export class Diagnostics {
    constructor() {
        this.currentCard = null;
        this.statementLines = [];
        this.compileErrors = [];
    }

    noteSourceCard( source, text ) {
        this.currentCard = { text, ...source };
    }

    noteStatementStart( stno ) {
        this.statementLines[ stno ] = this.currentCard;
    }

    recordCompileError( stno, message ) {
        this.compileErrors.push( { stno, message } );
    }

    // The card statement `stno` began on, or the latest card for stno 0.
    #cardFor( stno ) {
        return stno > 0 ? ( this.statementLines[ stno ] ?? null ) : this.currentCard;
    }

    // Context appended to "ERROR n IN STATEMENT m": messages logged
    // against statement m, then the card it began on.
    errorContext( stno ) {
        const lines = [];
        for ( const err of this.compileErrors ) {
            if ( err.stno === stno && err.message ) lines.push( '*** ' + err.message );
        }
        const card = this.#cardFor( stno );
        if ( card ) {
            lines.push( `  at ${ formatLocation( card ) }` );
            lines.push( '    ' + card.text.trimEnd() );
        }
        return lines;
    }

    // Every compile error at once, under the "ERRORS DETECTED IN SOURCE
    // PROGRAM" header, not just the first that execution reaches.
    compileErrorSummary() {
        const lines = [];
        for ( const err of this.compileErrors ) {
            const card = this.#cardFor( err.stno );
            const at = card ? ` at ${ formatLocation( card ) }` : '';
            lines.push( `*** ${ err.message } (in statement ${ err.stno }${ at })` );
            if ( card ) lines.push( '    ' + card.text.trimEnd() );
        }
        return lines;
    }
}
