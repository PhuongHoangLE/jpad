import axios from 'axios';
import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
    name: 'filecache',
});

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
                const { path } = args;

                if (path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
                            import React from 'react';
                            console.log(React);
                        `,
                    };
                }

                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(path);
                if (cachedResult) return cachedResult;

                const { data: contents, request } = await axios.get(path);
                const resolveDir = removeFilename(request.responseURL).pathname;
                const result: esbuild.OnLoadResult = { loader: 'jsx', contents, resolveDir };
                await fileCache.setItem(path, result);
                return result;
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
