'use strict';

import tape from 'tape';
import pointModel from '../../src/model/point';

tape('point model should correctly calculate distance between two points', t => {
    // given
    const pointA = pointModel({
        name: 'a',
        latitude: 49.596582,
        longitude: 20.075843,
        createdAt: 0
    });
    const pointB = pointModel({
        name: 'b',
        latitude: 49.597361,
        longitude: 20.074148,
        createdAt: 0
    });

    // when
    const distance = pointA.distanceFrom(pointB);

    // then
    t.equal(distance, 150);
    t.end();
});