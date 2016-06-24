'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Main from './views/main';

import storagePointRepository from './repository/storage-point-repository'
import point from './model/point'

const pointRepository = storagePointRepository(localStorage);
if(localStorage.length === 0) {
    pointRepository.store(point({
        name: 'aaa',
        latitude: 1,
        longitude: 2,
        createdAt: 3
    }));
}

ReactDOM.render(
    <Main pointRepository={pointRepository} />,
    document.querySelector('#main')
);