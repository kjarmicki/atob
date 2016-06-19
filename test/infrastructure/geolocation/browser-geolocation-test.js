'use strict';

import tape from 'tape';
import browserGeolocationProvider from '../../../src/infrastructure/geolocation/browser-geolocation-provider';

tape('browser geolocation provider should correctly report availability', t => {
    // when
    const window = {
        navigator: {
            geolocation: {}
        }
    };

    // then
    t.true(browserGeolocationProvider.isAvailable(window));
    t.end();
});

tape('browser geolocation provider should correctly report unavailability', t => {
    // when
    const window = {
        navigator: {}
    };

    // then
    t.false(browserGeolocationProvider.isAvailable(window));
    t.end();
});

tape('browser geolocation provider should be able to poll current location', t => {
    // given
    const window = {
        navigator: { geolocation: { getCurrentPosition(success, error) {
            setTimeout(() => { success({
                coords: { latitude: 1, longitude: 2 }
            }); }, 50);
        } } }
    };

    // when
    const bgp = browserGeolocationProvider(window);
    bgp.startPolling();

    // then
    setTimeout(() => {
        t.deepEqual({ latitude: 1, longitude: 2 }, bgp.getCoordinates());
        bgp.stopPolling();
        t.end();
    }, 250);
});