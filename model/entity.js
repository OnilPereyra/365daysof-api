const generateId = require('uuid').v4;

function createEntity(properties) {
  const id = properties.id || generateId();

  const entity = {
    get id() {
      return id;
    }
  };

  return Object.assign(properties, entity);
}

module.exports = createEntity;
