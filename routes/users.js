const debug = require('debug')('365daysof:api:routes:users');

exports.list = function* () {
  const page = this.page;
  const query = this.request.query;
  const users = yield this.mapper.find({ query, page });

  this.response.body = users;
};

exports.create = function* () {
  const userData = this.request.body;
  const user = yield this.mapper.save(userData);

  this.response.body = user;
};

exports.getUser = function* () {
  const userId = this.params.userId;
  const query = { _id: userId };
  const user = yield this.mapper.findOne({ query });

  this.response.body = user;
};

exports.getCurrentUser = function* () {
  this.response.body = this.state.user;
};

exports.addGoalToCurrentUser = function* () {
  const currentUser = this.state.user;
  const newGoal = this.request.body;

  currentUser.chaseNewGoal(newGoal);

  this.response.status = 201;
};

exports.addRoleModelToCurrentUser = function* () {};

exports.challengeUser = function* () {};
