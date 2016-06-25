'use strict';

import React from 'react';
import NavigationBox from './navigation-box';
import pointModel from '../../model/point';
import {promise} from '../../wrapper/polling';

const POLL_INTERVAL = 150;
export default class NavigationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigatingToPoint: null,
            currentPositionPoint: null
        };

        const polledGeolocation = promise(this.props.geolocationProvider.getCoordinates);
        this.props.events.on('point.choose', point => {
            polledGeolocation.start(POLL_INTERVAL / 2);
            this.setState({
                navigatingToPoint: point
            });
            this.updateCycle(polledGeolocation);
        });
    }
    updateCycle(polledGeolocation) {
        setTimeout(() => {
            const currentGeo = polledGeolocation.getResult();
            if(currentGeo !== null) {
                this.setState({
                    currentPositionPoint: pointModel(Object.assign(currentGeo, {
                        name: 'current'
                    }))
                });
            }
            this.updateCycle(polledGeolocation);
        }, POLL_INTERVAL);
    }
    render() {
        const distance = (this.state.navigatingToPoint && this.state.currentPositionPoint) ?
            <span>{this.state.currentPositionPoint.distanceFrom(this.state.navigatingToPoint)}</span> :
            <span>not navigating currently</span>

        return(
            <div class="navigation-page">
                <NavigationBox />
                {distance}
            </div>
        );
    }
}