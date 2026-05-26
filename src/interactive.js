// Interactive sessions: drive a SNOBOL program that reads input a line at
// a time, where the lines arrive from the host asynchronously.
//
// SNOBOL's INPUT read is synchronous -- it happens deep inside the VM's
// dispatch loop, which cannot pause to await a Promise. But host input
// (a keystroke in a browser, a message from another thread) arrives
// asynchronously. A Session bridges the two: it runs the program until a
// read finds no buffered line, suspends there, and resumes when the host
// supplies the next line via send().

import { VM } from './vm.js';

// A reader throws this when it has no line buffered and the input stream
// is still open. The Session loop catches it to suspend execution. Any
// other thrown value is a real error and propagates.
export const NEED_INPUT = Symbol( 'NEED_INPUT' );

const encoder = new TextEncoder();

// A line reader fed by the host through pushLine()/end(). readLine()
// returns the next buffered line, or null once the stream is closed and
// drained. With nothing buffered but the stream still open, it throws
// NEED_INPUT so the Session can suspend and wait for more.
function inputChannel() {
    const lines = [];
    let closed = false,
        drained = false;

    return {
        pushLine( text ) {
            if ( !closed ) lines.push( encoder.encode( text ) );
        },
        end() {
            closed = true;
        },

        reader: {
            readLine() {
                if ( drained ) return null;
                if ( lines.length ) return lines.shift();
                if ( closed ) {
                    drained = true;
                    return null;
                }
                throw NEED_INPUT;
            },
        },
    };
}

// A resumable run of one program. Construct it with the SNOBOL image and
// the same options run() accepts, plus output/completion callbacks:
//
//     onOutput(line)    each line the program writes (OUTPUT, etc.)
//     onError(line)     each error line, defaulting to onOutput
//     onDone(exitCode)  called once when the program finishes or aborts
//
// Lifecycle:
//
//     session.start()       compile and run until the program blocks on a
//                           read or finishes
//     session.send(line)    supply one input line, then run on until the
//                           next block or finish
//     session.end()         signal end-of-input (the host's Ctrl-D), then
//                           run to completion
//
// A non-interactive program runs to completion on start().
export class Session {
    constructor( image, options = {} ) {
        const onOutput = options.onOutput ?? ( () => {} ),
            onError = options.onError ?? onOutput;

        this.image = image;
        this.onError = onError;
        this.onDone = options.onDone ?? ( () => {} );
        this.channel = inputChannel();
        this.done = false;
        this.exitCode = 0;
        this.started = false;
        this.running = false;

        this.vm = new VM( {
            ...options,
            interactive: true,
            stdout: { write: onOutput },
            stderr: { write: onError },
            stdinReader: () => this.channel.reader,
        } );
    }

    start() {
        if ( this.started ) return;
        this.started = true;
        this.instructions = this.vm.prepare( this.image );
        this.#runUntilBlocked();
    }

    send( line ) {
        this.channel.pushLine( line );
        this.#runUntilBlocked();
    }

    end() {
        this.channel.end();
        this.#runUntilBlocked();
    }

    // Step the dispatch loop until a read blocks for input or the program
    // ends. On NEED_INPUT, rewind to retry the same instruction once the
    // host supplies the next line. The guard flags keep re-entrant send()
    // calls from interleaving.
    #runUntilBlocked() {
        if ( !this.started || this.done || this.running ) return;
        this.running = true;

        const { vm, instructions } = this;
        try {
            while ( vm.ip >= 0 && vm.ip < instructions.length ) {
                const loc = vm.ip;
                vm.ip = loc + 1;
                try {
                    instructions[loc]();
                } catch ( e ) {
                    if ( e === NEED_INPUT ) {
                        vm.ip = loc;
                        return;
                    }
                    throw e;
                }
            }
            this.#finish( vm.exitCode );
        } catch ( e ) {
            this.onError( 'Execution error: ' + ( e?.message ?? e ) );
            this.#finish( 1 );
        } finally {
            this.running = false;
        }
    }

    #finish( exitCode ) {
        this.done = true;
        this.exitCode = exitCode;
        this.onDone( exitCode );
    }
}
