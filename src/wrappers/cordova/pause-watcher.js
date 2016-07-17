'use strict';

export default function(window, clock, waitTime) {
    let timeoutId = null;

    function onPause() {
        timeoutId = clock.timeout(waitTime, () => {
            // time is up, bye
            window.navigator.app.exitApp();
        });
    }

    function onResume() {
        clock.clearTimeout(timeoutId);
    }

    function startWatching() {
        window.document.addEventListener('pause', onPause);
        window.document.addEventListener('resume', onResume);
    }

    return {startWatching};
}