import React from 'react';
import { Alert, Stack, Collapse } from '@mui/material';
import { useWeatherContext } from '../context/WeatherContext';

export default function AlertPanel() {
  const { alerts } = useWeatherContext();

  if (!alerts || alerts.length === 0) return null;

  return (
    <Collapse in={alerts.length > 0}>
      <Stack spacing={1}>
        {alerts.map((alert, i) => (
          <Alert key={i} severity={alert.type === 'warning' ? 'warning' : 'info'} variant="filled">
            {alert.message}
          </Alert>
        ))}
      </Stack>
    </Collapse>
  );
}
