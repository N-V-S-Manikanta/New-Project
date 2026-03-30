import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useWeatherContext } from '../context/WeatherContext';

export default function FavoritesList() {
  const { savedLocations, removeLocation, fetchWeather } = useWeatherContext();

  if (!savedLocations || savedLocations.length === 0) return null;

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Saved Locations
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <List dense>
          {savedLocations.map((loc) => (
            <ListItem
              key={loc.name}
              sx={{ cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
              onClick={() => fetchWeather(loc.name)}
            >
              <Box sx={{ mr: 1, color: 'primary.main' }}>
                <LocationOnIcon fontSize="small" />
              </Box>
              <ListItemText
                primary={loc.name}
                secondary={loc.country}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLocation(loc.name);
                  }}
                  aria-label={`Remove ${loc.name}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
