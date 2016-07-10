'use strict';

import React from 'react';
import assign from 'object-assign';
import pointModel from '../../model/point';

export default class PointForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            message: '',
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
        const breaking = new Error('breaking error');

        return this.validatePoint({name})
            .catch(err => {
                this.setState({
                    message: err.message
                });
                this.input.focus();
                return Promise.reject(breaking);
            })
            .then(() => this.props.geolocationProvider.getCoordinates())
            .catch(err => {
                if(err !== breaking) {
                    this.setState({
                        message: 'Could not get GPS data'
                    });
                }
                return Promise.reject(breaking);
            })
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
                if(err !== breaking) {
                    this.setState({
                        message: 'Could not create a new point'
                    });
                }
            });
    }

    storePoint(name, coordinates) {
        const point = pointModel(assign({}, coordinates, {
            name: name
        }));
        return this.props.pointRepository.store(point);
    }

    validatePoint({name}) {
        // does a point have a valid name?
        return new Promise((resolve, reject) => {
            try {
                pointModel.validate({name});
                resolve();
            }
            catch(err) {
                reject(err);
            }
        })
        // does a point have a unique name?
        .then(() => this.props.pointRepository.retrieveAll())
        .then(points => {
            if(!points.every(point => point.serialize().name !== name)) {
                return Promise.reject(new Error('Point with such name already exists'));
            }
            return Promise.resolve();
        });
    }

    render() {
        const pointFormWrapperClassNames = ['point-form-wrapper',
            this.state.formVisible ? 'point-form-visible' : ''
        ].join(' ');
        const pointFormClassNames = ['point-form',
            this.state.message ? 'message-visible' : ''
        ].join(' ');
        return(
            <div className={pointFormWrapperClassNames}>
                <button className="btn point-form-trigger" onClick={this.showForm.bind(this)}>Add a new point at current location</button>
                <div className="point-form-overlay">
                    <form className={pointFormClassNames} onSubmit={this.submitPoint.bind(this)}>
                        <div className="point-form-inputs">
                            <input ref={input => input && (this.input = input)} type="text" onChange={this.updateName.bind(this)} value={this.state.name} name="name" className="new-point-name" placeholder="enter a point name" />
                            <input className="btn" type="submit" value="save" />
                            <button className="btn point-form-cancel" onClick={this.hideForm.bind(this)}>cancel</button>
                        </div>
                        <div className="point-form-message">{this.state.message}</div>
                    </form>
                </div>
            </div>
        )
    }
}
