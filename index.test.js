/**
 * This test file tests the entry point of the library, just to verify that the
 * entry point works. It could therefore be used for "integration" testing
 * even though it does not make sense at this time.
 */
const assert = require('assert');

const EventBus = require('./index.js');

// Has to be instanciated with `new`
assert.doesNotThrow(
  () => new EventBus(),
  'EventBus should be instantiated using the `new` keyword'
);
