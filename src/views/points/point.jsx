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
    render() {
        const p = this.props.model.serialize();
        return (
            <li>{p.name} at {p.latitude}/{p.longitude} <button onClick={this.remove.bind(this)}>remove</button></li>
        )
    }
}
