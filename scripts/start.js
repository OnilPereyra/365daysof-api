const Promise = require('bluebird');
const createCoroutine = require('co');

const createUser = require('../model/user');
const createWebApp = require('../');
const createDataMapper = require('../data/mapper/mongodb');
const createServiceRegistry = require('../service/registry');

Promise
.resolve(
  createCoroutine(function* () {
    const serviceRegistry = createServiceRegistry();
    const userMapper = createDataMapper({
      factory: createUser,
      entityIdKey: 'email',
      documentIdKey: '_id',
      connectionUri: 'mongodb://localhost/test',
      collectionName: 'users',
    });

    serviceRegistry.register('mapper:user', userMapper);

    const app = createWebApp({ serviceRegistry });
    yield app.initialize();
    yield app.start();

    return app;
  })
)
.catch(err => console.error(err));
