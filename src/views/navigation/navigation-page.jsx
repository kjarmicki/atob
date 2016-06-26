'use strict';

import React from 'react';
import NavigationBox from './navigation-box';
import pointModel from '../../model/point';

const POLL_INTERVAL = 500;
export default class NavigationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigatingToPoint: null,
            currentPositionPoint: null,
            polledGeolocation: this.props.polledGeolocation,
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
            this.state.polledGeolocation.start(POLL_INTERVAL);
            this.updateCycle(currentPont => {
                this.setState({
                    currentPositionPoint: currentPont
                })
            });
        }
        this.setState({
            navigatingToPoint: destinationPoint
        });
    }

    stopNavigating() {
        this.state.polledGeolocation.stop();
        this.setState({
            navigatingToPoint: null,
            currentPositionPoint: null,
            shouldBeUpdating: false
        });
    }

    updateCycle(whenAvailable) {
        var polled = this.state.polledGeolocation;
        setTimeout(() => {
            if(this.state.shouldBeUpdating) {
                const currentGeo = this.state.polledGeolocation.getResult();
                if (currentGeo !== null) {
                    whenAvailable(pointModel(Object.assign(currentGeo, {
                        name: 'current'
                    })));
                }
                this.updateCycle(whenAvailable);
            }
        }, POLL_INTERVAL * 2);
    }
    render() {
        const distance = (this.state.navigatingToPoint && this.state.currentPositionPoint) ?
            <span>distance: {this.state.currentPositionPoint.distanceFrom(this.state.navigatingToPoint)} meters</span> :
            <span>not navigating currently</span>

        return(
            <div className="navigation-page">
                <NavigationBox />
                {distance}
            </div>
        );
    }
}