'use strict';

import React from 'react';
import pointModel from '../../model/point';

export default class PointForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        };
    }
    updateName(e) {
        this.setState({
            name: e.target.value
        });
    }
    submitPoint(e) {
        e.preventDefault();
        const name = this.state.name.trim();

        this.props.geolocationProvider.getCoordinates()
            .then(coordinates => {
                this.storePoint(name, coordinates);
                this.setState({
                    name: ''
                });
            })
            .catch(err => {
                console.error(err);
            });
    }
    storePoint(name, coordinates) {
        const point = pointModel(Object.assign({}, coordinates, {
            name: name,
            createdAt: Date.now()
        }));
        this.props.pointRepository.store(point);
    }
    render() {
        return(
            <form className="point-form" onSubmit={this.submitPoint.bind(this)}>
                <h2>Add a point</h2>
                <label for="name">Name for a current point
                    <input type="text" id="name" onChange={this.updateName.bind(this)} value={this.state.name} name="name" placeholder="name" />
                </label>
                <input type="submit" value="save" />
            </form>
        )
    }
}
