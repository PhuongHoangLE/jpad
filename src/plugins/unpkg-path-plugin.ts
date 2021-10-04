import axios from 'axios';
import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
    name: 'filecache',
});

export const unpkgPathPlugin = (inputCode: string) => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            // Handle root entry file of 'index.js'
            build.onResolve({ filter: /(^index\.js$)/ }, () => {
                return { namespace: 'a', path: 'index.js' };
            });

            // Handle relative paths in a module
            build.onResolve({ filter: /^\.+\// }, ({ path, resolveDir }: any) => {
                const resolvedPath = new URL(path, `https://unpkg.com${resolveDir}/`);
                return { namespace: 'a', path: resolvedPath.href };
            });

            // Handle main file of a module
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                const { path } = args;

                if (path === 'index.js') {
                    return { path, namespace: 'a' };
                }

                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${path}`,
                };
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                const { path } = args;

                if (path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: inputCode,
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
