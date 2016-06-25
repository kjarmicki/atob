'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {EventEmitter} from 'events';
import Main from './views/main';

import storagePointRepository from './repository/storage-point-repository';
import browserGeolocationProvider from './infrastructure/geolocation/browser-geolocation-provider';

const pointRepository = storagePointRepository(localStorage);
const geolocationProvider = browserGeolocationProvider(window);
const events = new EventEmitter();

ReactDOM.render(
    <Main
        pointRepository={pointRepository}
        geolocationProvider={geolocationProvider}
        events={events}
    />,
    document.querySelector('#main')
);