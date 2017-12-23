import React from 'react';
import { connect } from 'react-redux';
import autobind from '../util/autobind';
import PointsPage from './points/points-page';
import NavigationPage from './navigation/navigation-page';
import * as actions  from '../redux/actions';

class Main extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.menuItems = ['points', 'navigation'];
    }
    selectOnClick(e) {
        e.preventDefault();
        const id = e.target.dataset.id;
        this.select(id);
    }
    select(id) {
        this.props.dispatch(actions.selectTab(id));
    }
    tabTransitionEnd(e) {
        this.props.dispatch(actions.tabTransitionEnded());
    }
    render() {
        const pagesClassNames = ['pages',
            `page-selected-${this.props.tabs.selected}`
        ].join(' ');
        const mainViewClassNames = ['main-view',
            `page-transition-progress-${this.props.tabs.transitionProgress}`
        ].join(' ');
        const menuItems = this.menuItems.map(item => {
            return(
                <li key={item} className="main-menu-item">
                    <a onClick={this.selectOnClick}
                       className={this.props.tabs.selected === item ? "active" : "" } data-id={item} href="#">{item}</a>
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
                <div onTransitionEnd={this.tabTransitionEnd} className={pagesClassNames}>
                    <PointsPage />
                    <NavigationPage />
                </div>
            </div>
        );
    }
}

export default connect(state => ({
    tabs: state.tabs,
    keepAwake: state.keepAwake,
    points: state.points
}))(Main);
