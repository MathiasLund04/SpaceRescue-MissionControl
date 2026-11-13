const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const test = require('node:test');
const {
  connectDatabase,
  connection,
  COLLECTION_NAMES,
  collections
} = require('../src/config/database');

test('connects to the SpaceRescue database and returns the shared connection', async (context) => {
  const originalConnect = mongoose.connect;
  let receivedUri;
  let receivedOptions;
  mongoose.connect = async (uri, options) => {
    receivedUri = uri;
    receivedOptions = options;
    return mongoose;
  };
  context.after(() => {
    mongoose.connect = originalConnect;
  });

  const result = await connectDatabase('mongodb://localhost/test');

  assert.equal(receivedUri, 'mongodb://localhost/test');
  assert.deepEqual(receivedOptions, { dbName: 'SpaceRescue' });
  assert.equal(result, connection);
});

test('rejects a missing MongoDB connection string', async () => {
  await assert.rejects(
    connectDatabase(''),
    /MONGODB_URI must be configured/
  );
});

test('propagates Mongoose connection failures', async (context) => {
  const originalConnect = mongoose.connect;
  const connectionError = new Error('connection refused');
  mongoose.connect = async () => {
    throw connectionError;
  };
  context.after(() => {
    mongoose.connect = originalConnect;
  });

  await assert.rejects(connectDatabase('mongodb://invalid'), connectionError);
});

test('exposes the required collection names and connection-bound collections', () => {
  assert.deepEqual(COLLECTION_NAMES, {
    spaceships: 'spaceships',
    missions: 'missions',
    assignments: 'assignments'
  });
  assert.deepEqual(Object.keys(collections), Object.keys(COLLECTION_NAMES));
  assert.ok(Object.values(collections).every(Boolean));
});
