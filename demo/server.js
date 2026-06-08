// Static file server for the built demo. It serves ./dist, the committed
// bundle, so `npm run serve` works from a clone with no install or build step.

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

const root = path.resolve(
    fileURLToPath( new URL( './dist', import.meta.url ) ),
);

function startServer( host, port ) {
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
}

if ( import.meta.url === `file://${process.argv[1]}` ) {
    const portArg = process.argv.indexOf( '--port' ),
        port = portArg !== -1 ? process.argv[portArg + 1] : process.env.PORT,
        host = process.env.HOST || '127.0.0.1';
    startServer( host, Number( port || 4173 ) );
}
