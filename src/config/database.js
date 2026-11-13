const mongoose = require('mongoose');

const COLLECTION_NAMES = Object.freeze({
  spaceships: 'spaceships',
  missions: 'missions',
  assignments: 'assignments'
});

// Keep collection names in one place so repositories use the same MongoDB collections.
// Mongoose creates these handles before connecting; database operations should only
// start after connectDatabase has resolved.
const collections = Object.freeze({
  spaceships: mongoose.connection.collection(COLLECTION_NAMES.spaceships),
  missions: mongoose.connection.collection(COLLECTION_NAMES.missions),
  assignments: mongoose.connection.collection(COLLECTION_NAMES.assignments)
});

async function connectDatabase(uri = 'mongodb://localhost:27017/SpaceRescue') {
  // Fail fast rather than starting the API with no database configured.
  if (!uri) {
    throw new Error('MONGODB_URI must be configured before connecting to MongoDB');
  }

  // Explicit dbName ensures the application always uses the required database,
  // regardless of the database name included in the connection URI.
  await mongoose.connect(uri, { dbName: 'SpaceRescue' });

  // Return Mongoose's shared connection so repositories can use the same connection.
  return mongoose.connection;
}

module.exports = {
  connectDatabase,
  connection: mongoose.connection,
  COLLECTION_NAMES,
  collections
};
