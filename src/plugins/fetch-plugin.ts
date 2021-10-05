import axios from 'axios';
import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage';
import lets from '../utils';

const fileCache = localForage.createInstance({
    name: 'filecache',
});

export const fetchPlugin = (inputCode: string | undefined) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onLoad({ filter: /(^index\.js$)/ }, () => {
                return { loader: 'jsx', contents: inputCode };
            });

            build.onLoad({ filter: /.*/ }, async ({ path }: any) => {
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(path);
                if (cachedResult) return cachedResult;
            });

            build.onLoad({ filter: /.css$/ }, async ({ path }: any) => {
                const { data, request } = await axios.get<string>(path);
                const escaped = data.replace(/\n/g, '').replace(/"/g, '\\"').replace(/'/g, "\\'");
                const contents = `
                    const style = document.createElement('style');
                    style.innerText = '${escaped}';
                    document.head.appendChild(style);
                `;
                return await cache(path, request.responseURL, contents);
            });

            build.onLoad({ filter: /.*/ }, async ({ path }: any) => {
                const { data: contents, request } = await axios.get<string>(path);
                return await cache(path, request.responseURL, contents);
            });
        },
    };
};

async function cache(path: string, responseURL: string, contents: string) {
    const resolveDir = lets.removeFilename(responseURL).pathname;
    const result: esbuild.OnLoadResult = { loader: 'jsx', contents, resolveDir };
    await fileCache.setItem(path, result);
    return result;
}
