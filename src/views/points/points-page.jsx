'use strict';

import React from 'react';
import Point from './point'
import PointForm from './point-form'

export default class PointsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points: []
        };

        this.props.events.on('point.add', () => this.updatePoints());
        this.props.events.on('point.remove', () => this.updatePoints());
    }
    componentDidMount() {
        this.updatePoints();
    }
    updatePoints() {
        this.props.pointRepository.retrieveAll()
            .then(points => this.setState({points}));
    }
    render() {
        const points = this.state.points.map(point => {
            return (
                <Point
                    key={point.getCreatedAt()}
                    model={point}
                    pointRepository={this.props.pointRepository}
                    events={this.props.events}
                />
            )
        });
        return(
            <div class="points-page">
                <h2>stored points</h2>
                <ul>
                    {points}
                </ul>
                <PointForm
                    pointRepository={this.props.pointRepository}
                    geolocationProvider={this.props.geolocationProvider}
                    events={this.props.events}
                />
            </div>
        )
    }
}
