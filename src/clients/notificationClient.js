const http = require('node:http');
const https = require('node:https');

const REQUEST_TIMEOUT_MS = 5000;

function sendMissionAssignedNotification({ missionId, shipId }) {
  const serviceUrl = new URL(
    '/api/notifications',
    process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3001'
  );
  const transport = serviceUrl.protocol === 'https:' ? https : http;
  if (!['http:', 'https:'].includes(serviceUrl.protocol)) {
    throw new Error(`Unsupported notification service protocol: ${serviceUrl.protocol}`);
  }

  const payload = JSON.stringify({
    event: 'MISSION_ASSIGNED',
    missionId: String(missionId),
    shipId: String(shipId)
  });

  return new Promise((resolve, reject) => {
    const request = transport.request(serviceUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload)
      }
    }, (response) => {
      response.resume();
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve();
          return;
        }

        reject(new Error(`Notification service returned HTTP ${response.statusCode}`));
      });
    });

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error('Notification service request timed out'));
    });
    request.on('error', reject);
    request.end(payload);
  });
}

module.exports = {
  sendMissionAssignedNotification
};
