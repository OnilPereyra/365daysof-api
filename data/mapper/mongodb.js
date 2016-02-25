const mongodb = require('mongodb');
const functional = require('ramda');

const head = functional.head;

const MAPPER_ALREADY_INITIALIZED_ERROR = new Error('Mapper already initialized.');
const MAPPER_NOT_INITIALIZED_ERROR = new Error('Mapper not initialized');

const DEFAULT_DESTROY_OPTIONS = {
  forcefully: false
};
const DEFAULT_FIND_OPTIONS = {
  query: {},
  sorting: {},
  pagination: {
    skip: 0,
    limit: 0
  },
  projection: {},
};
const DEFAULT_UPDATE_OPTIONS = {
  returnOriginal: false
};

function createEntityToDocumentAdapter(baseOptions) {
  const options = baseOptions || {};
  const entityIdKey = options.entityIdKey;
  const documentIdKey = options.documentIdKey || '_id';

  const adapter = {
    mapToEntity(document) {
      if (!document) throw new Error('`document` is null');

      const documentId = document[documentIdKey];
      const documentWithoutId = functional.omit([documentIdKey], document);

      const entity = Object.assign(
        {},
        documentWithoutId,
        { [entityIdKey]: documentId }
      );

      return entity;
    },
    mapToDocument(entity) {
      if (!entity) throw new Error('`entity` is null')

      const entityId = entity[entityIdKey];
      const entityWithoutId = functional.omit([entityIdKey], entity);

      const document = Object.assign(
        {},
        entityWithoutId,
        { [documentIdKey]: entityId }
      );

      return document
    },
  };

  return adapter
}

function createMongoDbDataMapper(baseOptions) {
  const options = baseOptions || {};

  const factory = options.factory;
  const entityIdKey = options.entityIdKey || 'id';
  const documentIdKey = options.documentIdKey || '_id';
  const connectionUri = options.connectionUri;
  const collectionName = options.collectionName;

  const client = new mongodb.MongoClient(connectionUri);

  const adapter = createEntityToDocumentAdapter({entityIdKey, documentIdKey: '_id'});

  let db;
  let collection;
  let initialized = false;

  const mapper = {
    get initialized() {
      return initialized;
    },
    get factory() {
      return factory;
    },
    get collectionName() {
      return collectionName;
    },
    *initialize() {
      if (initialized) throw MAPPER_ALREADY_INITIALIZED_ERROR;

      db = yield client.connect(connectionUri);
      collection = db.collection(collectionName);

      initialized = true;

      return mapper;
    },
    *destroy(baseDestroyOptions) {
      const destroyOptions = baseDestroyOptions || DEFAULT_DESTROY_OPTIONS;
      const forcefully = destroyOptions.forcefully;

      if (!initialized) throw MAPPER_NOT_INITIALIZED_ERROR;

      yield db.close(forcefully);

      initialized = false;

      return mapper;
    },
    *save(entity) {
      const document = adapter.mapToDocument(this.factory(entity));

      const insertOperationResult = yield collection.insertOne(document);
      const insertedDocument = head(insertOperationResult.ops);
      const insertedEntity = this.factory(adapter.mapToEntity(insertedDocument));

      return insertedEntity;
    },
    *find(baseOptions) {
      if (!initialized) throw MAPPER_NOT_INITIALIZED_ERROR;

      const options = baseOptions || DEFAULT_FIND_OPTIONS;

      const query = options.query;
      const sorting = options.sorting;
      const pagination = options.pagination || DEFAULT_FIND_OPTIONS.pagination;
      const projection = options.projection;

      const documents = yield collection
      .find(query, projection)
      .sort(sorting)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .toArray();

      const entities = documents
      .map(adapter.mapToEntity)
      .map(factory);

      return entities;
    },
    *findOne(baseOptions) {
      if (!initialized) throw MAPPER_NOT_INITIALIZED_ERROR;

      const options = baseOptions || {};

      const query = options.query;
      const projection = options.projection;

      const document = yield collection
      .findOne(query, projection);

      const entity = factory(adapter.mapToEntity(document));

      return entity;
    },
    *update(entityId, entity) {
      if (!initialized) throw MAPPER_NOT_INITIALIZED_ERROR;

      const document = adapter.mapToDocument(entity);

      const documentMatchingId = {[documentIdKey]: entityId};
      const updateQuery = {$set: document};

      const updateOperationResult = yield collection
      .findOneAndUpdate(documentMatchingId, updateQuery, DEFAULT_UPDATE_OPTIONS);

      const updatedDocument = updateOperationResult.value;

      return updatedDocument;
    },
    *remove(entityId) {
      if (!initialized) throw MAPPER_NOT_INITIALIZED_ERROR;

      const documentMatchingId = {_id: entityId};

      const deleteOperationResult = yield collection
      .findOneAndDelete(documentMatchingId);

      const deletedDocument = deleteOperationResult.value;

      return deletedDocument;
    },
  };

  return mapper;
}

module.exports = createMongoDbDataMapper;
