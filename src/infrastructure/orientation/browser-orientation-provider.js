export default function browserOrientationProvider(window) {
    const EVENT_NAME = 'deviceorientation';
    let alpha = 0;

    function startPolling() {
        window.addEventListener(EVENT_NAME, update);
    }

    function stopPolling() {
        window.removeEventListener(EVENT_NAME, update);
    }

    function update(e) {
        alpha = (typeof e.alpha === 'number') ? e.alpha * -1 : alpha;
    }

    function getHeading() {
        return alpha;
    }

    return {startPolling, stopPolling, getHeading};
}

browserOrientationProvider.isAvailable = function(window) {
    return typeof window.ondeviceorientation !== 'undefined';
};
