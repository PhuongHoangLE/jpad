import './cell-list-item.css';
import { FC } from 'react';
import { Cell } from '../state';
import ActionBar from './action-bar';
import CodeCell from './code-cell';
import TextEditor from './text-editor';

interface CellListItemProps {
    cell: Cell;
}

const CellListItem: FC<CellListItemProps> = ({ cell }) => {
    const child =
        cell.type === 'code' ? (
            <>
                <div className="action-bar-wrapper">
                    <ActionBar id={cell.id} />
                </div>
                <CodeCell cell={cell} />
            </>
        ) : (
            <>
                <TextEditor cell={cell} />
                <ActionBar id={cell.id} />
            </>
        );
    return <div className="cell-list-item">{child}</div>;
};

export default CellListItem;
