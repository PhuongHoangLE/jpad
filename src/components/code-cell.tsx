import { useState } from 'react';
import bundle from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';

const initialInput = "console.log('Hi there! 👋');";

const CodeCell = () => {
    const [input, setInput] = useState(initialInput);
    const [code, setCode] = useState('');

    const onClick = async () => {
        const output = await bundle(input);
        setCode(output);
    };

    return (
        <div>
            <CodeEditor initialValue={initialInput} onChange={(value) => setInput(value)} />
            <button onClick={onClick} className="button">
                Submit
            </button>
            <Preview code={code} />
        </div>
    );
};

export default CodeCell;
