import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Box,
  Button,
  Alert,
  Skeleton,
  Snackbar,
  Tooltip,
} from '@mui/material';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import ThermostatIcon from '@mui/icons-material/Thermostat';

import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import Forecast from '../components/Forecast';
import AlertPanel from '../components/AlertPanel';
import FavoritesList from '../components/FavoritesList';
import AirQualityCard from '../components/AirQualityCard';
import TemperatureChart from '../components/TemperatureChart';
import ThemeToggle from '../components/ThemeToggle';
import { useWeatherContext } from '../context/WeatherContext';

export default function Dashboard() {
  const {
    loading,
    error,
    currentWeather,
    fetchWeather,
    fetchWeatherByCoords,
    toggleUnit,
    unit,
    setError,
  } = useWeatherContext();

  // Auto-load London on first render for demo
  useEffect(() => {
    fetchWeather('London');
  }, [fetchWeather]);

  function handleSearch(city) {
    fetchWeather(city);
  }

  function handleGeolocate() {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // silently fail; user can still use search
      }
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* App Bar */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <WbCloudyIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 0, mr: 2 }}>
            Weather Dashboard
          </Typography>

          <Box sx={{ flexGrow: 1, maxWidth: 480 }}>
            <SearchBar onSearch={handleSearch} onGeolocate={handleGeolocate} />
          </Box>

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Toggle temperature unit">
              <Button
                variant="outlined"
                size="small"
                color="inherit"
                onClick={toggleUnit}
                startIcon={<ThermostatIcon />}
                sx={{ borderColor: 'rgba(255,255,255,0.5)', minWidth: 64 }}
              >
                °{unit}
              </Button>
            </Tooltip>
            <ThemeToggle />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3, flexGrow: 1 }}>
        {/* Error snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Alerts */}
        <AlertPanel />

        <Grid container spacing={3} sx={{ mt: 0 }}>
          {/* Left column */}
          <Grid item xs={12} md={4} lg={3}>
            <Grid container spacing={2} direction="column">
              {/* Current Weather */}
              <Grid item>
                {loading ? (
                  <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
                ) : (
                  <WeatherCard />
                )}
              </Grid>
              {/* Favorites */}
              <Grid item>
                <FavoritesList />
              </Grid>
            </Grid>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={8} lg={9}>
            <Grid container spacing={2}>
              {/* Forecast */}
              <Grid item xs={12}>
                {loading ? (
                  <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
                ) : (
                  <Forecast />
                )}
              </Grid>

              {/* Temperature Chart */}
              <Grid item xs={12} md={8}>
                {loading ? (
                  <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
                ) : (
                  <TemperatureChart />
                )}
              </Grid>

              {/* Air Quality */}
              <Grid item xs={12} md={4}>
                {loading ? (
                  <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
                ) : (
                  <AirQualityCard />
                )}
              </Grid>

              {/* No data state */}
              {!loading && !currentWeather && !error && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    Search for a city to see weather data.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          mt: 'auto',
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Weather data powered by{' '}
          <a
            href="https://openweathermap.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeatherMap
          </a>
        </Typography>
      </Box>
    </Box>
  );
}
