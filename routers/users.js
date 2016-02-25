const debug = require('debug')('365daysof:api:routers:users');
const createRouter = require('koa-router');

const auth = require('../auth');
const routes = require('../routes/users');

function createUserRouter(options) {
  options = options || {};

  const mapper = options.mapper;

  const router = createRouter();

  router.use(function* (next) {
    this.mapper = mapper;

    yield next;
  });

  router.get('/users', routes.list);
  router.get('/users/me', auth.requireAuthentication, routes.getCurrentUser);
  router.get('/users/:userId', routes.getUser);

  router.post('/users', auth.requireAuthentication, auth.requirePermission('users:create'), routes.create);
  router.post('/users/me/goals', auth.requireAuthentication, routes.addGoalToCurrentUser);
  router.post('/users/me/rolemodels', auth.requireAuthentication, routes.addRoleModelToCurrentUser);
  router.post('/users/:userId/challenges', auth.requireAuthentication, routes.challengeUser);

  return router;
}

module.exports = createUserRouter;
