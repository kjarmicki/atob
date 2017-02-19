import tape from 'tape'
import mockEventedDomElement from '../../mocks/evented-dom-element';
import browserOrientationProvider from '../../../src/infrastructure/orientation/browser-orientation-provider';

tape('browser orientation provider should correctly report availability', t => {
    // when
    const window = {
        ondeviceorientation: null
    };

    // then
    t.true(browserOrientationProvider.isAvailable(window));
    t.end();
});

tape('browser orientation provider should correctly report unavailability', t => {
    // when
    const window = {};

    // then
    t.false(browserOrientationProvider.isAvailable(window));
    t.end();
});

tape('browser orientation provider should be able to poll current orientation', t => {
    // given
    const window = mockEventedDomElement();
    const bop = browserOrientationProvider(window);

    // when
    bop.startPolling();
    window.dispatchEvent({
        type: 'deviceorientation',
        alpha: 2
    });

    // then
    t.equal(bop.getHeading(), -2);
    bop.stopPolling();
    t.end();
});