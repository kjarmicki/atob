'use strict';

import React from 'react';

export default class Point extends React.Component {
    render() {
        const p = this.props.model.serialize();
        return (
            <li>{p.name} at {p.latitude}/{p.longitude}</li>
        )
    }
}
