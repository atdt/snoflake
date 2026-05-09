"use strict";

import SNOBOL from '../src/snobol.js';

function captureWriter() {
    const lines = [];

    return {
        lines: lines,
        write( line ) { lines.push( line ); }
    };
}

function joinLines( lines ) {
    return lines.length === 0 ? '' : lines.join( '\n' ) + '\n';
}

export function runSnoflake( source, options = {} ) {
    const stdout = captureWriter(),
          stderr = captureWriter(),
          sourcePath = options.file || 'demo.sno',
          inputPath = options.input || 'input.txt',
          files = new Map( [
              [ sourcePath, source ],
              [ inputPath, options.inputText || '' ]
          ] ),
          vm = new SNOBOL.VM( {
              ...options,
              file: sourcePath,
              input: options.inputText === undefined ? undefined : inputPath,
              stdout: stdout,
              stderr: stderr,
              loader: {
                  load( path ) {
                      if ( !files.has( path ) ) {
                          throw new Error( 'No demo file named ' + path );
                      }

                      return files.get( path );
                  }
              }
          } );

    try {
        vm.run( SNOBOL.image );
    } catch ( e ) {
        stderr.write( 'Execution error: ' + ( e && e.message || e ) );
    }

    return {
        stdout: joinLines( stdout.lines ),
        stderr: joinLines( stderr.lines ),
        exitCode: vm.exitCode
    };
}
