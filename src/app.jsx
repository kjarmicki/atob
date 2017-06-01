import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import FastClick from 'fastclick';
import {EventEmitter} from 'events';
import Main from './views/main';

import rootReducer from './redux/reducers';
import actionsCreator from './redux/actions';
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
    const pauseWatcher = cordovaPauseWatcher(window, clock, 1000 * 60 * 5);
    const events = new EventEmitter();
    const insomnia = (window.plugins && window.plugins.insomnia) || {
            keepAwake() {},
            allowSleepAgain() {}
        };
    const actions = actionsCreator(insomnia, pointRepository, geolocationProvider);
    const store = createStore(rootReducer, applyMiddleware(thunk));

    // kick off the GPS for 10 seconds
    geolocationProvider.watchCoordinatesForSeconds(10);

    // be kind to a phone battery and kill the app if it's unused
    pauseWatcher.startWatching();

    store.dispatch(actions.initPoints())
        .then(() => pointRepository.retrieveChosen())
        .then(chosenPoint => store.dispatch(actions.selectTab(chosenPoint ? 'navigation' : 'points')));

    FastClick.attach(document.body);

    ReactDOM.render(
        <Provider store={store}>
            <Main
                pointRepository={pointRepository}
                geolocationProvider={geolocationProvider}
                orientationProvider={orientationProvider}
                events={events}
                actions={actions}
                clock={clock}
            />
        </Provider>,
        document.querySelector('#main')
    );
});
