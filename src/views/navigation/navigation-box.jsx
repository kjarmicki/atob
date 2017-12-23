import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';
import autobind from '../../util/autobind';
import canvasRenderer from '../../rendering/canvas';
import measurements from '../../measurements/measurements';
import * as actions from '../../redux/actions';

class NavigationBox extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.specs = {
            backgroundColor: '#fff',
            lineColor: '#007aff',
            currentPositionColor: '#007aff'
        };
        this.ctx = null;
        this.renderer = null;
    }

    componentDidMount() {
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    onResize() {
        this.props.dispatch(actions.windowResize(
            window.innerWidth, window.innerHeight
        ));
    }

    componentDidUpdate() {
        this.renderer = canvasRenderer(this.ctx, assign({}, this.specs, {
            width: this.props.window.width,
            height: this.props.window.width,
            current: this.props.points.position,
            navigating: this.props.points.navigatingTo
        }));
        this.renderer.clear();
        if(this.areBothPointsPresent()) {
            this.drawPathBetweenPoints();
        }
    }

    areBothPointsPresent() {
        return !!(this.props.points.navigatingTo && this.props.points.position);
    }

    drawPathBetweenPoints() {
        const width = this.props.window.width;
        const height = this.props.window.width;
        const halfWidth = width/2;
        const rotation = this.props.navigation.alphaRotation;

        const [[currentScaled, navigatingScaled]] =
            [[this.props.points.position, this.props.points.navigatingTo]]
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
                    width={this.props.window.width}
                    height={this.props.window.width}>
                </canvas>
            </div>
        );
    }
}

export default connect(state => ({
    window: state.window,
    navigation: state.navigation,
    points: state.points
}))(NavigationBox);
