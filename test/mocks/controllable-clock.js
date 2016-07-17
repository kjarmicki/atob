'use strict';

export default function controllableClock() {
    let timeouts = [];
    let id = 1;

    function timeout(ms, callback) {
        timeouts.push({
            ms: ms,
            callback: callback,
            id: id
        });
        return id++;
    }

    function clearTimeout(id) {
        const found = timeouts.filter(timeout => timeout.id === id)[0];
        if(found) {
            timeouts = timeouts.filter(iterated => iterated !== found);
        }
    }

    function tick(ms) {
        timeouts
            .map(timeout => { timeout.ms -= ms; return timeout})
            .filter(timeout => timeout.ms <= 0)
            .forEach(timeout => timeout.callback.call(null));

        timeouts = timeouts.filter(timeout => timeout.ms > 0);
    }

    return {timeout, clearTimeout, tick};
}