import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import { useWeatherContext } from '../context/WeatherContext';

function groupByDay(list) {
  const days = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });
  return days;
}

function DayCard({ date, items, unit, convertTemp }) {
  const temps = items.map((i) => i.main.temp);
  const high = Math.max(...temps);
  const low = Math.min(...temps);
  const midItem = items[Math.floor(items.length / 2)];
  const icon = midItem.weather[0]?.icon;
  const desc = midItem.weather[0]?.description;

  return (
    <Card
      variant="outlined"
      sx={{ textAlign: 'center', borderRadius: 2, p: 1, height: '100%' }}
    >
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        {date}
      </Typography>
      {icon && (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={desc}
          width={48}
          height={48}
          style={{ display: 'block', margin: '0 auto' }}
        />
      )}
      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize', mb: 0.5 }}>
        {desc}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {convertTemp(high)}° / {convertTemp(low)}°{unit}
      </Typography>
    </Card>
  );
}

export default function Forecast() {
  const { forecast, unit, convertTemp } = useWeatherContext();

  if (!forecast || !forecast.list) return null;

  const grouped = groupByDay(forecast.list);
  // Show up to 5 days, skip today
  const entries = Object.entries(grouped).slice(1, 6);

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          5-Day Forecast
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={1}>
          {entries.map(([date, items]) => (
            <Grid item xs={6} sm={4} md={2.4} key={date}>
              <DayCard
                date={date}
                items={items}
                unit={unit}
                convertTemp={convertTemp}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
