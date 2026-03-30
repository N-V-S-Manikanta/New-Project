import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useWeatherContext } from '../context/WeatherContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useWeatherContext();

  return (
    <Tooltip title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
        {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
