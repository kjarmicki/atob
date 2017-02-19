import tape from 'tape';
import cordovaOrientationProvider from '../../../src/infrastructure/orientation/cordova-orientation-provider';


tape('cordova orientation provider should correctly report availability', t => {
    // when
    const window = {
        navigator: {
            compass: {}
        }
    };

    // then
    t.true(cordovaOrientationProvider.isAvailable(window));
    t.end();
});

tape('cordova orientation provider should correctly report unavailability', t => {
    // when
    const window = {
        navigator: {}
    };

    // then
    t.false(cordovaOrientationProvider.isAvailable(window));
    t.end();
});

tape('cordova orientation provider should be able to poll current orientation', t => {
    // given
    const window = {
        navigator: {
            compass: {
                watchHeading: function(success, error) {
                    setTimeout(() => {
                        success({
                            magneticHeading: 10
                        })
                    }, 10);
                },
                clearWatch: function() {

                }
            }
        }
    };
    const cop = cordovaOrientationProvider(window);

    // when
    cop.startPolling();

    // then
    setTimeout(() => {
        t.equal(cop.getHeading(), 10);
        cop.stopPolling();
        t.end();
    }, 20);
});
