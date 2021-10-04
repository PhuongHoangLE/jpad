import * as esbuild from 'esbuild-wasm';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
    const [esbuildReady, setEsbuildReady] = useState(false);
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    useEffect(() => {
        esbuild.initialize({ wasmURL: '/esbuild.wasm' }).then(() => setEsbuildReady(true));
    }, []);

    const onClick = async () => {
        if (!esbuildReady) return;
        const result = await esbuild.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(input)],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window',
            },
        });
        setCode(result.outputFiles[0].text);
    };

    return (
        <div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <pre>{code}</pre>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
