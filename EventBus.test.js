const assert = require('assert');

const EventBus = require('./EventBus');

// We use a logger stub so that:
// 1. We do not pollute the test console
// 2. We can write assertions on logs
const createLoggerStub = () => {
  const scopedErrors = [];
  return {
    error: (...messages) =>
      // We do not keep the error stack
      scopedErrors.push(messages.slice(0, 2)),
    getErrors: () => scopedErrors,
  };
};

const runTest = (description, test) => {
  console.log(`  ${description}`);
  test();
};
// Run tests that do not need to customize the logger or broker,
// and expect no errors
const runSimpleTest = (description, test) => {
  runTest(description, () => {
    const logger = createLoggerStub();
    const eventBus = new EventBus({logger});
    test(eventBus);
    assert.deepEqual(logger.getErrors(), [], 'Expecting no errors');
  });
};

runSimpleTest('Emitting an event to one handler', eventBus => {
  let counter = 0;
  eventBus.on('one', () => {
    counter++;
  });
  eventBus.emit('one');
  assert.equal(counter, 1, 'Event should have been called once only');
});

runSimpleTest(
  'Emitting three events to one handler, expecting one call and no failure',
  eventBus => {
    let counter = 0;
    eventBus.on('two', () => {
      counter++;
    });
    eventBus.emit('one');
    eventBus.emit('two');
    eventBus.emit('three');
    assert.equal(counter, 1, 'Event should have been called once only');
  }
);

runSimpleTest('By default, the handler should be forwarded the emitted parameters', eventBus => {
  const result = [];
  eventBus.on('one', str => {
    result.push(str);
  });
  eventBus.emit('one', 'hello world');
  assert.deepEqual(result, ['hello world'], 'Handler should be forwarded the parameter');
});

runSimpleTest('By default, the handler should be forwarded the emitted parameters', eventBus => {
  const result = [];
  eventBus.on('one', (...args) => {
    result.push(args);
  });
  eventBus.emit('one', 'hello', 'world', '!');
  assert.deepEqual(result, [['hello', 'world', '!']], 'Handler should be forwarded the parameters');
});

runSimpleTest('Handlers can unsubscribe', eventBus => {
  const counters = {a: 0, b: 0};
  const removeA = eventBus.on('one', () => {
    counters.a++;
  });
  const removeB = eventBus.on('one', () => {
    counters.b++;
  });
  assert.equal(eventBus.handlersCount('one'), 2);
  eventBus.emit('one');
  removeB();
  assert.equal(eventBus.handlersCount('one'), 1);
  eventBus.emit('one');
  removeA();
  assert.equal(eventBus.handlersCount('one'), 0);
  eventBus.emit('one');

  assert.deepEqual(
    counters,
    {a: 2, b: 1},
    'Handlers should not be called once they have been removed'
  );
});

runTest('A custom broker can be specified', () => {
  const logger = createLoggerStub();
  // Here we try a broker that returns a shape that would be the same for all events
  const standardizingbroker = (action, ...args) => [{action, payload: args}];
  const eventBus = new EventBus({broker: standardizingbroker, logger});
  const result = [];
  eventBus.on('one', standardizedPayload => {
    result.push(standardizedPayload);
  });
  eventBus.emit('one', 'hello', 'world', '!');
  assert.deepEqual(
    result,
    [{action: 'one', payload: ['hello', 'world', '!']}],
    'Handler should be forwarded the parameters as specified in the custom broker'
  );
  assert.deepEqual(logger.getErrors(), [], 'Expecting no errors');
});

runTest('When an error happens in a handler, the other handlers should still be called', () => {
  const logger = createLoggerStub();
  const eventBus = new EventBus({logger});
  const counters = {a: 0, b: 0, c: 0, d: 0};
  eventBus.on('one', () => {
    counters.a++;
  });
  // Handler with a name
  eventBus.on('one', () => {
    throw new Error('foo error');
  });
  // Anonymous handler
  eventBus.on(
    'one',
    () => {
      throw new Error('foo error');
    },
    'handlerC'
  );
  eventBus.on('one', () => {
    counters.d++;
  });
  eventBus.emit('one');
  assert.deepEqual(
    counters,
    {a: 1, b: 0, c: 0, d: 1},
    'All handlers not erroring should have been called once'
  );
  assert.deepEqual(
    logger.getErrors(),
    [['A handler has errored:', 'foo error'], ['The handler handlerC has errored:', 'foo error']],
    'Expecting errors with and without handler name'
  );
});
