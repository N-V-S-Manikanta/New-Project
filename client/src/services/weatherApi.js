import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api/weather';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const weatherApi = {
  getCurrentWeather(city) {
    return api.get(`/current/${encodeURIComponent(city)}`);
  },
  getForecast(city) {
    return api.get(`/forecast/${encodeURIComponent(city)}`);
  },
  getWeatherByCoords(lat, lon) {
    return api.get('/coordinates', { params: { lat, lon } });
  },
  getForecastByCoords(lat, lon) {
    return api.get('/forecast/coordinates', { params: { lat, lon } });
  },
  getAirQuality(lat, lon) {
    return api.get('/aqi', { params: { lat, lon } });
  },
  searchCities(query) {
    return api.get('/search', { params: { q: query } });
  },
};

export default weatherApi;
