import tape from 'tape';
import controllableClock from '../../mocks/controllable-clock';
import eventedDomElement from '../../mocks/evented-dom-element';
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
    const clock = controllableClock();
    const window = {
        document: eventedDomElement(),
        navigator: {
            geolocation: {
                getCurrentPosition(success, error) {
                    clock.timeout(50, () => {
                        success({
                            coords: { latitude: 1, longitude: 2, accuracy: 3 }
                        });
                    });
                }
            }
        }
    };

    // when
    const bgp = browserGeolocationProvider(window);
    bgp.getCoordinates()

    // then
        .then(coordinates => {
            t.deepEqual(coordinates, { latitude: 1, longitude: 2, accuracy: 3 });
            t.end();
        });

    clock.tick(50);
});

tape('browser geolocation provider should be able to watch location', t => {
    // given
    const clock = controllableClock();
    let latitude, longitude, accuracy;
    latitude = longitude = accuracy = 0;

    const window = {
        document: eventedDomElement(),
        navigator: {
            geolocation: {
                watchPosition(success, error) {
                    clock.timeout(40, () => {
                        success({
                            coords: { latitude: latitude++, longitude: longitude++, accuracy: accuracy++ }
                        });
                        this.watchPosition(success, error)
                    });
                },
                clearWatch() {
                }
            }
        }
    };

    // when
    let result = null;
    const bgp = browserGeolocationProvider(window);
    bgp.watchCoordinates(coordinates => {
        result = coordinates;
    });

    // then
    clock.tick(20);
    t.equal(result, null, 'result not obtained yet');

    clock.tick(60);
    t.deepEqual(result, {latitude: 0, longitude: 0, accuracy: 0}, 'result obtained for the first time');

    clock.tick(100);
    t.deepEqual(result, {latitude: 1, longitude: 1, accuracy: 1}, 'result obtained for the second time');
    bgp.stopWatchingCoordinates();
    t.end();
});
