import Promise from 'bluebird';

export default function browserGeolocationProvider(window, clock) {
    let watchId = null;

    function getCoordinates() {
        return new Promise((resolve, reject) => {
            window.navigator.geolocation.getCurrentPosition(
                position => {
                    resolve(pluck(position.coords));
                },
                err => {
                    reject(new Error('Could not get GPS data'));
                }, {
                    enableHighAccuracy: true
                }
            );
        });
    }

    function watchCoordinates(whenAvailable) {
        watchId = window.navigator.geolocation.watchPosition(
            position => {
                whenAvailable && whenAvailable(pluck(position.coords));
            },
            err => {
                console.error(err);
            }, {
                enableHighAccuracy: true
            }
        )
    }

    function stopWatchingCoordinates() {
        if(watchId !== null) {
            window.navigator.geolocation.clearWatch(watchId);
        }
    }

    function watchCoordinatesForSeconds(seconds) {
        if(watchId) return;
        watchId = watchCoordinates();
        clock.timeout(seconds * 1000, () => {
            stopWatchingCoordinates(watchId);
        });
    }

    function pluck({latitude, longitude, accuracy}) {
        accuracy = Math.round(accuracy);
        return {latitude, longitude, accuracy};
    }

    return {getCoordinates, watchCoordinates, watchCoordinatesForSeconds, stopWatchingCoordinates};
}

browserGeolocationProvider.isAvailable = function(window) {
    return typeof window.navigator.geolocation !== 'undefined';
};