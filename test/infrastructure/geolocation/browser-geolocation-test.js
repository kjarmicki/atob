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

tape('browser geolocation provider should be able to provide location', t => {
    // given
    const window = {
        navigator: { geolocation: { getCurrentPosition(success, error) {
            setTimeout(() => { success({
                coords: { latitude: 1, longitude: 2, accuracy: 3 }
            }); }, 50);
        } } }
    };

    // when
    const bgp = browserGeolocationProvider(window);
    bgp.getCoordinates()

    // then
        .then(coordinates => {
            t.deepEqual(coordinates, { latitude: 1, longitude: 2, accuracy: 3 });
            t.end();
        });
});

tape('polled promise function should return correct results', t => {
    // given
    let latitude, longitude, accuracy;
    latitude = longitude = accuracy = 0;

    const window = {
        navigator: { geolocation: {
            _id: null,
            watchPosition(success, error) {
                this._id = setTimeout(() => { success({
                    coords: { latitude: latitude++, longitude: longitude++, accuracy: accuracy++ }
                }); this.watchPosition(success, error) }, 40);
            },
            clearWatch() {
                clearTimeout(this._id);
            }
        } }
    };

    // when
    let result = null;
    const bgp = browserGeolocationProvider(window);
    bgp.watchCoordinates(coordinates => {
        result = coordinates;
    });

    // then
    setTimeout(() => {
        t.equal(result, null, 'result not obtained yet');
    }, 20);

    setTimeout(() => {
        t.deepEqual(result, {latitude: 0, longitude: 0, accuracy: 0}, 'result obtained for the first time');
    }, 60);

    setTimeout(() => {
        t.deepEqual(result, {latitude: 1, longitude: 1, accuracy: 1}, 'result obtained for the second time');
        bgp.stopWatchingCoordinates();
        t.end();
    }, 100);
});
