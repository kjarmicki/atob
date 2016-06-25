'use strict';

import tape from 'tape';
import polling from '../../src/wrapper/polling';

tape('polled promise function should return correct results', t => {
    // given
    let value = 0;
    function toBePolled() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(value++);
            }, 150);
        });
    }

    // when
    const polled = polling.promise(toBePolled);
    polled.start(100);

    // then
    setTimeout(() => {
        t.equal(polled.getResult(), null, 'result not obtained yet');
    }, 50);

    setTimeout(() => {
        t.equal(polled.getResult(), 0, 'result obtained for the first time');
    }, 250);

    setTimeout(() => {
        t.equal(polled.getResult(), 1, 'result obtained for the second time');
        polled.stop();
        t.end();
    }, 450);

});