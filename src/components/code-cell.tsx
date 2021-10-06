import { FC, useEffect, useState } from 'react';
import bundle from '../bundler';
import { useActions } from '../hooks/use-actions';
import { Cell } from '../state';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

interface CodeCellProps {
    cell: Cell;
}

const CodeCell: FC<CodeCellProps> = ({ cell }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const { updateCell } = useActions();

    useEffect(() => {
        const timer = setTimeout(async () => {
            const { code, error } = await bundle(cell.content);
            setCode(code);
            setError(error);
        }, 1000);
        return () => clearTimeout(timer);
    }, [cell.content]);

    return (
        <Resizable direction="vertical">
            <div style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>
                <Resizable direction="horizontal">
                    <CodeEditor initialValue={cell.content} onChange={(value) => updateCell(cell.id, value)} />
                </Resizable>
                <Preview code={code} error={error} />
            </div>
        </Resizable>
    );
};

export default CodeCell;
