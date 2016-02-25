const functional = require('ramda');

const contains = functional.contains;

exports.requireAuthentication = function* requireAuthentication(next) {
  const isAuthenticated = !!this.state.token;

  if (!isAuthenticated) this.throw(401);

  yield next;
};

exports.requirePermission = function requirePermission(permission) {
  return function* (next) {
    const roles = this.state.token.roles;

    if (!contains(permission, roles)) this.throw(403);

    yield next;
  };
};
