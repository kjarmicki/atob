import { SET_STATE } from './actions';

export function setState(newState) {
    return {
        type: SET_STATE,
        payload: newState
    };
}
