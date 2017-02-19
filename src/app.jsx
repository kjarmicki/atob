import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import FastClick from 'fastclick';
import {EventEmitter} from 'events';
import Main from './views/main';

import rootReducer from './redux/reducers';
import storagePointRepository from './repository/storage-point-repository';
import browserGeolocationProvider from './infrastructure/geolocation/browser-geolocation-provider';
import orientationResolver from './infrastructure/orientation/orientation-resolver';
import browserClock from './infrastructure/time/browser-clock';
import cordovaPauseWatcher from './wrappers/cordova/pause-watcher';

import './assets/assets';

document.addEventListener('deviceready', () => {
    const clock = browserClock(window);
    const pointRepository = storagePointRepository(localStorage);
    const geolocationProvider = browserGeolocationProvider(window, clock);
    const orientationProvider = orientationResolver(window);
    const store = createStore(rootReducer);
    const pauseWatcher = cordovaPauseWatcher(window, clock, 1000 * 60 * 5);
    const events = new EventEmitter();
    const insomnia = (window.plugins && window.plugins.insomnia) || {
            keepAwake() {},
            allowSleepAgain() {}
        };

    // kick off the GPS for 10 seconds
    geolocationProvider.watchCoordinatesForSeconds(10);

    // be kind to a phone battery and kill the app if it's unused
    pauseWatcher.startWatching();

    FastClick.attach(document.body);

    ReactDOM.render(
        <Provider store={store}>
            <Main
                pointRepository={pointRepository}
                geolocationProvider={geolocationProvider}
                orientationProvider={orientationProvider}
                events={events}
                clock={clock}
                insomnia={insomnia}
            />
        </Provider>,
        document.querySelector('#main')
    );
});
