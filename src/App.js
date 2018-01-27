import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventBus from 'simple-event-bus';

import EventEmitter from './EventEmitter';
import BoxContainer from './BoxContainer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.eventBus = new EventBus();
  }
  getChildContext() {
    return {eventBus: this.eventBus};
  }
  render() {
    return (
      <div>
        <header>
          <h1>simple-event-bus</h1>
          <h4>
            Each paper box has its own state and listens to the + and - events while it is mounted
          </h4>
        </header>
        <div className="buttons-container">
          <EventEmitter text="-" action="minus-one" />
          <EventEmitter text="+" action="plus-one" />
        </div>
        <BoxContainer />
      </div>
    );
  }
}
App.childContextTypes = {
  eventBus: PropTypes.instanceOf(EventBus).isRequired,
};
