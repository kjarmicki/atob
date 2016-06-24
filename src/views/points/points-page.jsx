'use strict';

import React from 'react';
import Point from './point'

export default class PointsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points: []
        }
    }
    componentDidMount() {
        this.props.pointRepository.retrieveAll()
            .then(points => this.setState({points}));
    }
    render() {
        const points = this.state.points.map(point => {
            return (
                <Point key={point.getCreatedAt()} model={point} />
            )
        });
        return(
            <div class="points-page">
                <h2>stored points</h2>
                {points}
            </div>
        )
    }
}
