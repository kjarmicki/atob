'use strict';

/* cordova api mock for regular browsers */

window.addEventListener('load', () => {
    const deviceReady = document.createEvent('CustomEvent');
    deviceReady.initEvent('deviceready', false, true);
    document.dispatchEvent(deviceReady);
});