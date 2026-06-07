// Static file server for the built demo. It serves ./dist, the committed
// bundle, so `npm run demo` works from a clone with no install or build step.
// Run build.js with --serve instead to rebuild on change while developing.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.sno': 'text/plain; charset=utf-8',
};

function responseHeaders( file ) {
    return {
        'Content-Type': contentTypes[path.extname( file )] ||
            'application/octet-stream',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'same-origin',
    };
}

export function startServer( root ) {
    root = path.resolve(
        root || fileURLToPath( new URL( './dist', import.meta.url ) ),
    );
    const portArg = process.argv.indexOf( '--port' );
    const port = Number(
        portArg !== -1 ? process.argv[portArg + 1] : process.env.PORT || 4173,
    );
    const host = process.env.HOST || '127.0.0.1';

    const server = http.createServer( function ( req, res ) {
        const url = new URL( req.url, 'http://' + host ),
            pathname = decodeURIComponent(
                url.pathname.endsWith( '/' )
                    ? url.pathname + 'index.html'
                    : url.pathname,
            ),
            file = path.normalize( path.join( root, pathname ) );

        if ( file !== root && !file.startsWith( root + path.sep ) ) {
            res.writeHead( 403 );
            res.end( 'Forbidden' );
            return;
        }

        fs.readFile( file, function ( err, data ) {
            if ( err ) {
                res.writeHead( 404 );
                res.end( 'Not found' );
                return;
            }

            res.writeHead( 200, responseHeaders( file ) );
            res.end( data );
        } );
    } );

    server.listen( port, host, function () {
        console.log( 'Snoflake demo: http://' + host + ':' + port + '/' );
    } );

    return server;
}

if ( import.meta.url === `file://${process.argv[1]}` ) {
    startServer();
}
