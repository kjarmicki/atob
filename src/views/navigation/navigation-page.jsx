import React from 'react';
import assign from 'object-assign';
import raf from 'raf';
import autobind from '../../util/autobind';
import NavigationBox from './navigation-box';
import pointModel from '../../model/point';
import canvasRenderer from '../../rendering/canvas';
import measurements from '../../measurements/measurements';

export default class NavigationPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            navigatingToPoint: null,
            currentPositionPoint: null,
            alphaRotation: 0,
            shouldBeUpdating: false,
            watchId: null,
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
            const watchId = this.state.geolocationProvider.watchCoordinates(currentCoordinates => {
                const currentPoint = pointModel(assign(currentCoordinates, {
                    name: 'current'
                }));
                this.setTemporaryState({
                    currentPositionPoint: currentPoint
                });
            });
            this.setState({
                shouldBeUpdating: true,
                watchId: watchId
            });
            this.state.orientationProvider.startPolling();
            this.updateLoop();
        }
        this.setState({
            navigatingToPoint: destinationPoint
        });
    }

    stopNavigating() {
        this.state.geolocationProvider.stopWatchingCoordinates(this.state.watchId);
        this.state.orientationProvider.stopPolling();
        this.setState({
            navigatingToPoint: null,
            currentPositionPoint: null,
            alphaRotation: 0,
            shouldBeUpdating: false,
            watchId: null
        });
    }

    pointDisregard(e) {
        e && e.preventDefault();
        this.props.events.emit('point.disregard', this.state.navigatingToPoint);
    }

    updateLoop() {
        let loop;
        raf(loop = () => {
            if(this.state.shouldBeUpdating) {
                const alphaRotation = this.state.orientationProvider.getHeading();
                this.setState(assign({}, this.temporaryState, {alphaRotation}));
                raf(loop);
            }
        });
    }

    setTemporaryState(newState) {
        assign(this.temporaryState, newState);
    }

    render() {
        const hud = (this.state.navigatingToPoint && this.state.currentPositionPoint) ?
                <div className="navigation-hud">
                    <div className="cell">
                        <strong>{this.state.navigatingToPoint.getName()}</strong> distance: {this.state.currentPositionPoint.distanceFrom(this.state.navigatingToPoint)} meters
                    </div>
                    <div className="cell">GPS accuracy: {this.state.currentPositionPoint.getAccuracy()} meters</div>
                    <button className="btn btn-standalone navigation-point-disregard" onClick={this.pointDisregard}>Stop navigating</button>
                </div> :
            this.state.shouldBeUpdating ?
                <div className="cell navigation-hud">Waiting for the GPS...</div> :
                <div className="cell navigation-hud">Not navigating currently</div>;

        return(
            <div className="navigation-page">
                <NavigationBox
                    measurements={measurements}
                    canvasRenderer={canvasRenderer}
                    alphaRotation={this.state.alphaRotation}
                    navigatingToPoint={this.state.navigatingToPoint}
                    currentPositionPoint={this.state.currentPositionPoint}
                />
                {hud}
            </div>
        );
    }
}