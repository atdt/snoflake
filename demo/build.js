// Bundles the demo into ./dist with esbuild. The output is committed, so the
// demo runs straight from a clone with no install, while CodeMirror and the
// runtime are inlined here rather than fetched from a CDN at load time.

import { cpSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const here = ( p ) => fileURLToPath( new URL( p, import.meta.url ) ),
    outdir = here( './dist' );

// These pages are copied into dist unbundled. They reference their bundles by
// stable names (main.js, editor.js, style.css), so nothing needs rewriting.
const STATIC = [ 'index.html', 'editor.html' ];

// The editor's examples live on disk: one directory per example holding a
// single .sno program (its name doubles as the editor tab and menu label),
// an optional input.txt, and any -INCLUDE files, ordered by manifest.json.
// This assembles them into the list the editor imports as 'examples:all',
// baked into the bundle with no runtime fetch.
const examplesPlugin = {
    name: 'examples',
    setup( build ) {
        const root = here( './editor/examples' );

        build.onResolve( { filter: /^examples:all$/ }, () => ( {
            path: 'all',
            namespace: 'examples',
        } ) );

        build.onLoad( { filter: /.*/, namespace: 'examples' }, () => {
            const manifest = JSON.parse(
                    readFileSync( `${root}/manifest.json`, 'utf8' ),
                ),
                examples = [];

            for ( const { name, dir } of manifest ) {
                const base = `${root}/${dir}`,
                    entries = readdirSync( base ).sort(),
                    file = entries.find(
                        ( e ) => e.toLowerCase().endsWith( '.sno' ),
                    ),
                    files = {};
                let input = '';

                for ( const entry of entries ) {
                    if ( entry === file ) continue;
                    if ( entry === 'input.txt' ) {
                        input = readFileSync( `${base}/${entry}`, 'utf8' );
                    } else {
                        files[entry] = readFileSync(
                            `${base}/${entry}`,
                            'utf8',
                        );
                    }
                }

                examples.push( {
                    name,
                    file,
                    source: readFileSync( `${base}/${file}`, 'utf8' ),
                    input,
                    files,
                } );
            }

            return {
                contents: JSON.stringify( examples ),
                loader: 'json',
            };
        } );
    },
};

const options = {
    // Workers are entry points too, so each is emitted beside the page
    // bundles where its new Worker(...) URL resolves.
    entryPoints: {
        main: here( './main.js' ),
        editor: here( './editor/main.js' ),
        style: here( './style.css' ),
        'canvas-worker': here( './workers/canvas-worker.js' ),
        'shape-worker': here( './workers/shape-worker.js' ),
        'editor-worker': here( './editor/worker.js' ),
    },
    bundle: true,
    format: 'esm',
    splitting: true,
    minify: true,
    outdir,
    entryNames: '[name]',
    chunkNames: 'chunks/[name]-[hash]',
    loader: { '.sno': 'text' },
    target: [ 'es2022' ],
    plugins: [ examplesPlugin ],
    logLevel: 'info',
};

rmSync( outdir, { recursive: true, force: true } );
await esbuild.build( options );
for ( const name of STATIC ) {
    cpSync( here( `./${name}` ), `${outdir}/${name}` );
}
