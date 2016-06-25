'use strict';

import tape from 'tape';
import makeStorage from './../mocks/storage';
import storagePointRepository from '../../src/repository/storage-point-repository';
import pointModel from '../../src/model/point';

let storage;
function setup() {
    storage = makeStorage();
}

tape('point repository should be able to store a point', t => {
    setup();

    // given
    const pointRepository = storagePointRepository(storage);
    const point = pointModel({
        name: 'test item',
        latitude: 1,
        longitude: 2
    });

    // when
    pointRepository.store(point)
        .then(() => pointRepository.retrieveAll())

    // then
        .then(points => {
            t.true(points.length === 1, 'there is one stored point');
            t.true(points[0].equals(point), 'stored point is equal to given');
            t.end();
        });
});

tape('point repository should be able to remove a point', t => {
    setup();

    // given
    const pointRepository = storagePointRepository(storage);
    const point = pointModel({
        name: 'test item',
        latitude: 1,
        longitude: 2
    });
    pointRepository.store(point)

    // when
        .then(() => {
            return pointRepository.remove(point);
        })
        .then(() => {
            return pointRepository.retrieveAll();
        })

    // then
        .then(points => {
            t.true(points.length === 0, 'there are no stored points');
            t.end();
        });
});