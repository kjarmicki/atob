'use strict';

import React from 'react';
import NavigationBox from './navigation-box';
import pointModel from '../../model/point';
import canvasRenderer from '../../rendering/canvas';
import measurements from '../../measurements/measurements';

export default class NavigationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigatingToPoint: null,
            currentPositionPoint: null,
            // stateful component
            watchCoordinates: this.props.geolocationProvider.watchCoordinates,
            stopWatchingCoordinates: this.props.geolocationProvider.stopWatchingCoordinates,
            shouldBeUpdating: false
        };

        this.props.pointRepository.retrieveChosen()
            .then(chosenPoint => {
                if(chosenPoint) {
                    this.startNavigatingTo(chosenPoint);
                }
            });

        this.props.events.on('point.choose', chosenPoint => this.startNavigatingTo(chosenPoint));
        this.props.events.on('point.disregard', () => this.stopNavigating());
        this.props.events.on('point.remove', point => {
            if(point.isChosenForNavigation()) this.stopNavigating();
        });
    }

    startNavigatingTo(destinationPoint) {
        if(!this.state.shouldBeUpdating) {
            this.setState({shouldBeUpdating: true});
            this.state.watchCoordinates(currentCoordinates => {
                const currentPoint = pointModel(Object.assign(currentCoordinates, {
                    name: 'current'
                }));
                this.setState({
                    currentPositionPoint: currentPoint
                });
            });
        }
        this.setState({
            navigatingToPoint: destinationPoint
        });
    }

    stopNavigating() {
        this.state.stopWatchingCoordinates();
        this.setState({
            navigatingToPoint: null,
            currentPositionPoint: null,
            shouldBeUpdating: false
        });
    }

    render() {
        const distance = (this.state.navigatingToPoint && this.state.currentPositionPoint) ?
            <span>distance: {this.state.currentPositionPoint.distanceFrom(this.state.navigatingToPoint)} meters</span> :
            <span>not navigating currently</span>;

        return(
            <div className="navigation-page">
                <NavigationBox
                    measurements={measurements}
                    canvasRenderer={canvasRenderer}
                    navigatingToPoint={this.state.navigatingToPoint}
                    currentPositionPoint={this.state.currentPositionPoint}
                />
                {distance}
            </div>
        );
    }
}