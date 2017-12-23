import React from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import autobind from '../../util/autobind';
import Point from './point'
import PointForm from './point-form'
import * as actions from '../../redux/actions'

class PointsPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    render() {
        let points;
        if(this.props.points.list.length > 0) {
            points = this.props.points.list.map(point => {
                return (
                    <Point
                        key={point.uniqueKey()}
                        model={point}
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
                <PointForm />
            </div>
        )
    }
}

export default connect(state => ({
    points: state.points
}))(PointsPage);
