import * as esbuild from 'esbuild-wasm';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import CodeEditor from './components/code-editor';

const App = () => {
    const [esbuildReady, setEsbuildReady] = useState(false);
    const [input, setInput] = useState<string | undefined>('');
    // const [code, setCode] = useState('');
    const iframe = useRef<any>();
    const html = `
    <html>
        <head></head>
        <body>
            <div id="root"></div>
            <script>
                window.addEventListener(
                    'message',
                    (event) => {
                        try {
                            eval(event.data);
                        } catch (error) {
                            const root = document.getElementById('root');
                            root.innerHTML = '<div>' + '<h4 style="color: red">Runtime Error</h4>' + error + '</div>';
                            console.error(error);
                        }
                    },
                    false
                );
            </script>
        </body>
    </html>
    `;

    useEffect(() => {
        esbuild
            .initialize({ wasmURL: 'https://unpkg.com/esbuild-wasm@0.13.3/esbuild.wasm' })
            .then(() => setEsbuildReady(true));
    }, []);

    const onClick = async () => {
        if (!esbuildReady) return;
        iframe.current.srcdoc = html;
        const result = await esbuild.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(input)],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window',
            },
        });
        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
        // setCode(result.outputFiles[0].text);
    };

    return (
        <div>
            <CodeEditor initialValue="const a = 1" onChange={(value) => setInput(value)} />
            {/* <textarea
                value={input}
                onChange={(e) => {
                    onClick(e.target.value);
                    setInput(e.target.value);
                }}
                style={{ width: '100%', height: '5em' }}
            ></textarea> */}
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <br />
            <iframe
                ref={iframe}
                sandbox="allow-scripts"
                srcDoc={html}
                title="sandbox"
                style={{ width: '100%', height: '660px', border: 0 }}
            ></iframe>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
