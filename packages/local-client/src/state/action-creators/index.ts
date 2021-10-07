import axios from 'axios';
import { Dispatch } from 'react';
import { RootState } from '..';
import bundle from '../../bundler';
import { ActionType } from '../action-types';
import {
    Action,
    DeleteCellAction,
    Direction,
    InsertCellAfterAction,
    MoveCellAction,
    UpdateCellAction,
} from '../actions';
import { Cell, CellType } from '../cell';

export const updateCell = (id: string, content: string): UpdateCellAction => {
    return {
        type: ActionType.UPDATE_CELL,
        payload: { id, content },
    };
};

export const deleteCell = (id: string): DeleteCellAction => {
    return {
        type: ActionType.DELETE_CELL,
        payload: id,
    };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
    return {
        type: ActionType.MOVE_CELL,
        payload: { id, direction },
    };
};

export const insertCellAfter = (id: string | undefined, type: CellType): InsertCellAfterAction => {
    return {
        type: ActionType.INSERT_CELL_AFTER,
        payload: { id, type },
    };
};

export const createBundle = (id: string, input: string) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionType.BUNDLE_START,
            payload: { id },
        });

        const result = await bundle(input);

        dispatch({
            type: ActionType.BUNDLE_COMPLETE,
            payload: { id, bundle: result },
        });
    };
};

export const fetchCells = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({ type: ActionType.FETCH_CELLS });

        try {
            const { data }: { data: Cell[] } = await axios.get('/cells');
            dispatch({
                type: ActionType.FETCH_CELLS_COMPLETE,
                payload: data,
            });
        } catch (error: any) {
            dispatch({
                type: ActionType.FETCH_CELLS_ERROR,
                payload: error.message,
            });
        }
    };
};

export const saveCells = () => {
    return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
        const { cells: cellsState } = getState();
        if (!cellsState) return;
        const { data, order } = cellsState;
        const cells = order.map((id) => data[id]);

        try {
            await axios.post('./cells', { cells });
        } catch (error: any) {
            dispatch({
                type: ActionType.SAVE_CELLS_ERROR,
                payload: error.message,
            });
        }
    };
};
