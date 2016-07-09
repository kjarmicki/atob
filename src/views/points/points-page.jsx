'use strict';

import React from 'react';
import Promise from 'bluebird';
import Point from './point'
import PointForm from './point-form'

export default class PointsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points: []
        };

        this.props.events.on('point.add', () => this.updatePoints());
        this.props.events.on('point.remove', point => this.removePoint(point));
        this.props.events.on('point.choose', point => this.choosePoint(point));
        this.props.events.on('point.disregard', point => this.disregardPoint(point));
    }

    componentDidMount() {
        this.updatePoints();
    }

    updatePoints() {
        return this.props.pointRepository.retrieveAll()
            .then(points => this.setState({points}));
    }

    removePoint(point) {
        return this.props.pointRepository.remove(point)
            .then(() => this.updatePoints());
    }

    choosePoint(point) {
        const currentlyChosen = this.state.points.find(point => point.isChosenForNavigation());
        const operations = [];
        if(currentlyChosen) {
            const previous = currentlyChosen.disregardForNavigation();
            operations.push(this.props.pointRepository.store(previous));
        }
        const newlyChosen = point.chooseForNavigation();
        operations.push(this.props.pointRepository.store(newlyChosen));

        Promise.all(operations)
            .then(() => this.updatePoints())
            .catch(err => console.error(err));
    }

    disregardPoint(point) {
        const newlyDisregarded = point.disregardForNavigation();
        this.props.pointRepository.store(newlyDisregarded)
            .then(() => this.updatePoints());
    }

    render() {
        const points = this.state.points.map(point => {
            return (
                <Point
                    key={point.uniqueKey()}
                    model={point}
                    events={this.props.events}
                />
            )
        });
        return(
            <div className="points-page">
                <ul className="points-list">
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
