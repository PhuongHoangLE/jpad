import './code-cell.css';
import { FC, useEffect } from 'react';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { Cell } from '../state';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { useCumulativeCode } from '../hooks/use-cumulative-code';

interface CodeCellProps {
    cell: Cell;
}

let everBundled = false;

const CodeCell: FC<CodeCellProps> = ({ cell: { id, content } }) => {
    const { updateCell, createBundle } = useActions();
    const bundle = useTypedSelector(({ bundles }) => (bundles ? bundles[id] : undefined));
    const cumulativeCode = useCumulativeCode(id);

    useEffect(() => {
        if (!everBundled) {
            createBundle(id, cumulativeCode);
            everBundled = true;
            return;
        }
        const timer = setTimeout(async () => createBundle(id, cumulativeCode), 1000);
        return () => clearTimeout(timer);
    }, [id, cumulativeCode, createBundle]);

    return (
        <Resizable direction="vertical">
            <div style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>
                <Resizable direction="horizontal">
                    <CodeEditor initialValue={content} onChange={(value) => updateCell(id, value)} />
                </Resizable>
                <div className="progress-wrapper">
                    {!bundle || bundle.loading ? (
                        <div className="progress-cover">
                            <progress className="progress is-small is-primary" max="100">
                                Loading
                            </progress>
                        </div>
                    ) : (
                        <Preview code={bundle.code} error={bundle.error} />
                    )}
                </div>
            </div>
        </Resizable>
    );
};

export default CodeCell;
