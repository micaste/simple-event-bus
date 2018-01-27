const assert = require('assert');

const ListMap = require('./ListMap');

const runTest = (description, test) => {
  console.log(`  ${description}`);
  test();
};

runTest('Supports iteration', () => {
  const listMap = new ListMap();
  listMap.add('key1', 'a');
  listMap.add('key1', 'b');

  const result = [];
  listMap.forEach('key1', value => {
    result.push(value);
  });
  assert.deepEqual(result, ['a', 'b']);
});

runTest('Supports size()', () => {
  const listMap = new ListMap();
  const idA = listMap.add('key1', 'a');
  listMap.add('key1', 'b');

  assert.equal(listMap.size('key1'), 2);
  listMap.remove('key1', idA);
  assert.equal(listMap.size('key1'), 1);
  assert.equal(listMap.size('key2'), 0);
});

runTest('Supports returning an array', () => {
  const listMap = new ListMap();
  listMap.add('key1', 'a');
  listMap.add('key1', 'b');

  assert.deepEqual(
    listMap.get('key1'),
    ['a', 'b'],
    'Adding two values should store them in an array'
  );
});

runTest('Does not throw when requested a value never added', () => {
  const listMap = new ListMap();

  assert.doesNotThrow(
    () => listMap.get('key'),
    'Getting a key that does not exist in the map should return an empty array'
  );
  assert.deepEqual(listMap.get('key'), [], '.get() should return an empty array');
  assert.doesNotThrow(
    () => listMap.forEach('key', () => {}),
    'Getting a key that does not exist in the map should return an empty array'
  );
});

runTest('Removing a value should keep the order', () => {
  const listMap = new ListMap();
  listMap.add('key1', 'a');
  const idB = listMap.add('key1', 'b');
  listMap.add('key1', 'c');
  listMap.add('key1', 'd');
  listMap.remove('key1', idB);
  assert.deepEqual(listMap.get('key1'), ['a', 'c', 'd']);
});
