// Bundles the demo into ./dist with esbuild. The output is committed, so the
// demo runs straight from a clone with no install, while CodeMirror and the
// runtime are inlined here rather than fetched from a CDN at load time.
//
// Pass --serve to rebuild on change and serve the result.

import { cp, readdir, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import * as esbuild from 'esbuild';

import { startServer } from './server.js';

const serve = process.argv.includes( '--serve' ),
    here = ( p ) => fileURLToPath( new URL( p, import.meta.url ) ),
    outdir = here( './dist' );

// Static pages are copied verbatim; each references its bundle by a stable
// name (./main.js, ./editor.js, ./style.css), so no rewriting is needed.
const STATIC = [ 'index.html', 'editor.html' ];

// The editor's examples live on disk: one directory per example with a
// main.sno, an optional input.txt, and any -INCLUDE files, ordered by
// manifest.json. This assembles them into the map the editor imports as
// 'examples:all', baked into the bundle with no runtime fetch.
const examplesPlugin = {
    name: 'examples',
    setup( build ) {
        const root = here( './editor/examples' );

        build.onResolve( { filter: /^examples:all$/ }, () => ( {
            path: 'all',
            namespace: 'examples',
        } ) );

        build.onLoad( { filter: /.*/, namespace: 'examples' }, async () => {
            const manifest = JSON.parse(
                    await readFile( `${root}/manifest.json`, 'utf8' ),
                ),
                watchFiles = [ `${root}/manifest.json` ],
                examples = {};

            for ( const { name, dir } of manifest ) {
                const base = `${root}/${dir}`,
                    source = await readFile( `${base}/main.sno`, 'utf8' ),
                    files = {};
                let input = '';

                for ( const entry of ( await readdir( base ) ).sort() ) {
                    const path = `${base}/${entry}`;
                    watchFiles.push( path );
                    if ( entry === 'main.sno' ) continue;
                    if ( entry === 'input.txt' ) {
                        input = await readFile( path, 'utf8' );
                    } else {
                        files[entry] = await readFile( path, 'utf8' );
                    }
                }

                examples[name] = Object.keys( files ).length
                    ? { source, input, files }
                    : { source, input };
            }

            return {
                contents: JSON.stringify( examples ),
                loader: 'json',
                watchFiles,
            };
        } );
    },
};

const options = {
    // Each worker is its own entry point, emitted as a sibling of the page
    // bundles (shape-worker.js, editor-worker.js) where its new Worker(...)
    // call looks for it. Splitting keeps the shared runtime image in one chunk.
    entryPoints: {
        main: here( './main.js' ),
        editor: here( './editor/main.js' ),
        style: here( './style.css' ),
        'shape-worker': here( './workers/shape-worker.js' ),
        'editor-worker': here( './editor/worker.js' ),
    },
    bundle: true,
    format: 'esm',
    splitting: true,
    minify: true,
    sourcemap: serve,
    outdir,
    entryNames: '[name]',
    chunkNames: 'chunks/[name]-[hash]',
    loader: { '.sno': 'text' },
    target: [ 'es2022' ],
    plugins: [ examplesPlugin ],
    logLevel: 'info',
};

await rm( outdir, { recursive: true, force: true } );

if ( serve ) {
    const ctx = await esbuild.context( options );
    await ctx.watch();
    await copyStatic();
    startServer( outdir );
} else {
    await esbuild.build( options );
    await copyStatic();
}

async function copyStatic() {
    await Promise.all(
        STATIC.map( ( name ) =>
            cp( here( `./${name}` ), `${outdir}/${name}` )
        ),
    );
}
