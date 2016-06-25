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
        this.props.events.on('point.choose', point => this.choosePoint(point));
    }
    componentDidMount() {
        this.updatePoints();
    }
    updatePoints() {
        this.props.pointRepository.retrieveAll()
            .then(points => this.setState({points}));
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
    render() {
        const points = this.state.points.map(point => {
            return (
                <Point
                    key={point.uniqueKey()}
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
