import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
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
        },
    };
};
