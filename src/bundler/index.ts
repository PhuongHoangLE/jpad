import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

let initialized = false;

const bundle = async (rawCode: string) => {
    if (!initialized) {
        await esbuild.initialize({ wasmURL: 'https://unpkg.com/esbuild-wasm@0.13.3/esbuild.wasm' });
        initialized = true;
    }

    const result = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
        define: {
            'process.env.NODE_ENV': '"production"',
            global: 'window',
        },
    });

    return result.outputFiles[0].text;
};

export default bundle;
