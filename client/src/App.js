import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { WeatherProvider, useWeatherContext } from './context/WeatherContext';
import Dashboard from './pages/Dashboard';

function ThemedApp() {
  const { theme } = useWeatherContext();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: { main: '#1976d2' },
      secondary: { main: '#f57c00' },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <ThemedApp />
    </WeatherProvider>
  );
}
