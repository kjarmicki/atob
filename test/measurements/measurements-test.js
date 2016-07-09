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

tape('measurements module should be able to scale points to fit given quadratic area - more difference in y than x', t => {
    // given
    const points = [
        {
            x: 2, y: 2
        },
        {
            x: 2, y: 4
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
            x: 0, y: 10
        }
    ]);
    t.end();
});

tape('measurements module should be able to transform points martix', t => {
    // given
    const points = [
        {
            x: 2, y: 2
        },
        {
            x: 2, y: 4
        }
    ];

    // when
    const transformed = measurements.transformPointsMatrix(points,
        (x, y) => x + 2,
        (x, y) => y + 2
    );

    // then
    t.deepEqual(transformed, [
        {
            x: 4, y: 4
        },
        {
            x: 4, y: 6
        }
    ]);
    t.end();
});

tape('measurements module should be able to rotate points matrix', t => {
    // given
    const points = [
        {
            x: 5, y: 0
        }
    ];
    const origin = {
        x: 0, y: 0
    };
    const angle = 90;

    // when
    const [rotated] = measurements.rotatePointsMatrix(points, origin, angle);

    // then
    t.equal(Math.round(rotated.x), 0);
    t.equal(Math.round(rotated.y), -5);
    t.end();
});
