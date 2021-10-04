import axios from 'axios';
import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log('onResolve', args);
                const { path } = args;

                if (path === 'index.js') {
                    return { path, namespace: 'a' };
                }

                if (path.includes('./') || path.includes('../')) {
                    return {
                        namespace: 'a',
                        path: new URL(path, args.importer + '/').href,
                    };
                }

                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${path}`,
                };
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `
                            const message = require('medium-test-pkg');
                            console.log(message);
                        `,
                    };
                }

                const { data } = await axios.get(args.path);
                console.log(data);
                return {
                    loader: 'jsx',
                    contents: data,
                };
            });
        },
    };
};
