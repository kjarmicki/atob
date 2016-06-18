'use strict';

import {inherit} from '../util/util';
import repository from './repository';
import pointModel from '../model/point';

/*
 * Point models repository using Storage-compliant object
 */

export default function storagePointRepository(storage) {
    const namespace = `point-storage`;

    function store(point) {
        const key = `${namespace}-${point.getLatitude()}|${point.getLongitude()}`;
        const value = JSON.stringify(point.serialize());

        try {
            storage.setItem(key, value);
            return Promise.resolve();
        } catch(e) {
            return Promise.reject(e);
        }
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

    return inherit(repository, {store, retrieveAll});
}