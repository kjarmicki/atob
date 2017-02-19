import React from 'react';
import assign from 'object-assign';
import Promise from 'bluebird';
import autobind from '../../util/autobind';
import pointModel from '../../model/point';

export default class PointForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            name: '',
            message: '',
            watchId: null,
            formVisible: false
        };
        this.input = null;
        this.overlay = null;
    }

    componentDidMount() {
        this.overlay.style.height = window.innerHeight + 'px';
    }

    updateName(e) {
        this.setState({
            name: e.target.value
        });
    }

    showForm(e) {
        e && e.preventDefault();
        this.input.focus();
        this.setState({
            formVisible: true,
            // kick off gps update cycle
            watchId: this.props.geolocationProvider.watchCoordinates()
        });
    }

    hideForm(e) {
        e && e.preventDefault();
        this.props.geolocationProvider.stopWatchingCoordinates(this.state.watchId);
        this.setState({
            formVisible: false,
            watchId: null
        });
    }

    cancel(e) {
        e && e.preventDefault();
        this.setState({
            name: '',
            message: '',
        });
        this.hideForm();
    }

    submitPoint(e) {
        e.preventDefault();
        const name = this.state.name.trim();

        return this.validatePoint({name})
            .then(() => {
                this.setState({
                    message: 'Waiting for the GPS...'
                });
            })
            .then(() => this.props.geolocationProvider.getCoordinates())
            .then(coordinates => this.storePoint(name, coordinates))
            .then(() => {
                this.setState({
                    name: '',
                    message: ''
                });
                this.props.events.emit('point.add');
                this.hideForm();
            })
            .catch(err => {
                this.setState({
                    message: err.message
                });
                this.input.focus();
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
            pointModel.validate({name});
            resolve();
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
                <button className="btn btn-standalone point-form-trigger" onClick={this.showForm}>Add a new point at current location</button>
                <div ref={overlay => overlay && (this.overlay = overlay)} className="point-form-overlay">
                    <form autoComplete="off" className={pointFormClassNames} onSubmit={this.submitPoint}>
                        <div className="point-form-inputs">
                            <input ref={input => input && (this.input = input)} type="text"
                                   onChange={this.updateName} value={this.state.name}
                                   name="name" className="new-point-name" placeholder="enter a point name"
                                />
                            <input className="btn" type="submit" value="save" />
                            <button className="btn point-form-cancel" onClick={this.cancel}>cancel</button>
                        </div>
                        <div className="point-form-message">{this.state.message}</div>
                    </form>
                </div>
            </div>
        )
    }
}
