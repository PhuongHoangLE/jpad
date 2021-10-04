import axios from 'axios';
import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage';
import lets from '../utils';

const fileCache = localForage.createInstance({
    name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {
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
                const resolveDir = lets.removeFilename(request.responseURL).pathname;
                const result: esbuild.OnLoadResult = { loader: 'jsx', contents, resolveDir };
                await fileCache.setItem(path, result);
                return result;
            });
        },
    };
};
