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

tape('measurements module should be able to scale points to fit given quadratic area - in corner', t => {
    // given
    const points = [
        {
            x: 0, y: 0
        },
        {
            x: 4, y: 4
        }
    ];
    const sideWidth = 10;

    // when
    const scaledPoints = measurements.scalePointsToQuadraticArea(points, sideWidth);

    // then
    t.deepEqual(scaledPoints, [
        {
            x: 0, y: 0
        },
        {
            x: 10, y: 10
        }
    ]);
    t.end();
});

tape('measurements module should be able to scale points to fit given quadratic area - in center', t => {
    // given
    const points = [
        {
            x: 2, y: 2
        },
        {
            x: 4, y: 4
        }
    ];
    const sideWidth = 10;

    // when
    const scaledPoints = measurements.scalePointsToQuadraticArea(points, sideWidth);

    // then
    t.deepEqual(scaledPoints, [
        {
            x: 0, y: 0
        },
        {
            x: 10, y: 10
        }
    ]);
    t.end();
});

tape('measurements module should be able to scale points to fit given quadratic area - offset', t => {
    // given
    const points = [
        {
            x: 2, y: 2
        },
        {
            x: 3, y: 2
        }
    ];
    const sideWidth = 10;

    // when
    const scaledPoints = measurements.scalePointsToQuadraticArea(points, sideWidth);

    // then
    t.deepEqual(scaledPoints, [
        {
            x: 0, y: 0
        },
        {
            x: 10, y: 0
        }
    ]);
    t.end();
});

tape('measurements module should be able to scale points to fit given quadratic area - same point', t => {
    // given
    const points = [
        {
            x: 2, y: 2
        },
        {
            x: 2, y: 2
        }
    ];
    const sideWidth = 10;

    // when
    const scaledPoints = measurements.scalePointsToQuadraticArea(points, sideWidth);

    // then
    t.deepEqual(scaledPoints, [
        {
            x: 0, y: 0
        },
        {
            x: 0, y: 0
        }
    ]);
    t.end();
});
