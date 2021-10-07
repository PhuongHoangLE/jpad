import './add-cell.css';
import { FC } from 'react';
import { useActions } from '../hooks/use-actions';

interface AddCellProps {
    previousCellId?: string;
    visible?: boolean;
}

const AddCell: FC<AddCellProps> = ({ previousCellId, visible }) => {
    const { insertCellAfter } = useActions();
    return (
        <div className={`add-cell ${visible && 'visible'}`}>
            <div className="add-buttons">
                <button
                    onClick={() => insertCellAfter(previousCellId, 'code')}
                    className="button is-rounded is-primary is-small"
                >
                    <span className="icon is-small">
                        <i className="fas fa-plus" />
                    </span>
                    <span>Code</span>
                </button>
                <button
                    onClick={() => insertCellAfter(previousCellId, 'text')}
                    className="button is-rounded is-primary is-small"
                >
                    <span className="icon is-small">
                        <i className="fas fa-plus" />
                    </span>
                    <span>Text</span>
                </button>
            </div>
            <div className="divider"></div>
        </div>
    );
};

export default AddCell;
