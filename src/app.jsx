'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import {EventEmitter} from 'events';
import Main from './views/main';

import storagePointRepository from './repository/storage-point-repository';
import browserGeolocationProvider from './infrastructure/geolocation/browser-geolocation-provider';
import browserOrientationProvider from './infrastructure/orientation/browser-orientation-provider';

import './assets/assets';

document.addEventListener('deviceready', () => {
    const pointRepository = storagePointRepository(localStorage);
    const geolocationProvider = browserGeolocationProvider(window);
    const orientationProvider = browserOrientationProvider(window);
    const events = new EventEmitter();

    FastClick.attach(document.body);

    ReactDOM.render(
        <Main
            pointRepository={pointRepository}
            geolocationProvider={geolocationProvider}
            orientationProvider={orientationProvider}
            events={events}
            />,
        document.querySelector('#main')
    );
});
