import assign from 'object-assign';
import pointModel from '../model/point';

// UI
export const SELECT_TAB = 'SELECT_TAB';
export const TAB_TRANSITION_ENDED = 'TAB_TRANSITION_ENDED';
export const WINDOW_RESIZE = 'WINDOW_RESIZE';

// screen sleep
export const KEEP_AWAKE = 'KEEP_AWAKE';
export const ALLOW_SLEEP = 'ALLOW_SLEEP';

// points management
export const UPDATE_POINTS = 'UPDATE_POINTS';
export const CHOOSE_POINT = 'CHOOSE_POINT';
export const DISREGARD_POINT = 'DISREGARD_POINT';
export const SET_CURRENT_POSITION = 'SET_CURRENT_POSITION';
export const UNSET_CURRENT_POSITION = 'UNSET_CURRENT_POSITION';

// new point form
export const FORM_POINT_NAME = 'FORM_POINT_NAME';
export const SHOW_FORM = 'SHOW_FORM';
export const HIDE_FORM = 'HIDE_FORM';
export const RESET_FORM = 'RESET_FORM';
export const FORM_MESSAGE = 'FORM_MESSAGE';

// navigation
export const ALPHA_ROTATION = 'ALPHA_ROTATION';
export const SHOULD_BE_UPDATING = 'SHOULD_BE_UPDATING';
export const SHOULD_NOT_BE_UPDATING = 'SHOULD_NOT_BE_UPDATING';

export function selectTab(tab) {
    return {
        type: SELECT_TAB,
        tab
    };
}

export function tabTransitionEnded() {
    return {
        type: TAB_TRANSITION_ENDED
    };
}

export function windowResize(width, height) {
    return {
        type: WINDOW_RESIZE,
        width, height
    };
}

export function keepAwakeToggle(flag) {
    return (dispatch, getState, { insomnia }) => {
        if (flag) {
            insomnia.keepAwake();
            return dispatch({
                type: KEEP_AWAKE
            });
        } else {
            insomnia.allowSleepAgain();
            return dispatch({
                type: ALLOW_SLEEP
            });
        }
    };
}

export function initPoints() {
    return (dispatch, getState, { pointRepository }) => pointRepository.retrieveAll()
        .then(list => {
            dispatch({
                type: UPDATE_POINTS,
                list
            });
            const chosenForNavigation = list.filter(point => point.isChosenForNavigation())[0];
            if(chosenForNavigation) {
                return dispatch(choosePoint(chosenForNavigation));
            }
            return Promise.resolve();
        });
}

export function addPoint(point) {
    return (dispatch, getState, { pointRepository }) => pointRepository.store(point)
        .then(() => pointRepository.retrieveAll())
        .then(list => dispatch({
            type: UPDATE_POINTS,
            list
        }));
}

export function removePoint(point) {
    return (dispatch, getState, { pointRepository }) => {
        return Promise.resolve()
            .then(() => point.isChosenForNavigation() ? disregardPoint(point)(dispatch, getState, { pointRepository }) : null)
            .then(() => pointRepository.remove(point))
            .then(() => pointRepository.retrieveAll())
            .then(list => dispatch({
                type: UPDATE_POINTS,
                list
            }));
    };
}

export function choosePoint(point) {
    return (dispatch, getState, { pointRepository, insomnia }) => {
        dispatch(keepAwakeToggle(true)(dispatch, getState, {insomnia}));

        let newlyChosen;
        return pointRepository.retrieveAll()
            .then(points => {
                const operations = [];
                const currentlyChosen = points.filter(point => point.isChosenForNavigation())[0];
                if (currentlyChosen && !currentlyChosen.equals(point)) {
                    const previous = currentlyChosen.disregardForNavigation();
                    operations.push(pointRepository.store(previous));
                }
                newlyChosen = point.chooseForNavigation();
                operations.push(pointRepository.store(newlyChosen));

                return Promise.all(operations)
            })
            .then(() => pointRepository.retrieveAll())
            .then(list => dispatch({
                type: CHOOSE_POINT,
                navigatingTo: newlyChosen,
                list
            }))
            .then(() => {
                dispatch(requestUpdates());
                dispatch(pollOrientation());
                dispatch(watchCoordinates());
                dispatch(selectTab('navigation'));
            });
    }
}

export function disregardPoint(point) {
    return (dispatch, getState, { pointRepository }) => {
        dispatch(keepAwakeToggle(false));
        const newlyDisregarded = point.disregardForNavigation();
        return pointRepository.store(newlyDisregarded)
            .then(() => pointRepository.retrieveAll())
            .then(list => dispatch({
                type: DISREGARD_POINT,
                list
            }))
            .then(() => {
                dispatch(stopUpdates());
                dispatch(stopPollingOrientation());
                dispatch(stopWatchingCoordinates());
                dispatch(selectTab('points'));
            });
    };
}

export function formPointName(name) {
    return {
        type: FORM_POINT_NAME,
        name
    };
}

export function showForm() {
    return {
        type: SHOW_FORM
    };
}

export function hideForm() {
    return {
        type: HIDE_FORM
    };
}

export function resetForm() {
    return {
        type: RESET_FORM
    };
}

export function formMessage(message) {
    return {
        type: FORM_MESSAGE,
        message
    };
}

export function setCurrentPosition(currentCoordinates) {
    const position = pointModel(assign(currentCoordinates, {
        name: 'current'
    }));
    return {
        type: SET_CURRENT_POSITION,
        position
    }
}

export function watchCoordinates() {
    return (dispatch, getState, { geolocationProvider }) => {
        geolocationProvider.watchCoordinates(coordinates => {
            dispatch(setCurrentPosition(coordinates));
        });
    };
}

export function stopWatchingCoordinates() {
    return (dispatch, getState, { geolocationProvider }) => {
        geolocationProvider.stopWatchingCoordinates();
        return dispatch({
            type: UNSET_CURRENT_POSITION
        });
    };
}

export function getCoordinates() {
    return (dispatch, getState, { geolocationProvider }) =>
        geolocationProvider.getCoordinates();

}

export function pollOrientation() {
    return (dispatch, getState, { orientationProvider }) =>
        orientationProvider.startPolling();
}

export function requestOrientation() {
    return (dispatch, getState, { orientationProvider }) =>
        dispatch({
            type: ALPHA_ROTATION,
            alphaRotation: orientationProvider.getHeading()
        });
}

export function stopPollingOrientation() {
    return (dispatch, getState, { orientationProvider }) => {
        orientationProvider.stopPolling();
        return dispatch({
            type: ALPHA_ROTATION,
            alphaRotation: null
        });
    };
}

export function requestUpdates() {
    return {
        type: SHOULD_BE_UPDATING
    };
}

export function stopUpdates() {
    return {
        type: SHOULD_NOT_BE_UPDATING
    };
}
