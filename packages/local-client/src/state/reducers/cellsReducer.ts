import produce from 'immer';
import { randomId } from '../../utils';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
    loading: boolean;
    error: string | null;
    order: string[];
    data: {
        [key: string]: Cell;
    };
}

const initialState: CellsState = {
    loading: false,
    error: null,
    order: [],
    data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
        case ActionType.UPDATE_CELL:
            {
                const { id: cellId, content } = action.payload;
                state.data[cellId].content = content;
            }
            break;
        case ActionType.DELETE_CELL:
            {
                const cellId = action.payload;
                delete state.data[cellId];
                state.order = state.order.filter((id) => id !== cellId);
            }
            break;
        case ActionType.MOVE_CELL:
            {
                const { id: cellId, direction } = action.payload;
                const index = state.order.findIndex((id) => id === cellId);
                const targetIndex = direction === 'up' ? index - 1 : index + 1;
                if (targetIndex >= 0 && targetIndex < state.order.length - 1) {
                    state.order[index] = state.order[targetIndex];
                    state.order[targetIndex] = cellId;
                }
            }
            break;
        case ActionType.INSERT_CELL_AFTER:
            {
                const cell: Cell = {
                    content: '',
                    type: action.payload.type,
                    id: randomId(),
                };
                state.data[cell.id] = cell;
                const foundIndex = state.order.findIndex((id) => id === action.payload.id);
                if (foundIndex < 0) state.order.unshift(cell.id);
                else state.order.splice(foundIndex + 1, 0, cell.id);
            }
            break;
        default:
            break;
    }

    return state;
});

export default reducer;
