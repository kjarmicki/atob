'use strict';

import Promise from 'bluebird';

export default function browserGeolocationProvider(window) {
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
        if(watchId) throw new Error('geolocation is already being watched');
        watchId = window.navigator.geolocation.watchPosition(
            position => {
                whenAvailable(pluck(position.coords));
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

    function pluck({latitude, longitude, accuracy}) {
        accuracy = Math.round(accuracy);
        return {latitude, longitude, accuracy};
    }

    return {getCoordinates, watchCoordinates, stopWatchingCoordinates};
}

browserGeolocationProvider.isAvailable = function(window) {
    return typeof window.navigator.geolocation !== 'undefined';
};