'use strict';

export function promise(underlyingFunc) {
    let running = false;
    let cachedResult = null;

    function start(interval) {
        if(!running) {
            running = true;
            poll(interval);
        }
    }

    function stop() {
        running = false;
        cachedResult = null;
    }

    function getResult() {
        return cachedResult;
    }

    function poll(interval) {
        const start = Date.now();
        if(running) {
            underlyingFunc()
                .then(result => cachedResult = result)
                .then(() => {
                    setTimeout(() => {
                        poll(interval);
                    }, Math.max(0, Date.now() - start - interval));
                });
        }
    }

    return {start, stop, getResult};
}