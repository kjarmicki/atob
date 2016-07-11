'use strict';

import React from 'react';
import assign from 'object-assign';

export default class NavigationBox extends React.Component {
    constructor(props) {
        super(props);
        const win = props.window || window;
        const dimension = window.innerWidth;
        this.state = {
            width: dimension,
            height: dimension
        };
        this.specs = {
            backgroundColor: '#fff',
            lineColor: '#007aff',
            currentPositionColor: '#007aff'
        };
        this.ctx = null;
        this.renderer = null;

        win.addEventListener('resize', () => {
            const dimension = win.innerWidth;
            this.setState({
                width: dimension,
                height: dimension
            });
        });
    }
    componentDidUpdate() {
        this.renderer = this.props.canvasRenderer(this.ctx, assign({}, this.specs, this.state));
        this.renderer.clear();
        if(this.areBothPointsPresent()) {
            this.drawPathBetweenPoints();
        }
    }
    areBothPointsPresent() {
        return !!(this.props.navigatingToPoint && this.props.currentPositionPoint);
    }
    drawPathBetweenPoints() {
        const {width, height} = this.state;
        const halfWidth = width/2;
        const rotation = this.props.alphaRotation * -1;
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
                const currentClone = assign({}, currentPx);
                return measurements.rotatePointsMatrix([currentPx, navigatingPx], currentClone, rotation);
            })
            // scale px values to canvas width with some padding
            .map(pointsPx => {
                return measurements.scalePointsToQuadraticArea(pointsPx, width + 0.2 * width)
            })
            // round'em up
            .map(prescaledPx => {
                return measurements.transformPointsMatrix(prescaledPx,
                    (x, y) => Math.round(x),
                    (x, y) => Math.round(y)
                );
            })
            // transform the matrix so current position is at bottom center of canvas
            .map(([currentPrescaled, navigatingPrescaled]) => {
                const currentClone = assign({}, currentPrescaled);
                return measurements.transformPointsMatrix([currentPrescaled, navigatingPrescaled],
                    (x, y) => halfWidth + x - currentClone.x,
                    (x, y) => height - (height / 4) + y - currentClone.y
                );
            });

        this.renderer.drawPath(currentScaled, navigatingScaled);
    }
    render() {
        return(
            <div className="navigation-box">
                <canvas className="navigation-box-canvas"
                    ref={canvas => canvas && (this.ctx = canvas.getContext('2d')) }
                    width={this.state.width}
                    height={this.state.height}>
                </canvas>
            </div>
        );
    }
}