const app = require('./app');
const { connectDatabase } = require('./config/database');

async function startServer(port = process.env.PORT || 3000, connect = connectDatabase) {
  // Await the database before creating the HTTP listener. If connection setup
  // rejects, this function rejects too and the API never accepts requests.
  await connect();

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`SpaceRescue server listening on port ${port}`);
      resolve(server);
    });

    // Surface listener errors (for example, if the requested port is unavailable).
    server.once('error', reject);
  });
}

if (require.main === module) {
  // Keep startup errors visible and make command-line startup report failure to the OS.
  startServer().catch((error) => {
    console.error('Unable to start SpaceRescue server:', error);
    process.exitCode = 1;
  });
}

// Export the startup function so tests and other entry points can control startup.
module.exports = startServer;
