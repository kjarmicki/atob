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
            backgroundColor: '#F3FFE2',
            lineColor: '#000000'
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
        const pointA = this.props.measurements.coordsToPx(
            this.props.currentPositionPoint.serialize(), {width, height});
        const pointB = this.props.measurements.coordsToPx(
            this.props.navigatingToPoint.serialize(), {width, height});

        this.renderer.drawPath(pointA, pointB);
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