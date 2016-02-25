const functional = require('ramda');

const find = functional.find;
const filter = functional.filter;

function createMemoryDataMapper(options) {
  options = options || {};

  const factory = options.factory;

  let collection;

  const memoryMapper = {
    *initialize() {
      collection = [];

      return memoryMapper;
    },
    *destroy() {
      return memoryMapper;
    },
    *save(entity) {
      collection.push(factory(entity));
    },
    *find(options) {
      options = options || {};

      const query = options.query;

      return filter(query, collection);
    },
    *findOne() {},
    *update() {},
    *remove() {},
  };

  return memoryMapper;
}

module.exports = createMemoryDataMapper;
