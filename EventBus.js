const ListMap = require('./ListMap');

/**
 * A simple event bus implementation, that supports actions as strings,
 * and dispatches events to all handlers with customizable a broker.
 */
class EventBus {
  /**
   * @param {Object} [options]
   * @param {Function} [options.broker] - A broker can be specified. By default
   * the parameters emitted will be forwarded. It has to return an array,
   * its result will be spread.
   * @param {{error: Function}} [options.logger] - A logger can be specified, defaulting
   * to the console.
   */
  constructor({logger, broker} = {}) {
    this.handlers = new ListMap();
    this.logger = logger ? logger : console;
    this.broker = broker ? broker : (action, ...args) => args;
  }

  /**
   * Registers a handler for a given action. It will be called with one
   * or several parameters, depending on what is returned by the broker.
   * @param {string} action - The name of the action to subscribe to.
   * @param {Function} handler - A function that will be called when the event is emitted,
   * with the parameters passed during the emission.
   * @param {string} [handlerId] - Optional, a name can be set for the handler. It will
   * be used for logging purposes.
   * @return {Function} A function that unregisters the handler when called.
   */
  on(action, handler, handlerId) {
    const insertionId = this.handlers.add(action, {handler, handlerId});
    return () => this.handlers.remove(action, insertionId);
  }

  /**
   * Emits an action, identified by a string. The handlers will be executed
   * in the order of their subscription. An error thrown in a handler will
   * be logged, but will not prevent the other handlers from being notified.
   * @param {string} action
   * @param {*} args
   */
  emit(action, ...args) {
    // We do not throw if the action does not have any subscribers, we just
    // don't do anything.
    this.handlers.forEach(action, ({handler, handlerId}) => {
      // We isolate the handlers so that if one errors, it still calls the others.
      try {
        handler(...this.broker(action, ...args));
      } catch (e) {
        this.logger.error(
          `${handlerId !== undefined ? `The handler ${handlerId}` : `A handler`} has errored:`,
          e.message,
          e.stack
        );
      }
    });
  }

  handlersCount(action) {
    return this.handlers.size(action);
  }
}

module.exports = EventBus;
