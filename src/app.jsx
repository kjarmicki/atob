import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import FastClick from 'fastclick';
import Main from './views/main';

import rootReducer from './redux/reducers';
import * as actions from './redux/actions';
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
    const insomnia = (window.plugins && window.plugins.insomnia) || {
            keepAwake() {},
            allowSleepAgain() {}
        };
    const dependencies = {insomnia, pointRepository, geolocationProvider, orientationProvider};
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk.withExtraArgument(dependencies))));

    // kick off the GPS for 10 seconds
    geolocationProvider.watchCoordinatesForSeconds(10);

    // be kind to a phone battery and kill the app if it's unused
    pauseWatcher.startWatching();

    FastClick.attach(document.body);

    actions.initPoints()(store.dispatch, store.getState, { pointRepository })
        .then(() => {
            ReactDOM.render(
                <Provider store={store}>
                    <Main
                        clock={clock}
                        />
                </Provider>,
                document.querySelector('#main'));
        });

});
