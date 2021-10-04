import axios from 'axios';
import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                // console.log('onResolve', args);
                const { path } = args;

                if (path === 'index.js') {
                    return { path, namespace: 'a' };
                }

                if (path.includes('./') || path.includes('../')) {
                    const resolvedPath = new URL(path, `https://unpkg.com${args.resolveDir}/`);
                    return {
                        namespace: 'a',
                        path: resolvedPath.href,
                    };
                }

                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${path}`,
                };
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                // console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
                            import React from 'react';
                            console.log(React);
                        `,
                    };
                }

                const { data, request } = await axios.get(args.path);
                const directory = removeFilename(request.responseURL);

                return {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: directory.pathname,
                };
            });
        },
    };
};

/**
 * Remove filename from `pathname` of a URL
 * @param {string} url - The URL
 * @example
 * extractDirectory('https://unpkg.com/my-pkg/index.js').pathname //-> /my-pkg/
 * @return {URL} A new URL with filename stripped off
 */
function removeFilename(url: string): URL {
    return new URL('./', url);
}
