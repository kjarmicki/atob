import pointModel from '../model/point';

// UI
export const SELECT_TAB = 'SELECT_TAB';
export const TAB_TRANSITION_ENDED = 'TAB_TRANSITION_ENDED';

// screen sleep
export const KEEP_AWAKE = 'KEEP_AWAKE';
export const ALLOW_SLEEP = 'ALLOW_SLEEP';

// points management
export const INIT_POINTS = 'INIT_POINTS';
export const ADD_POINT = 'ADD_POINT';
export const REMOVE_POINT = 'REMOVE_POINT';
export const CHOOSE_POINT = 'CHOOSE_POINT';
export const DISREGARD_POINT = 'DISREGARD_POINT';

// new point form
export const FORM_POINT_NAME = 'FORM_POINT_NAME';
export const SHOW_FORM = 'SHOW_FORM';
export const HIDE_FORM = 'HIDE_FORM';
export const RESET_FORM = 'RESET_FORM';
export const FORM_MESSAGE = 'FORM_MESSAGE';

// geolocation


export default function(insomnia, pointRepository, geolocationProvider) {
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
            .then(points => dispatch({
                type: INIT_POINTS,
                points
            }));
    }

    function addPoint(point) {
        return dispatch => pointRepository.store(point)
            .then(() => pointRepository.retrieveAll())
            .then(points => dispatch({
                type: ADD_POINT,
                points
            }));
    }

    function removePoint(point) {
        return dispatch => {
            return pointRepository.remove(point)
                .then(() => pointRepository.retrieveAll())
                .then(points => dispatch({
                    type: REMOVE_POINT,
                    points
                }));
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
                .then(points => dispatch({
                    type: CHOOSE_POINT,
                    points
                }))
                .then(() => dispatch(selectTab('navigation')));
        }
    }

    function disregardPoint(point) {
        return dispatch => {
            dispatch(keepAwakeToggle(false));
            const newlyDisregarded = point.disregardForNavigation();
            return pointRepository.store(newlyDisregarded)
                .then(() => pointRepository.retrieveAll())
                .then(() => dispatch({
                    type: DISREGARD_POINT,
                    points
                }))
                .then(() => dispatch(selectTab('points')));
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

    function watchCoordinates() {
        return dispatch => {
            geolocationProvider.watchCoordinates();
        };
    }

    function stopWatchingCoordinates() {
        return dispatch => {
            geolocationProvider.stopWatchingCoordinates();
        };
    }

    function getCoordinates() {
        return dispatch => {
            return geolocationProvider.getCoordinates();
        };
    }



    return {
        selectTab, tabTransitionEnded,
        keepAwakeToggle,
        initPoints, addPoint, removePoint, choosePoint, disregardPoint,
        formPointName, showForm, hideForm, resetForm, formMessage,
        watchCoordinates, stopWatchingCoordinates, getCoordinates
    };
}
