const NETWORK_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EHOSTUNREACH',
  'EAI_AGAIN'
]);

function getErrorResponse(error) {
  if (error.isJoi) {
    return {
      status: 400,
      message: error.details.map((detail) => detail.message).join('; ')
    };
  }

  if (error.type === 'entity.parse.failed') {
    return { status: 400, message: 'Malformed JSON request body' };
  }

  if (error.name === 'ValidationError') {
    return {
      status: 400,
      message: Object.values(error.errors).map((fieldError) => fieldError.message).join('; ')
    };
  }

  if (error.name === 'CastError') {
    return { status: 400, message: `Invalid ${error.path}` };
  }

  if (error.code === 11000) {
    return { status: 409, message: 'A record with the same unique value already exists' };
  }

  if (error.code === 'MISSION_NOT_FOUND' || error.code === 'SPACESHIP_NOT_FOUND') {
    return { status: 404, message: error.message };
  }

  if (error.code === 'ASSIGNMENT_CONFLICT' || error.code === 'ACTIVE_ASSIGNMENT_CONFLICT') {
    return { status: 409, message: error.message };
  }

  if (
    error.name === 'MongoServerSelectionError'
    || error.name === 'MongooseServerSelectionError'
    || error.name === 'MongoNetworkError'
  ) {
    return { status: 503, message: 'Database is unavailable' };
  }

  if (NETWORK_ERROR_CODES.has(error.code)) {
    return { status: 503, message: 'An external service is unavailable' };
  }

  if (error.response || error.statusCode >= 500) {
    return { status: 502, message: 'An external service request failed' };
  }

  const status = Number.isInteger(error.status) && error.status >= 400 && error.status <= 599
    ? error.status
    : 500;

  return {
    status,
    message: status < 500 ? error.message : 'Internal server error'
  };
}

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  console.error(error);
  const { status, message } = getErrorResponse(error);
  return response.status(status).json({ error: message || 'Request failed' });
}

module.exports = errorHandler;
