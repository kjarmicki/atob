'use strict';

import React from 'react';
import PointsPage from './points/points-page';
import NavigationPage from './navigation/navigation-page';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItems: ['points', 'navigation'],
            selected: null,
            transitionProgress: 'ended'
        };
        this.props.events.on('point.choose', () => this.select('navigation'));
        this.props.events.on('point.choose', () => this.preventScreenSleep());
        this.props.events.on('point.disregard', () => this.select('points'));
        this.props.events.on('point.disregard', () => this.allowScreenSleep())
    }
    componentDidMount() {
        this.props.pointRepository.retrieveChosen()
            .then(chosenPoint => {
                this.setState({selected: chosenPoint ? 'navigation' : 'points'});
            });
    }
    selectOnClick(e) {
        e.preventDefault();
        const id = e.target.dataset.id;
        this.select(id);
    }
    select(id) {
        if(this.state.selected !== id) {
            this.setState({
                selected: id,
                transitionProgress: 'running'
            });
        }
    }
    preventScreenSleep() {
        this.props.insomnia.keepAwake();
    }
    allowScreenSleep() {
        this.props.insomnia.allowSleepAgain();
    }
    pageTransitionEnd(e) {
        this.setState({
            transitionProgress: 'ended'
        });
    }
    render() {
        if(!this.state.selected) return null;

        const pagesClassNames = ['pages',
            `page-selected-${this.state.selected}`
        ].join(' ');
        const mainViewClassNames = ['main-view',
            `page-transition-progress-${this.state.transitionProgress}`
        ].join(' ');
        const menuItems = this.state.menuItems.map(item => {
            return(
                <li key={item} className="main-menu-item">
                    <a onClick={this.selectOnClick.bind(this)}
                       className={this.state.selected === item ? "active" : "" } data-id={item} href="#">{item}</a>
                </li>
            );
        });
        return (
            <div className={mainViewClassNames}>
                <header className="main-header">
                    <nav>
                        <ul className="main-menu-list">
                            {menuItems}
                        </ul>
                    </nav>
                </header>
                <div onTransitionEnd={this.pageTransitionEnd.bind(this)} className={pagesClassNames}>
                    <PointsPage
                        pointRepository={this.props.pointRepository}
                        geolocationProvider={this.props.geolocationProvider}
                        events={this.props.events}
                    />
                    <NavigationPage
                        pointRepository={this.props.pointRepository}
                        geolocationProvider={this.props.geolocationProvider}
                        orientationProvider={this.props.orientationProvider}
                        events={this.props.events}
                    />
                </div>
            </div>
        );
    }
}