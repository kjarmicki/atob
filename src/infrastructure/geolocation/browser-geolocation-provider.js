'use strict';

export default function browserGeolocationProvider(window) {
    let timeout = null;
    let coordinates = {
        latitude: null,
        longitude: null
    };

    function poll(pollingInterval) {
        timeout = setTimeout(() => {
            window.navigator.geolocation.getCurrentPosition(successPoll, errorPoll);
            poll();
        }, pollingInterval);
    }

    function startPolling(pollingInterval) {
        if(timeout === null) poll();
    }

    function stopPolling() {
        clearTimeout(timeout);
        timeout = null;
    }

    function successPoll(position) {
        let latitude, longitude;
        coordinates = {latitude, longitude} = position.coords;
    }

    function errorPoll() {
        window.console && window.console.error('unable to get location info');
    }

    function getCoordinates() {
        return coordinates;
    }

    return {startPolling, stopPolling, getCoordinates};
}

browserGeolocationProvider.isAvailable = function(window) {
    return typeof window.navigator.geolocation !== 'undefined';
};