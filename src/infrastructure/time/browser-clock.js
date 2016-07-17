'use strict';

export default function browserClock(window) {
    function timeout(ms, callback) {
        return window.setTimeout(callback, ms);
    }
    function clearTimeout(id) {
        return window.clearTimeout(id);
    }
    return {timeout, clearTimeout};
}