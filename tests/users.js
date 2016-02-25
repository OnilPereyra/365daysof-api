const jwt = require('jsonwebtoken');
const test = require('blue-tape');
const HttpClient = require('superagent');
const createCoroutine = require('co');

const createUser = require('../model/user');
const createApplication = require('../');
const createMemoryDataMapper = require('../data/mapper/memory');

const DATA_MAPPERS = {
  users: createMemoryDataMapper({
    factory: createUser,
  })
};

test('POST /users requires `user:create` permission', createCoroutine.wrap(function* (assert) {
  const app = createApplication({dataMappers: DATA_MAPPERS});
  const secret = 'sabrina';
  const unauthorizedToken = {email: 'test@test.er', roles: []};
  const unauthorizedTokenSignature = jwt.sign(unauthorizedToken, secret);

  yield app.initialize();
  yield app.start();

  yield DATA_MAPPERS.users.initialize();
  yield DATA_MAPPERS.users.save(unauthorizedToken);

  yield done => HttpClient
  .post('http://localhost:3000/users')
  .set('Authorization', `Bearer ${unauthorizedTokenSignature}`)
  .end((error, response) => {
    const actualStatus = response.status;
    const expectedStatus = 403;

    assert.equals(actualStatus, expectedStatus, 'returns `403` if permission missing');

    done();
  });

  yield app.destroy();
}));
