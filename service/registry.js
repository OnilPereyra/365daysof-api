const functional = require('ramda');

const values = functional.values;

function createServiceRegistry() {
  const registeredServices = {};

  return {
    get(id) {
      return registeredServices[id];
    },
    register(id, service) {
      registeredServices[id] = service;
    },
    unregister(id) {
      delete registeredServices[id];
    },
    *initialize() {
      yield values(registeredServices).map(rs => rs.initialize);
    },
    *destroy() {
      yield values(registeredServices).map(rs => rs.destroy);
    },
  };
}

module.exports = createServiceRegistry;
