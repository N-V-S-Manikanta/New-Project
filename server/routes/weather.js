const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// GET /api/weather/current/:city
router.get('/current/:city', weatherController.getCurrentByCity);

// GET /api/weather/forecast/:city
router.get('/forecast/:city', weatherController.getForecastByCity);

// GET /api/weather/coordinates?lat=X&lon=Y
router.get('/coordinates', weatherController.getByCoordinates);

// GET /api/weather/forecast/coordinates?lat=X&lon=Y
router.get('/forecast/coordinates', weatherController.getForecastByCoordinates);

// GET /api/weather/aqi?lat=X&lon=Y
router.get('/aqi', weatherController.getAirQuality);

// GET /api/weather/search?q=query
router.get('/search', weatherController.searchCities);

module.exports = router;
