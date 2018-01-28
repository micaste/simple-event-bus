# Simple Event Bus

This project implements a basic but configurable event bus.

## Usage

```js
// In Node.js
const EventBus = require('simple-event-bus');

// For the browser, using a bundler
import EventBus from 'simple-event-bus';

const eventBus = new EventBus();

// subscribe to events
const removeHandler = eventBus.on('my-event', (...args) => {
  console.log(...args);
});

// trigger events
eventBus.emit('my-event', 'Hello', 'world', '!');
// => Hello world !

// unsubscribe when you are done
removeHandler();
```

[Live Demo](https://micaste.github.io/simple-event-bus/build/) and [its source code](https://github.com/micaste/simple-event-bus/tree/gh-pages).

## Features

* An error in one of the handlers will not stop the propagation of the event to other handlers.
* Simple api: adding a handler returns the function to remove it.
* Handlers are called in the order of insertion.
* Customizable logger (to plug your custom logging logic).
* Customizable broker (to transform messages between events emitted and handlers).

## API

### `new EventBus([options: Object])`

Returns the event bus instance, that holds the handlers and is able to dispatch events

#### `eventBus.on(action: string, handler: Function, [handlerId: number]): Function`

Registers the handler for the given action. Optionally, a handlerId can be passed, that will be used when logging errors. It returns a function that removes the handler when called.

#### `eventBus.emit(action: string, ...parameters: any): number`

Emits an event, dispatching it to all registered handlers. It does not do anything if no handlers have been registered on that event.

#### `eventBus.handlersCount(action: string)`

Returns the number of handlers currently subscribed to the action.

### `[options = {}]`

#### `options.logger`

Type: Object
Default: [`console`](https://developer.mozilla.org/en-US/docs/Web/API/Console)

The only mandatory method for now is `error`, but some additional loggings will most likely be added (`log`, `info`, `debug`, `warn`);

#### `options.broker`

Type: Function
Default: `(action, ...payload) => payload`

A function to customize the interface between events and handlers, giving the ability for example to standardize all the messages transmitted to the handlers into a normalized format. By default, the broker just propagates the arguments that have been emitted.

## Compatibility

The node entry point (`"main": "index.js"` in the `package.json`) requires Node >= 6.5 (see [ES6 compatibility table for class](http://kangax.github.io/compat-table/es6/#test-class)). The browser entry point ("browser": "browser.js" in the `package.json`) exposes some code bundled and transpiled into ES5 for compatibility with older browsers, bundlers, minifiers, ...

## Future

* [ ] More logging: Currently, we only log errors. We could log more information, to help with troubleshooting.

* [ ] Log level: We could add a logLevel option, to allow filtering the log messages while still keeping the default logger.

* [ ] Test framework: A better test framework (for example [Jest](https://facebook.github.io/jest/)) should be used in order to for example have a test coverage report.

* [ ] Examples: A showcase application could be built as a demo, showing the interest of using a custom logger and broker in a real-case example.
