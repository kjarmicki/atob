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
export const INIT_POINTS = 'INIT_POINTS';
export const ADD_POINT = 'ADD_POINT';
export const REMOVE_POINT = 'REMOVE_POINT';
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

export default function(insomnia, pointRepository, geolocationProvider, orientationProvider) {
    function selectTab(tab) {
        return {
            type: SELECT_TAB,
            tab
        };
    }

    function tabTransitionEnded() {
        return {
            type: TAB_TRANSITION_ENDED
        };
    }

    function windowResize(width, height) {
        return {
            type: WINDOW_RESIZE,
            width, height
        };
    }

    function keepAwakeToggle(flag) {
        if (flag) {
            insomnia.keepAwake();
            return {
                type: KEEP_AWAKE
            }
        } else {
            insomnia.allowSleepAgain();
            return {
                type: ALLOW_SLEEP
            };
        }
    }

    function initPoints() {
        return dispatch => pointRepository.retrieveAll()
            .then(list => {
                dispatch({
                    type: INIT_POINTS,
                    list
                });
                const chosenForNavigation = list.filter(point => point.isChosenForNavigation())[0];
                if(chosenForNavigation) {
                    return dispatch(choosePoint(chosenForNavigation));
                }
                return Promise.resolve();
            });
    }

    function addPoint(point) {
        return dispatch => pointRepository.store(point)
            .then(() => pointRepository.retrieveAll())
            .then(list => dispatch({
                type: ADD_POINT,
                list
            }));
    }

    function removePoint(point) {
        return dispatch => {
            return Promise.resolve()
                .then(() => point.isChosenForNavigation() ? disregardPoint(point) : null)
                .then(() => disregardPoint(point))
                .then(() => pointRepository.retrieveAll())
                .then(list => dispatch({
                    type: REMOVE_POINT,
                    list
                }))
        };
    }

    function choosePoint(point) {
        return dispatch => {
            dispatch(keepAwakeToggle(true));
            const operations = [];
            const currentlyChosen = pointRepository.retrieveAll()
                .filter(point => point.isChosenForNavigation())[0];
            if (currentlyChosen && !currentlyChosen.equals(point)) {
                const previous = currentlyChosen.disregardForNavigation();
                operations.push(pointRepository.store(previous));
            }
            const newlyChosen = point.chooseForNavigation();
            operations.push(pointRepository.store(newlyChosen));

            return Promise.all(operations)
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

    function disregardPoint(point) {
        return dispatch => {
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

    function formPointName(name) {
        return {
            type: FORM_POINT_NAME,
            name
        };
    }

    function showForm() {
        return {
            type: SHOW_FORM
        };
    }

    function hideForm() {
        return {
            type: HIDE_FORM
        };
    }

    function resetForm() {
        return {
            type: RESET_FORM
        };
    }

    function formMessage(message) {
        return {
            type: FORM_MESSAGE,
            message
        };
    }

    function setCurrentPosition(currentCoordinates) {
        const position = pointModel(assign(currentCoordinates, {
            name: 'current'
        }));
        return {
            type: SET_CURRENT_POSITION,
            position
        }
    }

    function watchCoordinates() {
        return dispatch => {
            geolocationProvider.watchCoordinates(coordinates => {
                dispatch(setCurrentPosition(coordinates));
            });
        };
    }

    function stopWatchingCoordinates() {
        geolocationProvider.stopWatchingCoordinates();
        return {
            type: UNSET_CURRENT_POSITION
        };
    }

    function getCoordinates() {
        return dispatch => {
            return geolocationProvider.getCoordinates();
        };
    }

    function pollOrientation() {
        return () => orientationProvider.startPolling();
    }

    function requestOrientation() {
        return {
            type: ALPHA_ROTATION,
            alphaRotation: orientationProvider.getHeading()
        };
    }

    function stopPollingOrientation() {
        orientationProvider.stopPolling();
        return {
            type: ALPHA_ROTATION,
            alphaRotation: null
        };
    }

    function requestUpdates() {
        return {
            type: SHOULD_BE_UPDATING
        };
    }

    function stopUpdates() {
        return {
            type: SHOULD_NOT_BE_UPDATING
        };
    }

    return {
        selectTab, tabTransitionEnded, windowResize,
        keepAwakeToggle,
        initPoints, addPoint, removePoint, choosePoint, disregardPoint,
        formPointName, showForm, hideForm, resetForm, formMessage,
        watchCoordinates, stopWatchingCoordinates, getCoordinates,
        pollOrientation, requestOrientation, stopPollingOrientation,
        requestUpdates, stopUpdates
    };
}
