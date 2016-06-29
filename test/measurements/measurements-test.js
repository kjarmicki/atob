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