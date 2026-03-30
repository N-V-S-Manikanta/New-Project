import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useWeatherContext } from '../context/WeatherContext';

function InfoItem({ icon, label, value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  );
}

function formatTime(unixTs) {
  return new Date(unixTs * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function WeatherCard() {
  const { currentWeather, unit, convertTemp, saveLocation, removeLocation, savedLocations } =
    useWeatherContext();

  if (!currentWeather) return null;

  const { name, sys, main, weather, wind, visibility, clouds } = currentWeather;
  const description = weather[0]?.description;
  const iconCode = weather[0]?.icon;
  const isSaved = savedLocations.some((l) => l.name === name);

  function handleToggleSave() {
    if (isSaved) {
      removeLocation(name);
    } else {
      saveLocation({
        name,
        country: sys.country,
        lat: currentWeather.coord.lat,
        lon: currentWeather.coord.lon,
      });
    }
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {name}, {sys.country}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {iconCode && (
              <img
                src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
                alt={description}
                width={64}
                height={64}
              />
            )}
            <Tooltip title={isSaved ? 'Remove from favorites' : 'Save location'}>
              <IconButton onClick={handleToggleSave} color="primary">
                {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="h2" fontWeight={700} sx={{ my: 1 }}>
          {convertTemp(main.temp)}°{unit}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Feels like {convertTemp(main.feels_like)}°{unit} &nbsp;|&nbsp; High:{' '}
          {convertTemp(main.temp_max)}°{unit} &nbsp;|&nbsp; Low: {convertTemp(main.temp_min)}°{unit}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={<WaterDropIcon fontSize="small" color="info" />}
              label="Humidity"
              value={`${main.humidity}%`}
            />
            <InfoItem
              icon={<AirIcon fontSize="small" color="action" />}
              label="Wind"
              value={`${wind.speed} m/s`}
            />
            <InfoItem
              icon={<CompressIcon fontSize="small" color="action" />}
              label="Pressure"
              value={`${main.pressure} hPa`}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={<VisibilityIcon fontSize="small" color="action" />}
              label="Visibility"
              value={`${((visibility || 0) / 1000).toFixed(1)} km`}
            />
            <InfoItem
              icon={<WbSunnyIcon fontSize="small" color="warning" />}
              label="Sunrise"
              value={formatTime(sys.sunrise)}
            />
            <InfoItem
              icon={<DarkModeIcon fontSize="small" color="action" />}
              label="Sunset"
              value={formatTime(sys.sunset)}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 1 }}>
          <Chip
            label={`Clouds: ${clouds?.all ?? 0}%`}
            size="small"
            variant="outlined"
            sx={{ mr: 1 }}
          />
          {wind.gust && (
            <Chip label={`Gusts: ${wind.gust} m/s`} size="small" variant="outlined" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
