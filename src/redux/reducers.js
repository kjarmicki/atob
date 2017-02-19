import { SET_STATE } from './actions';

const DEFAULT_STATE = {
    selectedTab: null,
    transitionProgress: 'ended'
};

function setStateReducer(state, action) {
    return Object.assign({}, state, action.payload);
}

function rootReducer(state = DEFAULT_STATE, action = {}) {
    switch(action.type) {
        case SET_STATE:
            return setStateReducer(state, action);
        default:
            return state;
    }
}

export default rootReducer;