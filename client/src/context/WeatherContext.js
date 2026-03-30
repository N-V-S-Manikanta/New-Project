import React, { createContext, useContext, useState, useCallback } from 'react';
import weatherApi from '../services/weatherApi';

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedLocations, setSavedLocations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('savedLocations') || '[]');
    } catch {
      return [];
    }
  });
  const [alerts, setAlerts] = useState([]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  const convertTemp = useCallback(
    (celsius) => {
      if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
      return Math.round(celsius);
    },
    [unit]
  );

  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        weatherApi.getCurrentWeather(city),
        weatherApi.getForecast(city),
      ]);
      setCurrentWeather(currentRes.data);
      setForecast(forecastRes.data);

      // Fetch AQI using coordinates from current weather
      const { lat, lon } = currentRes.data.coord;
      try {
        const aqiRes = await weatherApi.getAirQuality(lat, lon);
        setAirQuality(aqiRes.data);
      } catch {
        setAirQuality(null);
      }

      // Generate alerts based on weather conditions
      generateAlerts(currentRes.data);
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Failed to fetch weather data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        weatherApi.getWeatherByCoords(lat, lon),
        weatherApi.getForecastByCoords(lat, lon),
      ]);
      setCurrentWeather(currentRes.data);
      setForecast(forecastRes.data);

      try {
        const aqiRes = await weatherApi.getAirQuality(lat, lon);
        setAirQuality(aqiRes.data);
      } catch {
        setAirQuality(null);
      }

      generateAlerts(currentRes.data);
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Failed to fetch weather data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // API always returns temperature in Celsius (units=metric); thresholds are in °C
  function generateAlerts(data) {
    const newAlerts = [];
    if (data.main) {
      if (data.main.temp > 40) newAlerts.push({ type: 'warning', message: 'Extreme heat warning!' });
      if (data.main.temp < 0) newAlerts.push({ type: 'warning', message: 'Freezing temperatures!' });
      if (data.wind && data.wind.speed > 20)
        newAlerts.push({ type: 'info', message: 'High wind advisory.' });
      if (data.visibility !== undefined && data.visibility < 1000)
        newAlerts.push({ type: 'warning', message: 'Low visibility conditions.' });
    }
    setAlerts(newAlerts);
  }

  const saveLocation = useCallback((location) => {
    setSavedLocations((prev) => {
      const exists = prev.find((l) => l.name === location.name);
      if (exists) return prev;
      const updated = [...prev, location];
      localStorage.setItem('savedLocations', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeLocation = useCallback((name) => {
    setSavedLocations((prev) => {
      const updated = prev.filter((l) => l.name !== name);
      localStorage.setItem('savedLocations', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        theme,
        unit,
        currentWeather,
        forecast,
        airQuality,
        loading,
        error,
        savedLocations,
        alerts,
        toggleTheme,
        toggleUnit,
        convertTemp,
        fetchWeather,
        fetchWeatherByCoords,
        saveLocation,
        removeLocation,
        setError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used inside WeatherProvider');
  return ctx;
}

export default WeatherContext;
