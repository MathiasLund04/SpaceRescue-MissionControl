const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const app = require('../src/app');
const startServer = require('../src/server');

test('exports an Express application and a server start function', () => {
  assert.equal(typeof app, 'function');
  assert.equal(typeof startServer, 'function');
});

test('all scaffold modules can be imported', () => {
  const modules = [
    '../src/config/database',
    '../src/routes/shipRoutes',
    '../src/routes/missionRoutes',
    '../src/controllers/shipController',
    '../src/controllers/missionController',
    '../src/services/missionService',
    '../src/repositories/shipRepository',
    '../src/repositories/missionRepository',
    '../src/repositories/assignmentRepository',
    '../src/models/shipModel',
    '../src/models/missionModel',
    '../src/models/assignmentModel',
    '../src/clients/notificationClient',
    '../src/middleware/errorHandler'
  ];

  for (const modulePath of modules) {
    assert.doesNotThrow(() => require(modulePath), modulePath);
  }
});

test('handles simultaneous requests to both mounted route groups', async (context) => {
  const server = await startServer(0, async () => {});
  context.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const { port } = server.address();
  const paths = [
    '/api/ships',
    '/api/missions',
    '/api/ships',
    '/api/missions'
  ];

  const responses = await Promise.all(paths.map((path) => new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port, path }, (response) => {
      response.resume();
      response.on('end', () => resolve(response.statusCode));
    }).on('error', reject);
  })));

  assert.deepEqual(responses, [404, 404, 404, 404]);
});

test('does not start listening until the database connection succeeds', async (context) => {
  let releaseConnection;
  let connectionStarted = false;
  let serverStarted = false;
  const connectionGate = new Promise((resolve) => {
    releaseConnection = resolve;
  });
  const startup = startServer(0, async () => {
    connectionStarted = true;
    await connectionGate;
  }).then((server) => {
    serverStarted = true;
    return server;
  });

  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(connectionStarted, true);
  assert.equal(serverStarted, false);

  releaseConnection();
  const server = await startup;
  context.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  assert.equal(server.listening, true);
});

test('does not start listening when the database connection fails', async () => {
  const connectionError = new Error('database unavailable');

  await assert.rejects(
    startServer(0, async () => {
      throw connectionError;
    }),
    connectionError
  );
});
