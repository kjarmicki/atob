'use strict';

/* cordova api mock for regular browsers */

window.addEventListener('load', () => {
    const deviceReady = new CustomEvent('deviceready');
    document.dispatchEvent(deviceReady);
});