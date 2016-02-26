exports.list = function* () {
  const mapper = getUserDataMapper(this);

  const page = this.page;
  const query = this.request.query;
  const users = yield mapper.find({ query, page });

  this.response.body = users;
};

exports.create = function* () {
  const mapper = getUserDataMapper(this);

  const userData = this.request.body;
  const user = yield mapper.save(userData);

  this.response.body = user;
};

exports.getUser = function* () {
  const mapper = getUserDataMapper(this);

  const userId = this.params.userId;
  const query = { _id: userId };
  const user = yield mapper.findOne({ query });

  this.response.body = user;
};

exports.getCurrentUser = function* () {
  this.response.body = this.state.user;
};

exports.addGoalToCurrentUser = function* () {
  const mapper = getUserDataMapper(this);

  const currentUser = this.state.user;
  const newGoal = this.request.body;

  currentUser.chaseNewGoal(newGoal);

  yield mapper.save(currentUser);

  this.response.status = 201;
};

exports.addRoleModelToCurrentUser = function* () {};

exports.challengeUser = function* () {};

function getUserDataMapper(context) {
  return context.services.get('mapper:user');
}
