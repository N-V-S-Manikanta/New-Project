import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { useWeatherContext } from '../context/WeatherContext';

const AQI_LABELS = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const AQI_COLORS = ['', '#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97'];

export default function AirQualityCard() {
  const { airQuality } = useWeatherContext();

  if (!airQuality || !airQuality.list || airQuality.list.length === 0) return null;

  const { aqi, components } = airQuality.list[0];
  const label = AQI_LABELS[aqi] || 'Unknown';
  const color = AQI_COLORS[aqi] || '#aaa';
  const progress = (aqi / 5) * 100;

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Air Quality Index
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#fff">
              {aqi}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {label}
            </Typography>
            <Tooltip title="AQI scale: 1=Good, 5=Very Poor">
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ width: 160, height: 8, borderRadius: 4, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: color } }}
              />
            </Tooltip>
          </Box>
        </Box>
        {components && (
          <Grid container spacing={1}>
            {Object.entries(components).map(([key, val]) => (
              <Grid item xs={6} sm={4} key={key}>
                <Typography variant="caption" color="text.secondary">
                  {key.toUpperCase()}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {val.toFixed(2)} μg/m³
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
