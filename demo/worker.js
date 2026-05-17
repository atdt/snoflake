import { VM, image } from '../src/snobol.js';

const sourcePath = 'demo.sno',
      encoder = new TextEncoder();

class InputNeeded extends Error {
    constructor() {
        super( 'Input needed' );
        this.name = 'InputNeeded';
    }
}

let session = null;

function makeInteractiveReader() {
    const lines = [];
    let closed = false;

    return {
        push( line ) {
            if ( !closed ) lines.push( encoder.encode( line ) );
        },

        close() {
            closed = true;
        },

        reader() {
            let drained = false;

            return {
                readLine() {
                    if ( drained ) return null;
                    if ( lines.length ) return lines.shift();
                    if ( closed ) {
                        drained = true;
                        return null;
                    }
                    throw new InputNeeded();
                },

                drain() {
                    drained = true;
                    closed = true;
                    lines.length = 0;
                }
            };
        }
    };
}


function postLine( type, line ) {
    self.postMessage( { type, line } );
}

function createSession( source ) {
    const stdin = makeInteractiveReader(),
          vm = new VM( {
              file: sourcePath,
              interactive: true,
              stdout: { write: line => postLine( 'stdout', line ) },
              stderr: { write: line => postLine( 'stderr', line ) },
              stdinReader: () => stdin.reader(),
              loader: {
                  load( path ) {
                      if ( path !== sourcePath ) {
                          throw new Error( 'No demo file named ' + path );
                      }
                      return source;
                  }
              }
          } );

    vm.reset();
    vm.loadImage( image );
    vm.ip = 0;
    if ( Object.hasOwn( vm.symbols, 'LISTCL' ) ) vm.d( 'LISTCL' ).addr = 0;
    if ( Object.hasOwn( vm.symbols, 'BANRCL' ) ) vm.d( 'BANRCL' ).addr = 0;
    if ( Object.hasOwn( vm.symbols, 'STATCL' ) ) vm.d( 'STATCL' ).addr = 0;

    return {
        stdin,
        vm,
        instructions: vm.compileInstructions( image.instructions ),
        done: false,
        running: false
    };
}

function runUntilBlocked() {
    if ( !session || session.done || session.running ) return;

    session.running = true;
    try {
        const { vm, instructions } = session;

        while ( vm.ip >= 0 && vm.ip < instructions.length ) {
            const loc = vm.ip;
            vm.ip = loc + 1;

            try {
                instructions[ loc ]();
            } catch ( e ) {
                if ( e instanceof InputNeeded ) {
                    // Retry this STREAD after the page posts the next input line.
                    vm.ip = loc;
                    return;
                }
                throw e;
            }
        }

        session.done = true;
        self.postMessage( { type: 'done', exitCode: vm.exitCode } );
    } catch ( e ) {
        postLine( 'stderr', 'Execution error: ' + ( e && e.message || e ) );
        session.done = true;
        self.postMessage( { type: 'done', exitCode: 1 } );
    } finally {
        session.running = false;
    }
}

self.addEventListener( 'message', function ( event ) {
    const message = event.data;

    if ( message.type === 'start' ) {
        session = createSession( message.source );
        runUntilBlocked();
    } else if ( message.type === 'input' && session ) {
        session.stdin.push( message.line );
        runUntilBlocked();
    } else if ( message.type === 'eof' && session ) {
        session.stdin.close();
        runUntilBlocked();
    }
} );
