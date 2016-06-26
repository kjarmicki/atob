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
            currentPositionPoint: null
        };
        this.shouldBeUpdating = false;

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
        if(!this.shouldBeUpdating) {
            this.shouldBeUpdating = true;
            this.props.polledGeolocation.start(POLL_INTERVAL);
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
        this.shouldBeUpdating = false;
        this.props.polledGeolocation.stop();
        this.setState({
            navigatingToPoint: null,
            currentPositionPoint: null
        });
    }

    updateCycle(whenAvailable) {
        setTimeout(() => {
            if(this.shouldBeUpdating) {
                const currentGeo = this.props.polledGeolocation.getResult();
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