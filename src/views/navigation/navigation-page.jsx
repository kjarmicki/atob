import React from 'react';
import { connect } from 'react-redux';
import raf from 'raf';
import autobind from '../../util/autobind';
import NavigationBox from './navigation-box';

class NavigationPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    componentWillReceiveProps(props) {
        if(props.navigation.shouldBeUpdating) {
            this.updateLoop();
        }
    }

    pointDisregard(e) {
        e && e.preventDefault();
        this.props.dispatch(this.props.actions.disregardPoint(this.props.points.navigatingTo));
    }

    updateLoop() {
        raf(() => {
            if(this.props.navigation.shouldBeUpdating) {
                this.props.dispatch(this.props.actions.requestOrientation());
            }
        });
    }

    render() {
        const hud = (this.props.points.navigatingTo && this.props.points.position) ?
                <div className="navigation-hud">
                    <div className="cell">
                        <strong>{this.props.points.navigatingTo.getName()}</strong> distance:
                        {this.props.points.position.distanceFrom(this.props.points.navigatingTo)} meters
                    </div>
                    <div className="cell">GPS accuracy: {this.props.points.position.getAccuracy()} meters</div>
                    <button className="btn btn-standalone navigation-point-disregard" onClick={this.pointDisregard}>Stop navigating</button>
                </div> :
            this.props.navigation.shouldBeUpdating ?
                <div className="cell navigation-hud">Waiting for the GPS...</div> :
                <div className="cell navigation-hud">Not navigating currently</div>;

        return(
            <div className="navigation-page">
                <NavigationBox actions={this.props.actions} />
                {hud}
            </div>
        );
    }
}

export default connect(state => ({
    points: state.points,
    navigation: state.navigation
}))(NavigationPage);
