const Promise = require('bluebird');
const createCoroutine = require('co');

const createUser = require('../model/user');
const createWebApp = require('../');
const createDataMapper = require('../data/mapper/mongodb');

Promise
.resolve(
  createCoroutine(function* () {
    const userMapper = createDataMapper({
      factory: createUser,
      entityIdKey: 'email',
      connectionUri: 'mongodb://localhost/test',
      collectionName: 'users',
    });
    const dataMappers = {
      users: userMapper,
    };
    const app = createWebApp({dataMappers});

    const initialize = function* initialize() {
      yield app.initialize();
      yield userMapper.initialize();
    };

    yield initialize();
    yield app.start();

    return app;
  })
)
.catch(err => console.error(err))

// serviceRegistry = createServiceRegistry();
// 
// serviceRegistry.register('user-mapper', userMapper);
// serviceRegistry.get('user-mapper');
