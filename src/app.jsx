'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Main from './views/main';

import storagePointRepository from './repository/storage-point-repository';
import browserGeolocationProvider from './infrastructure/geolocation/browser-geolocation-provider';

const pointRepository = storagePointRepository(localStorage);
const geolocationProvider = browserGeolocationProvider(window);

ReactDOM.render(
    <Main
        pointRepository={pointRepository}
        geolocationProvider={geolocationProvider}
    />,
    document.querySelector('#main')
);