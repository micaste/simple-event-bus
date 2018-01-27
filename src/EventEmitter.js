import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventBus from 'simple-event-bus';

import './EventEmitter.css';

export default class EventEmitter extends Component {
  constructor(props) {
    super(props);
    this.emitEvent = this.emitEvent.bind(this);
  }
  emitEvent() {
    this.context.eventBus.emit(this.props.action);
  }
  render() {
    return (
      <button className="event-emitter" onClick={this.emitEvent}>
        {this.props.text}
      </button>
    );
  }
}
EventEmitter.propTypes = {
  action: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
EventEmitter.contextTypes = {
  eventBus: PropTypes.instanceOf(EventBus).isRequired,
};
