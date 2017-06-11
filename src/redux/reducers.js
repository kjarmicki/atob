import { combineReducers } from 'redux';
import assign from 'object-assign';
import { SELECT_TAB, TAB_TRANSITION_ENDED,
    KEEP_AWAKE, ALLOW_SLEEP, WINDOW_RESIZE,
    INIT_POINTS, ADD_POINT, REMOVE_POINT, CHOOSE_POINT, DISREGARD_POINT, SET_CURRENT_POSITION, UNSET_CURRENT_POSITION,
    SHOULD_BE_UPDATING, SHOULD_NOT_BE_UPDATING, ALPHA_ROTATION,
    FORM_POINT_NAME, SHOW_FORM, HIDE_FORM, RESET_FORM, FORM_MESSAGE
} from './actions';

function tabs(state = {
    selected: 'points',
    transitionProgress: 'ended'
}, action = {}) {
    switch(action.type) {
        case SELECT_TAB:
            if(action.tab !== state.selected)
                return assign({}, state, {
                    selected: action.tab,
                    transitionProgress: 'running'
                });
            return state;
        case TAB_TRANSITION_ENDED:
            return assign({}, state, {
                transitionProgress: 'ended'
            });
        default:
            return state;
    }
}

function window(state = {
    width: 0,
    height: 0
}, action = {}) {
    switch(action.type) {
        case WINDOW_RESIZE:
            return assign({}, state, {
                width: action.width,
                height: action.height
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

function points(state = {
    navigatingTo: null,
    position: null,
    list: []
}, action = {}) {
    switch(action.type) {
        case CHOOSE_POINT:
            return assign({}, state, {
                navigatingTo: action.navigatingTo,
                list: action.list
            });
        case DISREGARD_POINT:
            return assign({}, state, {
                navigatingTo: null,
                list: action.list
            });
        case SET_CURRENT_POSITION:
            return assign({}, state, {
                position: action.position
            });
        case UNSET_CURRENT_POSITION:
            return assign({}, state, {
                position: null
            });
        case ADD_POINT:
        case REMOVE_POINT:
        case INIT_POINTS:
            return assign({}, state, {
                list: action.list
            });
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
            return assign({}, state, {
                name: action.name
            });
        case  SHOW_FORM:
            return assign({}, state, {
                formVisible: true
            });
        case HIDE_FORM:
            return assign({}, state, {
                formVisible: false
            });
        case RESET_FORM:
            return assign({}, state, {
                name: '',
                message: ''
            });
        case FORM_MESSAGE:
            return assign({}, state, {
                message: action.message
            });
        default:
            return state;
    }
}

function navigation(state = {
    alphaRotation: null,
    shouldBeUpdating: false
}, action = {}) {
    switch(action.type) {
        case SHOULD_BE_UPDATING:
            return assign({}, state, {
                shouldBeUpdating: true
            });
        case SHOULD_NOT_BE_UPDATING:
            return assign({}, state, {
                shouldBeUpdating: false
            });
        case ALPHA_ROTATION:
            return assign({}, state, {
                alphaRotation: action.alphaRotation
            });
        default:
            return state;
    }
}

export default combineReducers({
    tabs,
    window,
    keepAwake,
    points,
    pointForm,
    navigation
});
