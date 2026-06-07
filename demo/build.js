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

// Static pages are copied verbatim. Each references its bundle by a stable
// name (./main.js, ./editor.js, ./style.css), so no rewriting is needed.
const STATIC = [ 'index.html', 'editor.html' ];

// The editor's examples live as real files on disk: one directory per example
// holding main.sno, an optional input.txt, and any -INCLUDE files, ordered by
// manifest.json. This plugin assembles them into the { label: { source, input,
// files } } map the editor expects, so `import EXAMPLES from 'examples:all'`
// resolves to the bundled data with no runtime fetch.
const examplesPlugin = {
    name: 'examples',
    setup( build ) {
        const root = here( './editor/examples' );

        build.onResolve( { filter: /^examples:all$/ }, () => ( {
            path: 'all',
            namespace: 'examples',
        } ) );

        build.onLoad(
            { filter: /.*/, namespace: 'examples' },
            async () => {
                const manifest = JSON.parse(
                        await readFile( `${root}/manifest.json`, 'utf8' ),
                    ),
                    watchFiles = [ `${root}/manifest.json` ],
                    examples = {};

                for ( const { name, dir } of manifest ) {
                    const base = `${root}/${dir}`,
                        files = {};
                    let input = '';

                    for ( const entry of ( await readdir( base ) ).sort() ) {
                        const path = `${base}/${entry}`;
                        watchFiles.push( path );
                        if ( entry === 'main.sno' ) continue;
                        if ( entry === 'input.txt' ) {
                            input = await readFile( path, 'utf8' );
                            continue;
                        }
                        files[entry] = await readFile( path, 'utf8' );
                    }

                    const source = await readFile(
                        `${base}/main.sno`,
                        'utf8',
                    );
                    examples[name] = Object.keys( files ).length
                        ? { source, input, files }
                        : { source, input };
                }

                return {
                    contents: `export default ${JSON.stringify( examples )}`,
                    loader: 'js',
                    watchFiles,
                };
            },
        );
    },
};

const options = {
    // The two workers are their own entry points so each becomes a
    // self-contained module worker. They emit as siblings of the page bundles
    // (shape-worker.js, editor-worker.js), which is where the new Worker(...)
    // calls look for them. Shared code (the runtime image) is split into a
    // common chunk rather than copied into every entry.
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
    assetNames: 'assets/[name]-[hash]',
    // SNOBOL example programs are inlined as strings into the bundle.
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
    startServer( { root: outdir } );
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
