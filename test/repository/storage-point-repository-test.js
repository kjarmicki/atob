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
        longitude: 2,
        createdAt: 0
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
        longitude: 2,
        createdAt: 0
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

tape('point repository should by default retrieve points ordered by creation date, descending', t => {
    setup();

    // given
    const pointRepository = storagePointRepository(storage);
    const point1 = pointModel({
        name: 'test item 1',
        latitude: 1,
        longitude: 2,
        createdAt: 0
    });

    const point2 = pointModel({
        name: 'test item 2',
        latitude: 1,
        longitude: 2,
        createdAt: 1
    });

    // when
    Promise.all([pointRepository.store(point1), pointRepository.store(point2)])
        .then(() => {
            return pointRepository.retrieveAll();
        })

    // then
        .then(([point1, point2]) => {
            t.equal(point1.getName(), 'test item 2');
            t.equal(point2.getName(), 'test item 1');
            t.end();
        });
});