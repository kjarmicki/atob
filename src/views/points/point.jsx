'use strict';

import React from 'react';

export default class Point extends React.Component {
    remove() {
        this.props.events.emit('point.remove', this.props.model);
    }
    choose() {
        this.props.events.emit('point.choose', this.props.model);
    }
    disregard() {
        this.props.events.emit('point.disregard', this.props.model);
    }
    render() {
        const p = this.props.model.serialize();
        const navigation = p.chosenForNavigation ?
            <button onClick={this.disregard.bind(this)}>stop navigating</button> :
            <button onClick={this.choose.bind(this)}>navigate</button>;

        return (
            <li>{p.name} at {p.latitude}/{p.longitude}
                {navigation}
                <button onClick={this.remove.bind(this)}>remove</button>
            </li>
        )
    }
}
