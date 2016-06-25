'use strict';

import React from 'react';

export default class Point extends React.Component {
    remove() {
        this.props.pointRepository.remove(this.props.model)
            .then(() => {
                this.props.events.emit('point.remove');
            })
            .catch(err => {
                console.error(err);
            });
    }
    choose() {
        this.props.events.emit('point.choose', this.props.model);
    }
    render() {
        const p = this.props.model.serialize();
        const navigation = p.chosenForNavigation ?
            <strong>currently navigating</strong> :
            <button onClick={this.choose.bind(this)}>navigate</button>;

        return (
            <li>{p.name} at {p.latitude}/{p.longitude}
                {navigation}
                <button onClick={this.remove.bind(this)}>remove</button>
            </li>
        )
    }
}
