import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';
import Promise from 'bluebird';
import autobind from '../../util/autobind';
import pointModel from '../../model/point';
import * as actions from '../../redux/actions'

class PointForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.input = null;
        this.overlay = null;
    }

    componentDidMount() {
        this.overlay.style.height = window.innerHeight + 'px';
    }

    updateName(e) {
        this.props.dispatch(actions.formPointName(e.target.value));
    }

    showForm(e) {
        e && e.preventDefault();
        this.props.dispatch(actions.showForm());
        this.props.dispatch(actions.watchCoordinates());
        this.input.focus();
    }

    hideForm(e) {
        e && e.preventDefault();
        this.props.dispatch(actions.hideForm());
        this.props.dispatch(actions.stopWatchingCoordinates());
    }

    cancel(e) {
        e && e.preventDefault();
        this.props.dispatch(actions.resetForm());
        this.hideForm();
    }

    submitPoint(e) {
        e.preventDefault();
        const name = this.props.pointForm.name.trim();

        return Promise.resolve()
            .then(() => this.validatePoint({name}))
            .then(() => this.props.dispatch(actions.formMessage('Waiting for the GPS...')))
            .then(() => this.props.dispatch(actions.getCoordinates()))
            .then(coordinates => this.storePoint(name, coordinates))
            .then(() => {
                this.props.dispatch(actions.resetForm());
                this.hideForm();
            })
            .catch(err => {
                this.props.dispatch(actions.formMessage(err.message));
                this.input.focus();
            });
    }

    storePoint(name, coordinates) {
        const point = pointModel(assign({}, coordinates, {
            name: name
        }));
        return this.props.dispatch(actions.addPoint(point));
    }

    validatePoint({name}) {
        // does the point have a valid name?
        pointModel.validate({name});

        // does the point have a unique name?
        if(!this.props.points.list.every(point => point.serialize().name !== name)) {
            throw new Error('Point with such name already exists');
        }
    }

    render() {
        const pointFormWrapperClassNames = ['point-form-wrapper',
            this.props.pointForm.formVisible ? 'point-form-visible' : ''
        ].join(' ');
        const pointFormClassNames = ['point-form',
            this.props.pointForm.message ? 'message-visible' : ''
        ].join(' ');
        return(
            <div className={pointFormWrapperClassNames}>
                <button className="btn btn-standalone point-form-trigger" onClick={this.showForm}>Add a new point at current location</button>
                <div ref={overlay => overlay && (this.overlay = overlay)} className="point-form-overlay">
                    <form autoComplete="off" className={pointFormClassNames} onSubmit={this.submitPoint}>
                        <div className="point-form-inputs">
                            <input ref={input => input && (this.input = input)} type="text"
                                   onChange={this.updateName} value={this.props.pointForm.name}
                                   name="name" className="new-point-name" placeholder="enter a point name"
                                />
                            <input className="btn" type="submit" value="save" />
                            <button className="btn point-form-cancel" onClick={this.cancel}>cancel</button>
                        </div>
                        <div className="point-form-message">{this.props.pointForm.message}</div>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    pointForm: state.pointForm,
    points: state.points
}))(PointForm);
