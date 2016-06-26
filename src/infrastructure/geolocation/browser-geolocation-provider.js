'use strict';

export default function browserGeolocationProvider(window) {
    let watchId = null;

    function getCoordinates() {
        return new Promise((resolve, reject) => {
            window.navigator.geolocation.getCurrentPosition(
                position => {
                    resolve(convertToLatLng(position.coords));
                },
                reject, {
                    enableHighAccuracy: true
                }
            );
        });
    }

    function watchCoordinates(whenAvailable) {
        if(watchId) throw new Error('geolocation is already being watched');
        watchId = window.navigator.geolocation.watchPosition(
            position => {
                whenAvailable(convertToLatLng(position.coords));
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
            watchId = null;
        }
    }

    function convertToLatLng({latitude, longitude}) {
        return {latitude, longitude};
    }

    return {getCoordinates, watchCoordinates, stopWatchingCoordinates};
}

browserGeolocationProvider.isAvailable = function(window) {
    return typeof window.navigator.geolocation !== 'undefined';
};