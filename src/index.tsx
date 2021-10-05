import { useState } from 'react';
import ReactDOM from 'react-dom';
import bundle from './bundler';

import CodeEditor from './components/code-editor';
import Preview from './components/preview';

const initialInput = "console.log('Hi there! 👋');";

const App = () => {
    const [input, setInput] = useState(initialInput);
    const [code, setCode] = useState('');

    const onClick = async () => {
        const output = await bundle(input);
        setCode(output);
    };

    return (
        <div>
            <CodeEditor initialValue={initialInput} onChange={(value) => setInput(value)} />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <br />
            <Preview code={code} />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
