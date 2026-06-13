// Bundles the demo into ./dist with esbuild. The output is committed, so the
// demo runs straight from a clone with no install, while CodeMirror and the
// runtime are inlined here rather than fetched from a CDN at load time.

import {
    cpSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { basename, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const here = ( p ) => fileURLToPath( new URL( p, import.meta.url ) ),
    outdir = here( './dist' );

// These pages go into dist unbundled, referencing their bundles by stable
// names (main.js, editor.js, style.css); the only rewrite is the modulepreload
// links injected below for each page's hashed chunks.
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
    // Fonts ship as static files copied into dist below; leave their url()
    // references in the CSS untouched rather than fingerprinting them.
    external: [ '*.woff2' ],
    format: 'esm',
    splitting: true,
    minify: true,
    outdir,
    entryNames: '[name]',
    chunkNames: 'chunks/[name]-[hash]',
    loader: { '.sno': 'text' },
    target: [ 'es2022' ],
    plugins: [ examplesPlugin ],
    metafile: true,
    logLevel: 'info',
};

// Walk an entry's transitive static imports in the metafile, returning each
// shared chunk's href relative to the page that loads the entry.
function chunksFor( outputs, entry ) {
    const base = dirname( entry ),
        seen = new Set(),
        stack = [ entry ];
    while ( stack.length ) {
        for ( const imp of outputs[stack.pop()]?.imports ?? [] ) {
            if ( imp.kind === 'import-statement' && !seen.has( imp.path ) ) {
                seen.add( imp.path );
                stack.push( imp.path );
            }
        }
    }
    return [ ...seen ].map( ( p ) => `./${relative( base, p )}` );
}

// A page's chunks are reachable only through its entry, so the browser can't
// fetch them until it has downloaded and parsed that entry. A modulepreload
// link per chunk starts them in parallel instead, saving a round trip.
function addPreloads( html, { outputs } ) {
    return html.replace(
        /^([ \t]*)<script type="module" src="\.\/([^"]+)"><\/script>/m,
        ( line, indent, src ) => {
            const entry = Object.keys( outputs ).find(
                    ( o ) => outputs[o].entryPoint && basename( o ) === src,
                ),
                links = chunksFor( outputs, entry ).map( ( href ) =>
                    `${indent}<link rel="modulepreload" href="${href}">`
                );
            return [ ...links, line ].join( '\n' );
        },
    );
}

rmSync( outdir, { recursive: true, force: true } );
const { metafile } = await esbuild.build( options );
cpSync( here( './fonts' ), `${outdir}/fonts`, { recursive: true } );
for ( const name of STATIC ) {
    writeFileSync(
        `${outdir}/${name}`,
        addPreloads( readFileSync( here( `./${name}` ), 'utf8' ), metafile ),
    );
}
