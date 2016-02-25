const mergeInto = require('../utilities/merge-into');

function createMilestone(state) {
  state = state || {};

  // TODO: assert presense of these properties.
  const type = state.type;
  const value = state.value;
  const source = state.source;

  let title = state.title;
  let description = state.description;

  const milestone = {
    title,
    description,
    get type() {
      return type;
    },
    get value() {
      return value;
    },
    get source() {
      return source;
    }
  };

  return mergeInto(state, milestone);
}

module.exports = createMilestone;
