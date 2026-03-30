function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);

  // OpenWeatherMap API errors
  if (err.response) {
    const status = err.response.status;
    const message = err.response.data && err.response.data.message
      ? err.response.data.message
      : 'External API error';

    if (status === 401) {
      return res.status(502).json({ error: 'Invalid API key. Please check server configuration.' });
    }
    if (status === 404) {
      return res.status(404).json({ error: message || 'Location not found' });
    }
    if (status === 429) {
      return res.status(429).json({ error: 'API rate limit exceeded. Please try again later.' });
    }
    return res.status(502).json({ error: message });
  }

  // Network errors
  if (err.request) {
    return res.status(503).json({ error: 'Unable to reach weather service. Please try again.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
