import { combineReducers } from 'redux';
import { SELECT_TAB, TAB_TRANSITION_ENDED,
    KEEP_AWAKE, ALLOW_SLEEP,
    INIT_POINTS, ADD_POINT, REMOVE_POINT, CHOOSE_POINT, DISREGARD_POINT,
    FORM_POINT_NAME, SHOW_FORM, HIDE_FORM, RESET_FORM, FORM_MESSAGE
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
    if(action.type === KEEP_AWAKE) return true;
    if(action.type === ALLOW_SLEEP) return false;
    return state;
}

function points(state = [], action = {}) {
    switch(action.type) {
        case ADD_POINT:
        case REMOVE_POINT:
        case CHOOSE_POINT:
        case DISREGARD_POINT:
        case INIT_POINTS:
            return action.points;
        default:
            return state;
    }
}

function pointForm(state = {
    name: '',
    message: '',
    formVisible: false
}, action = {}) {
    switch(action.type) {
        case FORM_POINT_NAME:
            return Object.assign({}, state, {
                name: action.name
            });
        case  SHOW_FORM:
            return Object.assign({}, state, {
                formVisible: true
            });
        case HIDE_FORM:
            return Object.assign({}, state, {
                formVisible: false
            });
        case RESET_FORM:
            return Object.assign({}, state, {
                name: '',
                message: ''
            });
        case FORM_MESSAGE:
            return Object.assign({}, state, {
                message: action.message
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
