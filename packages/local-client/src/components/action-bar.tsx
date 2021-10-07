import './action-bar.css';
import { FC } from 'react';
import { useActions } from '../hooks/use-actions';

interface ActionBarProps {
    id: string;
}

const ActionBar: FC<ActionBarProps> = ({ id }) => {
    const { moveCell, deleteCell } = useActions();

    return (
        <div className="action-bar">
            <button onClick={() => moveCell(id, 'up')} className="button is-primary is-small">
                <span className="icon">
                    <i className="fas fa-arrow-up"></i>
                </span>
            </button>
            <button onClick={() => moveCell(id, 'down')} className="button is-primary is-small">
                <span className="icon">
                    <i className="fas fa-arrow-down"></i>
                </span>
            </button>
            <button onClick={() => deleteCell(id)} className="button is-primary is-small">
                <span className="icon">
                    <i className="fas fa-times"></i>
                </span>
            </button>
        </div>
    );
};

export default ActionBar;
