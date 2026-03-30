const axios = require('axios');
const cache = require('../config/cache');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const API_KEY = process.env.OPENWEATHER_API_KEY;

function buildParams(extra = {}) {
  return { appid: API_KEY, units: 'metric', ...extra };
}

const weatherService = {
  async getCurrentWeather(city) {
    const cacheKey = `current:${city.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: buildParams({ q: city }),
    });
    cache.set(cacheKey, response.data);
    return response.data;
  },

  async getCurrentWeatherByCoords(lat, lon) {
    const cacheKey = `current:${lat},${lon}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: buildParams({ lat, lon }),
    });
    cache.set(cacheKey, response.data);
    return response.data;
  },

  async getForecast(city) {
    const cacheKey = `forecast:${city.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: buildParams({ q: city, cnt: 40 }),
    });
    cache.set(cacheKey, response.data);
    return response.data;
  },

  async getForecastByCoords(lat, lon) {
    const cacheKey = `forecast:${lat},${lon}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: buildParams({ lat, lon, cnt: 40 }),
    });
    cache.set(cacheKey, response.data);
    return response.data;
  },

  async getAirQuality(lat, lon) {
    const cacheKey = `aqi:${lat},${lon}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: buildParams({ lat, lon }),
    });
    cache.set(cacheKey, response.data);
    return response.data;
  },

  async searchCities(query) {
    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const response = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit: 5, appid: API_KEY },
    });
    cache.set(cacheKey, response.data);
    return response.data;
  },
};

module.exports = weatherService;
