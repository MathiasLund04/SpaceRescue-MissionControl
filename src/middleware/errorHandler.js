function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  console.error(error);
  return response.status(error.status || 500).json({
    error: error.status && error.status < 500 ? error.message : 'Internal server error'
  });
}

module.exports = errorHandler;
