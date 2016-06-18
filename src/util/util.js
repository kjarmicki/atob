'use strict';

export function inherit(...objects) {
    return Object.freeze(Object.assign({}, ...objects));
}