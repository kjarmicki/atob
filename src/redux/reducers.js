import { combineReducers } from 'redux';
import { SELECT_TAB, TAB_TRANSITION_ENDED,
    KEEP_AWAKE, ALLOW_SLEEP,
    INIT_POINTS, REMOVE_POINT, CHOOSE_POINT, DISREGARD_POINT,
    FORM_POINT_NAME
} from './actions';

function tabs(state = {
    selected: null,
    transitionProgress: 'ended'
}, action = {}) {
    switch(action.type) {
        case SELECT_TAB:
            if(action.tab !== state.selected)
                return Object.assign({}, state, {
                    selected: action.tab,
                    transitionProgress: 'running'
                });
            return state;
        case TAB_TRANSITION_ENDED:
            return Object.assign({}, state, {
                transitionProgress: 'ended'
            });
        default:
            return state;
    }
}

function keepAwake(state = false, action = {}) {
    if(action.type === KEEP_AWAKE || action.type === ALLOW_SLEEP) {
        return action.flag;
    }
    return state;
}

function points(state = [], action = {}) {
    switch(action.type) {
        case REMOVE_POINT:
            return state.filter(point =>
                !point.equals(action.point));
        case CHOOSE_POINT:
            return state.map(point =>
                    point.equals(action.point) ? point.chooseForNavigation() : point.disregardForNavigation());
        case DISREGARD_POINT:
            return state.map(point =>
                point.equals(action.point) ? point.disregardForNavigation() : point);
        case INIT_POINTS:
            return action.points;
        default:
            return state;
    }
}

function pointForm(state = {
    name: '',
    message: '',
    watchId: null,
    formVisible: false
}, action = {}) {
    switch(action.type) {
        case FORM_POINT_NAME:
            return Object.assign({}, state, {
                name: action.name
            });
        default:
            return state;
    }
}

export default combineReducers({
    tabs,
    keepAwake,
    points,
    pointForm
});
