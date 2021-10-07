import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

let initialized = false;
let initializing = false;

const bundle = async (rawCode: string) => {
    if (initializing) {
        return { code: '', error: '' };
    }

    if (!initialized) {
        initializing = true;
        await esbuild.initialize({ wasmURL: 'https://unpkg.com/esbuild-wasm@0.13.3/esbuild.wasm' });
        initializing = false;
        initialized = true;
    }

    try {
        const result = await esbuild.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window',
            },
            jsxFactory: '$__React.createElement',
            jsxFragment: '$__React.Fragment',
        });
        return { code: result.outputFiles[0].text, error: '' };
    } catch (error: any) {
        return { code: '', error: error.message };
    }
};

export default bundle;
