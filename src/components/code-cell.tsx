import { useEffect, useState } from 'react';
import bundle from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

const initialInput = "console.log('Hi there! 👋');";

const CodeCell = () => {
    const [input, setInput] = useState(initialInput);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setTimeout(async () => {
            const { code, error } = await bundle(input);
            setCode(code);
            setError(error);
        }, 1000);
        return () => clearTimeout(timer);
    }, [input]);

    return (
        <Resizable direction="vertical">
            <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
                <Resizable direction="horizontal">
                    <CodeEditor initialValue={initialInput} onChange={(value) => setInput(value)} />
                </Resizable>
                <Preview code={code} error={error} />
            </div>
        </Resizable>
    );
};

export default CodeCell;
