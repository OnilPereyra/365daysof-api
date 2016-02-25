const utilities = require('util');
const functional = require('ramda');

const mergeInto = require('../utilities/merge-into');
const createTimeline = require('./timeline');

function createGoal(state) {
  state = state || {};

  const title = state.title;
  const timeline = createTimeline(state.timeline);

  let isReached = false;

  const goal = {
    get title() {
      return title;
    },
    get timeline() {
      return timeline;
    },
    get isReached() {
      return isReached;
    },
    reach() {
      isReached = true;

      return goal;
    }
  };

  return mergeInto(state, goal);
}

function validateGoal(state) {
  const title = state.title;
  const timeline = state.timeline;

  if (!title) throw new TypeError('`title` cannot be falsy.');
  if (!utilities.isString(title)) throw new TypeError('`title` is not a string.');

  return state;
}

module.exports = functional.compose(createGoal, validateGoal);
