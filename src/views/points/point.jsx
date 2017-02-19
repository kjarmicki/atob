import React from 'react';
import moment from 'moment';
import autobind from '../../util/autobind';

export default class Point extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
    }
    remove() {
        window.confirm(`Are you sure you want to remove point ${this.props.model.getName()}?`)
        && this.props.events.emit('point.remove', this.props.model);
    }
    choose() {
        this.props.events.emit('point.choose', this.props.model);
    }
    disregard() {
        this.props.events.emit('point.disregard', this.props.model);
    }
    render() {
        const p = this.props.model.serialize();
        const navigationAction = p.chosenForNavigation ?
            this.disregard :
            this.choose;
        const createdAt = moment(p.createdAt);
        const navigation = p.chosenForNavigation ?
            <button onClick={navigationAction}>stop navigating</button> :
            <button onClick={navigationAction}>navigate</button>;
        const itemClassName = ['point',
            p.chosenForNavigation ? 'chosen-for-navigation' : ''
        ].join(' ');

        return (
            <li className={itemClassName}>
                <div className="cell">
                    <h3 onClick={navigationAction}>{p.name}</h3>
                    <p className="point-controls">
                        {navigation}
                        <button className="control-remove" onClick={this.remove}>remove</button>
                    </p>
                </div>
                <div className="point-details">
                    <p className="point-detail">Accuracy: {p.accuracy} meters</p>
                    <p className="point-detail">Created at: {createdAt.format('DD.MM.YYYY, HH:mm')}</p>
                </div>
            </li>
        )
    }
}
