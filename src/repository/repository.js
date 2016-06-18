'use strict';

/*
 * Basic interface for repositories
 */

export default Object.freeze({
    store() {
        return notImplemented('store');
    },
    retrieve() {
        return notImplemented('retrieve');
    },
    retrieveAll() {
        return notImplemented('retrieveAll');
    }
});

function notImplemented(name) {
    return Promise.reject(new Error(`${name} method should be overridden`));
}