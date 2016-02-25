function createServiceRegistry() {
  const registeredServices = {};

  return {
    locate(id) {
      return registeredServices[id];
    },
    register(id, service) {
      registeredServices[id] = service;
    },
    unregister(id) {
      delete registeredServices[id];
    }
  };
}
