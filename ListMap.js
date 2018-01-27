/**
 * A data structure to store lists under a key. It used the native Javascript
 * [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 * because it maintains the order of insertion when iterating, and allows to delete
 * elements without scan. This implementation favors that over listing values,
 * that would materialize a new array in memory.
 */
class ListMap {
  constructor() {
    this.map = {};
  }

  /**
   * Add one items under the key and return the element id, that
   * can be used for removal.
   * @param {string} key
   * @param {*} item
   * @return {number} The inserted element id, that is used for removal.
   */
  add(key, item) {
    if (this.map[key] !== undefined) {
      // We increment the max index when inserting
      const itemId = ++this.map[key].maxIndex;
      this.map[key].storage.set(itemId, item);
      return itemId;
    } else {
      const startingId = 0;
      this.map[key] = {
        storage: new Map().set(startingId, item),
        maxIndex: startingId,
      };
      return startingId;
    }
  }

  /**
   * Removes the item stored under the key, with the id returned at insertion.
   * @param {string} key
   * @param {number} item
   */
  remove(key, itemId) {
    if (this.map[key] !== undefined) {
      this.map[key].storage.delete(itemId);
    }
  }

  /**
   * Iterates over each item stored under the key, according to insertion order.
   * @param {string} key
   * @param {Function} callback - See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach#Description
   * @return {Array}
   */
  forEach(key, callback) {
    if (this.map[key] !== undefined) {
      this.map[key].storage.forEach(value =>
        // We voluntarily hide the reference to the itemId and Map, because we
        // think that they should remain internal.
        callback(value)
      );
    }
  }

  /**
   * This method returns an array of the values stored under they key.
   * Disclaimer: do not use for iterating, as it is less optimize than .forEach()
   * @param {string} key
   */
  get(key) {
    return this.map[key] !== undefined ? Array.from(this.map[key].storage.values()) : [];
  }

  size(key) {
    return this.map[key] !== undefined ? this.map[key].storage.size : 0;
  }
}

module.exports = ListMap;
