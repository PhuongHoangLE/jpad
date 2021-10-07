import './cell-list.css';
import { FC, Fragment, useEffect } from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import AddCell from './add-cell';
import CellListItem from './cell-list-item';
import { useActions } from '../hooks/use-actions';

const CellList: FC = () => {
    const cells = useTypedSelector(({ cells }) => {
        if (!cells) return [];
        const { order, data } = cells;
        return order.map((id) => data[id]);
    });
    const { fetchCells } = useActions();

    useEffect(() => {
        fetchCells();
    }, [fetchCells]);

    const renderedCells = cells.map((cell) => (
        <Fragment key={cell.id}>
            <CellListItem cell={cell} />
            <AddCell previousCellId={cell.id} />
        </Fragment>
    ));
    return (
        <div className="cell-list">
            <AddCell visible={cells.length === 0} />
            {renderedCells}
        </div>
    );
};

export default CellList;
