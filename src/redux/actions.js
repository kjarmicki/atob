// UI
export const SELECT_TAB = 'SELECT_TAB';
export const TAB_TRANSITION_ENDED = 'TAB_TRANSITION_ENDED';

// screen sleep
export const KEEP_AWAKE = 'KEEP_AWAKE';
export const ALLOW_SLEEP = 'ALLOW_SLEEP';

// points management
export const INIT_POINTS = 'INIT_POINTS';
export const REMOVE_POINT = 'REMOVE_POINT';
export const CHOOSE_POINT = 'CHOOSE_POINT';
export const DISREGARD_POINT = 'DISREGARD_POINT';

// new point form
export const FORM_POINT_NAME = 'FORM_POINT_NAME';


export default function(insomnia, pointRepository) {
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
        return dispatch => {
            if (flag) {
                insomnia.keepAwake();
                dispatch({
                    type: KEEP_AWAKE
                });
            } else {
                insomnia.allowSleepAgain();
                dispatch({
                    type: ALLOW_SLEEP
                });
            }
        }
    }

    function initPoints() {
        return dispatch => {
            return pointRepository.retrieveAll()
                .then(points => {
                    dispatch({
                        type: INIT_POINTS,
                        points
                    });
                });
        };
    }

    function removePoint(point) {
        return dispatch => {
            return pointRepository.remove(point)
                .then(() => dispatch({
                    type: REMOVE_POINT,
                    point
                }));
        };
    }

    function choosePoint(point) {
        return dispatch => {
            dispatch(keepAwakeToggle(true));
            const operations = [];
            const currentlyChosen = pointRepository.retrieveAll()
                .filter(point => point.isChosenForNavigation())[0];
            if (!currentlyChosen.equals(point)) {
                const previous = currentlyChosen.disregardForNavigation();
                operations.push(pointRepository.store(previous));
            }
            const newlyChosen = point.chooseForNavigation();
            operations.push(pointRepository.store(newlyChosen));

            return Promise.all(operations)
                .then(() => dispatch({
                    type: CHOOSE_POINT,
                    point
                }));
        }
    }

    function disregardPoint(point) {
        return dispatch => {
            dispatch(keepAwakeToggle(false));
            const newlyDisregarded = point.disregardForNavigation();
            return pointRepository.store(newlyDisregarded)
                .then(() => dispatch({
                    type: DISREGARD_POINT,
                    point
                }));
        };
    }

    function formPointName(name) {
        return {
            type: FORM_POINT_NAME,
            name
        };
    }

    return {
        selectTab, tabTransitionEnded,
        keepAwakeToggle,
        initPoints, removePoint, choosePoint, disregardPoint
    };
}
