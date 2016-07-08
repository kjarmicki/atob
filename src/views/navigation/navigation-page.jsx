'use strict';

import React from 'react';
import NavigationBox from './navigation-box';
import pointModel from '../../model/point';
import canvasRenderer from '../../rendering/canvas';
import measurements from '../../measurements/measurements';

const LOOP_INTERVAL = 1000;
export default class NavigationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigatingToPoint: null,
            currentPositionPoint: null,
            alphaRotation: 0,
            shouldBeUpdating: false,
            // stateful components
            geolocationProvider: this.props.geolocationProvider,
            orientationProvider: this.props.orientationProvider
        };
        this.temporaryState = {
            currentPositionPoint: null
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
            this.state.geolocationProvider.watchCoordinates(currentCoordinates => {
                const currentPoint = pointModel(Object.assign(currentCoordinates, {
                    name: 'current'
                }));
                this.setTemporaryState({
                    currentPositionPoint: currentPoint
                });
            });
            this.state.orientationProvider.startPolling();
            this.updateLoop();
        }
        this.setState({
            navigatingToPoint: destinationPoint
        });
    }

    stopNavigating() {
        this.state.geolocationProvider.stopWatchingCoordinates();
        this.state.orientationProvider.stopPolling();
        this.setState({
            navigatingToPoint: null,
            currentPositionPoint: null,
            alphaRotation: 0,
            shouldBeUpdating: false
        });
    }

    updateLoop() {
        setTimeout(() => {
            if(this.state.shouldBeUpdating) {
                const alpha = this.state.orientationProvider.getAlpha();
                this.setState(Object.assign({}, this.temporaryState, {alpha}));
                this.updateLoop();
            }
        }, LOOP_INTERVAL);
    }

    setTemporaryState(newState) {
        Object.assign(this.temporaryState, newState);
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