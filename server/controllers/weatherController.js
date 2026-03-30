const weatherService = require('../services/weatherService');

/**
 * Validate and parse lat/lon query parameters.
 * Returns { latNum, lonNum } on success, or calls res.status(400) and returns null.
 */
function parseCoords(req, res) {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    res.status(400).json({ error: 'lat and lon query parameters are required' });
    return null;
  }
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (isNaN(latNum) || isNaN(lonNum)) {
    res.status(400).json({ error: 'lat and lon must be valid numbers' });
    return null;
  }
  if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    res.status(400).json({ error: 'Invalid coordinates' });
    return null;
  }
  return { latNum, lonNum };
}

const weatherController = {
  async getCurrentByCity(req, res, next) {
    try {
      const { city } = req.params;
      if (!city || city.trim().length < 1) {
        return res.status(400).json({ error: 'City name is required' });
      }
      const data = await weatherService.getCurrentWeather(city.trim());
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getForecastByCity(req, res, next) {
    try {
      const { city } = req.params;
      if (!city || city.trim().length < 1) {
        return res.status(400).json({ error: 'City name is required' });
      }
      const data = await weatherService.getForecast(city.trim());
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getByCoordinates(req, res, next) {
    try {
      const coords = parseCoords(req, res);
      if (!coords) return;
      const data = await weatherService.getCurrentWeatherByCoords(coords.latNum, coords.lonNum);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getForecastByCoordinates(req, res, next) {
    try {
      const coords = parseCoords(req, res);
      if (!coords) return;
      const data = await weatherService.getForecastByCoords(coords.latNum, coords.lonNum);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getAirQuality(req, res, next) {
    try {
      const coords = parseCoords(req, res);
      if (!coords) return;
      const data = await weatherService.getAirQuality(coords.latNum, coords.lonNum);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async searchCities(req, res, next) {
    try {
      const { q } = req.query;
      if (!q || q.trim().length < 2) {
        return res.status(400).json({ error: 'Search query must be at least 2 characters' });
      }
      const data = await weatherService.searchCities(q.trim());
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = weatherController;
