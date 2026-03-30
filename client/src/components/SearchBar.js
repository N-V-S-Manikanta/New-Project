import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  ClickAwayListener,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import weatherApi from '../services/weatherApi';

export default function SearchBar({ onSearch, onGeolocate }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sugLoading, setSugLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceTimer = useRef(null);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceTimer.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceTimer.current = setTimeout(async () => {
      setSugLoading(true);
      try {
        const res = await weatherApi.searchCities(val.trim());
        setSuggestions(res.data || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSugLoading(false);
      }
    }, 400);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setSuggestions([]);
      setOpen(false);
    }
  }

  function handleSuggestionClick(s) {
    const city = `${s.name}${s.country ? `, ${s.country}` : ''}`;
    setQuery(city);
    setSuggestions([]);
    setOpen(false);
    onSearch(s.name);
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 480 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            value={query}
            onChange={handleChange}
            placeholder="Search city..."
            variant="outlined"
            size="small"
            aria-label="Search city"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {sugLoading && <CircularProgress size={18} />}
                  <IconButton
                    aria-label="Use my location"
                    onClick={onGeolocate}
                    size="small"
                  >
                    <MyLocationIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        {open && suggestions.length > 0 && (
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1300,
              maxHeight: 240,
              overflowY: 'auto',
            }}
          >
            <List dense>
              {suggestions.map((s, i) => (
                <ListItem
                  key={`${s.name}-${s.lat}-${i}`}
                  onClick={() => handleSuggestionClick(s)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <ListItemText
                    primary={`${s.name}${s.state ? `, ${s.state}` : ''}`}
                    secondary={s.country}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
