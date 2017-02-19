import React from 'react';
import { connect } from 'react-redux';
import { setState } from '../redux/action-creators';
import autobind from '../util/autobind';
import PointsPage from './points/points-page';
import NavigationPage from './navigation/navigation-page';

class Main extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.menuItems = ['points', 'navigation'];
        this.props.events.on('point.choose', () => this.select('navigation'));
        this.props.events.on('point.choose', this.preventScreenSleep);
        this.props.events.on('point.disregard', () => this.select('points'));
        this.props.events.on('point.disregard', this.allowScreenSleep)
    }
    componentDidMount() {
        this.props.pointRepository.retrieveChosen()
            .then(chosenPoint => {
                if(chosenPoint) this.preventScreenSleep();
                this.props.dispatch(setState({selectedTab: chosenPoint ? 'navigation' : 'points'}));
            });
    }
    selectOnClick(e) {
        e.preventDefault();
        const id = e.target.dataset.id;
        this.select(id);
    }
    select(id) {
        if(this.props.selectedTab !== id) {
            this.props.dispatch(setState({
                selectedTab: id,
                transitionProgress: 'running'
            }));
        }
    }
    preventScreenSleep() {
        this.props.insomnia.keepAwake();
    }
    allowScreenSleep() {
        this.props.insomnia.allowSleepAgain();
    }
    pageTransitionEnd(e) {
        this.props.dispatch(setState({
            transitionProgress: 'ended'
        }));
    }
    render() {
        if(!this.props.selectedTab) return null;

        const pagesClassNames = ['pages',
            `page-selected-${this.props.selectedTab}`
        ].join(' ');
        const mainViewClassNames = ['main-view',
            `page-transition-progress-${this.props.transitionProgress}`
        ].join(' ');
        const menuItems = this.menuItems.map(item => {
            return(
                <li key={item} className="main-menu-item">
                    <a onClick={this.selectOnClick}
                       className={this.props.selectedTab === item ? "active" : "" } data-id={item} href="#">{item}</a>
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
                <div onTransitionEnd={this.pageTransitionEnd} className={pagesClassNames}>
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

export default connect(state => ({
    selectedTab: state.selectedTab,
    transitionProgress: state.transitionProgress
}))(Main);
