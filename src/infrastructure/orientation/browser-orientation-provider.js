'use strict';

export default function browserOrientationProvider(window) {
    const EVENT_NAME = 'deviceorientation';
    let alpha = null;

    function startPolling() {
        window.addEventListener(EVENT_NAME, update);
    }

    function stopPolling() {
        window.removeEventListener(EVENT_NAME, update);
    }

    function update(e) {
        alpha = e.alpha;
    }

    function getAlpha() {
        return alpha;
    }

    return {startPolling, stopPolling, getAlpha};
}

browserOrientationProvider.isAvailable = function(window) {
    return typeof window.ondeviceorientation !== 'undefined';
};
