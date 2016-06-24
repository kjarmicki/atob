'use strict';

import React from 'react';
import PointsPage from './points/points-page'

export default class Main extends React.Component {
    render() {
        return (
            <div className="main-view">
                <h1>A to B</h1>
                <PointsPage pointRepository={this.props.pointRepository} />
            </div>
        )
    }
}