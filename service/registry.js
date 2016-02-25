const functional = require('ramda');

const values = functional.values;
const forEach = functional.forEach;

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
      forEach(initializeService, values(registeredServices));
    },
    *destroy() {
      forEach(destroyService, values(registeredServices));
    },
  };
}

function* initializeService(s) {
  yield s.initialize();
}

function* destroyService(s) {
  yield s.destroy();
}

module.exports = createServiceRegistry;
