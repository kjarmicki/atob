'use strict';

import React from 'react';

export default class NavigationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 320,
            height: 320
        };
        this.specs = {
            backgroundColor: '#f3ffe2',
            lineColor: '#0fb5c7',
            currentPositionColor: '#dbfdaa',
            navigatingPositionColor: '#b22400'
        };
        this.ctx = null;
        this.renderer = null;
    }
    componentDidUpdate() {
        if(!this.areBothPointsPresent()) {
            this.ctx = null;
            this.renderer = null;
            return;
        }
        this.renderer = this.props.canvasRenderer(this.ctx, Object.assign({}, this.specs, this.state));
        this.renderer.clear();
        this.drawPathBetweenPoints();

    }
    areBothPointsPresent() {
        return !!(this.props.navigatingToPoint && this.props.currentPositionPoint);
    }
    drawPathBetweenPoints() {
        const {width, height} = this.state;
        const halfWidth = width/2;
        const rotation = this.props.alphaRotation;
        const measurements = this.props.measurements;

        const [[currentScaled, navigatingScaled]] =
            [[this.props.currentPositionPoint, this.props.navigatingToPoint]]
            // convert lat and lng to px
            .map(points => {
                return points.map(point => {
                    return measurements.coordsToPx(point.serialize(), {width, height});
                });
            })
            // rotate points according to accelerometer
            .map(([currentPx, navigatingPx]) => {
                const currentClone = Object.assign({}, currentPx);
                return measurements.rotatePointsMatrix([currentPx, navigatingPx], currentClone, rotation);
            })
            // scale px values to canvas width
            .map(pointsPx => {
                return measurements.scalePointsToQuadraticArea(pointsPx, width);
            })
            // transform the matrix so current position is at bottom center of canvas
            .map(([currentPrescaled, navigatingPrescaled]) => {
                const currentClone = Object.assign({}, currentPrescaled);
                return measurements.transformPointsMatrix([currentPrescaled, navigatingPrescaled],
                    (x, y) => halfWidth + x - currentClone.x,
                    (x, y) => height - (height / 4) + y - currentClone.y
                );
            });

        this.renderer.drawPath(currentScaled, navigatingScaled);
    }
    render() {
        const content = this.areBothPointsPresent() ?
            <canvas className="navigation-box-canvas"
                    ref={canvas => canvas && (this.ctx = canvas.getContext('2d')) }
                    width={this.state.width}
                    height={this.state.height}>
            </canvas> :
            '';
        return(
            <div className="navigation-box">
                {content}
            </div>
        );
    }
}