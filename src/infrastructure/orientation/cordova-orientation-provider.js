export default function cordovaOrientationProvider(window) {
    let heading = 0;
    let watchId = null;

    function startPolling() {
        if(watchId !== null) return;
        watchId = window.navigator.compass.watchHeading(
            update,
            e => alert(e),
            {
                frequency: 1000 / 60 // aim for 60fps
            }
        )
    }

    function stopPolling() {
        window.navigator.compass.clearWatch(watchId);
        watchId = null;
    }

    function update(e) {
        heading = e.magneticHeading;
    }

    function getHeading() {
        return heading;
    }

    return {startPolling, stopPolling, getHeading};

}

cordovaOrientationProvider.isAvailable = function(window) {
    return typeof window.navigator.compass !== 'undefined';
};