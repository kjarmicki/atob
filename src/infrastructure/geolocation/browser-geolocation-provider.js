'use strict';

export default function browserGeolocationProvider(window) {
    function getCoordinates() {
        return new Promise((resolve, reject) => {
            window.navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    resolve({latitude, longitude});
                },
                reject, {
                    enableHighAccuracy: true
                }
            );
        });
    }

    return {getCoordinates};
}

browserGeolocationProvider.isAvailable = function(window) {
    return typeof window.navigator.geolocation !== 'undefined';
};