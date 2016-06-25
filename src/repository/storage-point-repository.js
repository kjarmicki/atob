'use strict';

import pointModel from '../model/point';

/*
 * Point models repository using Storage-compliant object
 */

export default function storagePointRepository(storage) {
    const namespace = `point-storage`;

    function store(point) {
        const key = uniqueKey(point);
        const value = JSON.stringify(point.serialize());
        try {
            storage.setItem(key, value);
            return Promise.resolve();
        } catch(e) {
            return Promise.reject(e);
        }
    }

    function remove(point) {
        const key = uniqueKey(point);
        try {
            storage.removeItem(key);
            return Promise.resolve();
        } catch(e) {
            return Promise.reject(e);
        }
    }

    function uniqueKey(point) {
        return `${namespace}-${point.uniqueKey()}`;
    }

    function retrieveAll() {
        try {
            const values = [];
            for(const key in storage) {
                if(storage.hasOwnProperty(key) && key.startsWith(namespace)) {
                    values.push(
                        pointModel(JSON.parse(storage.getItem(key)))
                    );
                }
            }
            return Promise.resolve(values);
        } catch(e) {
            return Promise.reject(e);
        }
    }

    function retrieveChosen() {
        return retrieveAll()
            .then(points => {
                return points.find(point => point.isChosenForNavigation());
            });
    }

    return {store, remove, retrieveAll, retrieveChosen};
}