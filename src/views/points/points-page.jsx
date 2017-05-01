import React from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import autobind from '../../util/autobind';
import Point from './point'
import PointForm from './point-form'

class PointsPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    render() {
        let points;
        if(this.props.points.length > 0) {
            points = this.props.points.map(point => {
                return (
                    <Point
                        actions={this.props.actions}
                        key={point.uniqueKey()}
                        model={point}
                        events={this.props.events}
                        />
                )
            });
        }
        else {
            points = <div className="cell no-navigation-points-available">There are no navigation points available</div>;
        }
        return(
            <div className="points-page">
                <ul className="points-list">
                    {points}
                </ul>
                <PointForm
                    pointRepository={null}
                    geolocationProvider={this.props.geolocationProvider}
                    events={this.props.events}
                />
            </div>
        )
    }
}

export default connect(state => ({
    points: state.points
}))(PointsPage);
