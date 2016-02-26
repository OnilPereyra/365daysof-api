const http = require('http');
const debug = require('debug')('365daysof:api');
const functional = require('ramda');
const createJwtParser = require('koa-jwt');
const createKoaServer = require('koa');
const createBodyParser = require('koa-bodyparser');

const createUserRouter = require('./routers/users');

const omit = functional.omit;

const DEFAULT_OPTIONS = {
  port: 3000,
  host: 'localhost',
  pager: {
    skip: 0,
    limit: 0,
  },
  jwtParser: {
    key: 'token',
    secret: 'sabrina',
    passthrough: true,
  },
};
const PAGINATION_FIELDS = ['skip', 'limit'];
const USER_DATA_MAPPER_SERVICE = 'mapper:user';

function createWebApp(options) {
  options = Object.assign(
    {},
    DEFAULT_OPTIONS,
    options
  );

  debug('options %j (keys only)', Object.keys(options));

  const serviceRegistry = options.serviceRegistry;

  const koaServer = createKoaServer();
  const webServer = http.createServer();

  koaServer.context = Object.create(koaServer.context, {
    services: {
      enumerable: true,
      get() { return serviceRegistry; },
    },
  });

  const stopWebServer = function* stopWebServer() {
    yield done => webServer.close(done);
  };
  const startWebServer = function* startWebServer() {
    yield done => webServer.listen(options.port, options.host, done);
  };
  const initializeApplication = function* initializeApplication() {
    yield serviceRegistry.initialize();

    webServer.on('request', koaServer.callback());
  };
  const destroyApplication = function* destroyApplication() {
    yield stopWebServer();
  };

  const app = {
    get services() {
      return serviceRegistry;
    },
    *initialize() {
      yield initializeApplication();
    },
    *destroy() {
      yield destroyApplication();
    },
    *start() {
      yield startWebServer();
    },
    *stop() {
      yield stopWebServer();
    },
    useMiddleware(mw) {
      koaServer.use(mw);
    },
  };

  const userRouter = createUserRouter();

  const middleware = [
    createPager(options.pager),
    createBodyParser(),
    createJwtParser(options.jwtParser),
    createUserInflatter(),
    userRouter.allowedMethods(),
    userRouter.routes(),
  ];

  middleware.forEach(app.useMiddleware);

  return app;
}

function createPager(options) {
  return function* (next) {
    const skip = this.request.query.skip;
    const limit = this.request.query.limit;

    this.request.query = omit(PAGINATION_FIELDS, this.request.query);

    const page = Object.assign(
      {},
      options,
      {
        skip,
        limit,
      }
    );

    this.page = page;

    yield next;
  };
}

function createUserInflatter(options) {
  return function* (next) {
    options = options || {};

    if (this.state.token) {
      const userId = this.state.token.email;
      const query = { _id: userId };

      try {
        const mapper = this.app.services.get(USER_DATA_MAPPER_SERVICE);
        const user = yield mapper.findOne({ query });

        this.state.user = user;
      } catch (e) {
        this.throw(401);
      }
    }

    yield next;
  };
}

module.exports = createWebApp;
