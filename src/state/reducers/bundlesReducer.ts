import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface BundlesState {
    [key: string]:
        | {
              loading: boolean;
              code: string;
              error: string;
          }
        | undefined;
}

const initialState: BundlesState = {};

const reducer = produce((state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
        case ActionType.BUNDLE_START:
            state[action.payload.id] = {
                loading: true,
                code: '',
                error: '',
            };
            break;
        case ActionType.BUNDLE_COMPLETE:
            state[action.payload.id] = {
                loading: false,
                code: action.payload.bundle.code,
                error: action.payload.bundle.error,
            };
            break;
        default:
            break;
    }

    return state;
});

export default reducer;
