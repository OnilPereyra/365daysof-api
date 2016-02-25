const mergeInto = require('../utilities/merge-into');

function createTimeline(state) {
  state = state || {};

  const milestones = state.milestones || [];

  const timeline = {
    get milestones() {
      return milestones;
    },
    addMilestone(newMilestone) {
      milestones.push(createMilestone(newMilestone));

      return timeline;
    }
  };

  return mergeInto(state, timeline);
}

module.exports = createTimeline;
