'use strict';

import tape from 'tape';
import measurements from '../../src/measurements/measurements'

tape('measurements module should be able to convert latitude/langitude to pixels', t => {
    // given
    const coords = {
        latitude: 49.543621,
        longitude: 20.118354
    };
    const area = {
        width: 1000,
        height: 1000
    };

    // when
    const {x, y} = measurements.coordsToPx(coords, area);

    // then
    t.equals(Math.round(x), 556);
    t.equals(Math.round(y), 225);
    t.end();
});

tape('measurements module should be able to scale points to fit given area - in corner', t => {
    // given
    const points = [
        {
            x: 0, y: 0
        },
        {
            x: 4, y: 4
        }
    ];
    const area = {
        width: 100,
        height: 100
    };

    // when
    const scaledPoints = measurements.scalePointsToArea(points, area);

    // then
    t.deepEqual(scaledPoints, [
        {
            x: 0, y: 0
        },
        {
            x: 100, y: 100
        }
    ])
});

tape('measurements module should be able to scale points to fit given area - in center', t => {
    // given
    const points = [
        {
            x: 2, y: 2
        },
        {
            x: 4, y: 4
        }
    ];
    const area = {
        width: 100,
        height: 100
    };

    // when
    const scaledPoints = measurements.scalePointsToArea(points, area);

    // then
    t.deepEqual(scaledPoints, [
        {
            x: 0, y: 0
        },
        {
            x: 100, y: 100
        }
    ]);
});

