import * as esbuild from 'esbuild-wasm';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    const [esbuildReady, setEsbuildReady] = useState(false);
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    useEffect(() => {
        esbuild.initialize({ wasmURL: '/esbuild.wasm' }).then(() => setEsbuildReady(true));
    }, []);

    const onClick = async () => {
        if (!esbuildReady) return;
        const result = await esbuild.transform(input, {
            loader: 'jsx',
            target: 'es2015',
        });
        setCode(result.code);
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
