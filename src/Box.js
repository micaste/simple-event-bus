import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventBus from 'simple-event-bus';

import './Box.css';

export default class EventEmitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
    };
  }
  componentDidMount() {
    this.removeMinusHandler = this.context.eventBus.on('minus-one', () =>
      this.setState({counter: this.state.counter - 1})
    );
    this.removePlusHandler = this.context.eventBus.on('plus-one', () =>
      this.setState({counter: this.state.counter + 1})
    );
  }
  componentWillUnmount() {
    this.removeMinusHandler();
    this.removePlusHandler();
  }
  render() {
    return (
      <div className="box">
        <span className="counter">{this.state.counter}</span>
        <span className="cross" onClick={this.props.close}>
          {'\u274C'}
        </span>
      </div>
    );
  }
}
EventEmitter.propTypes = {
  close: PropTypes.func.isRequired,
};
EventEmitter.contextTypes = {
  eventBus: PropTypes.instanceOf(EventBus).isRequired,
};
