'use strict';

import React from 'react';
import assign from 'object-assign';
import pointModel from '../../model/point';

export default class PointForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            formVisible: false
        };
        this.input = null;
    }

    updateName(e) {
        this.setState({
            name: e.target.value
        });
    }

    showForm(e) {
        e && e.preventDefault();
        this.setState({
            formVisible: true
        });
        this.input.focus();
    }

    hideForm(e) {
        e && e.preventDefault();
        this.setState({
            formVisible: false
        });
    }

    submitPoint(e) {
        e.preventDefault();
        const name = this.state.name.trim();

        return this.props.geolocationProvider.getCoordinates()
            .then(coordinates => this.storePoint(name, coordinates))
            .then(() => {
                this.setState({
                    name: ''
                });
                this.props.events.emit('point.add');
                this.hideForm();
                return null;
            })
            .catch(err => {
                console.error(err);
            });
    }

    storePoint(name, coordinates) {
        const point = pointModel(assign({}, coordinates, {
            name: name
        }));
        return this.props.pointRepository.store(point);
    }

    render() {
        const pointFormWrapperClassNames = ['point-form-wrapper',
            this.state.formVisible ? 'point-form-visible' : ''
        ].join(' ');
        return(
            <div className={pointFormWrapperClassNames}>
                <button className="btn point-form-trigger" onClick={this.showForm.bind(this)}>Add a new point at current location</button>
                <div className="point-form-overlay">
                    <form className="point-form" onSubmit={this.submitPoint.bind(this)}>
                        <input ref={input => input && (this.input = input)} type="text" onChange={this.updateName.bind(this)} value={this.state.name} name="name" className="new-point-name" placeholder="enter a point name" />
                        <input className="btn" type="submit" value="save" />
                        <button className="btn point-form-cancel" onClick={this.hideForm.bind(this)}>cancel</button>
                    </form>
                </div>
            </div>
        )
    }
}
