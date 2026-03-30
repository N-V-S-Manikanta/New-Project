# Weather Dashboard

A comprehensive full-stack weather dashboard that fetches real-time weather data from the OpenWeatherMap API and displays it in an intuitive, responsive interface.

## Features

### Frontend (React)
- �� Current weather conditions (temperature, humidity, wind, pressure, visibility)
- 📅 5-day weather forecast with icons
- 📈 Temperature trend chart (48-hour)
- 🌬 Air Quality Index (AQI) with pollutant breakdown
- 🔍 City search with autocomplete suggestions
- 📍 Geolocation support (use current location)
- ⭐ Save/remove favorite locations (persisted in localStorage)
- 🌡 Temperature unit toggle (Celsius / Fahrenheit)
- 🌙 Dark / Light theme toggle
- 🚨 Weather alerts (heat, cold, wind, visibility warnings)
- ⏰ Sunrise & sunset times

### Backend (Express.js)
- RESTful API with rate limiting and CORS
- In-memory caching to reduce API calls
- Input validation and comprehensive error handling
- Secure headers via Helmet

## Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React 18, Material-UI, Chart.js      |
| Backend    | Node.js, Express.js                  |
| Weather API| OpenWeatherMap                       |
| Caching    | In-memory (Map)                      |
| Testing    | Jest, Supertest                      |

## Getting Started

### Prerequisites
- Node.js 18+
- A free [OpenWeatherMap API key](https://openweathermap.org/api)

### Installation

```bash
# Clone the repo
git clone https://github.com/N-V-S-Manikanta/New-Project.git
cd New-Project

# Install all dependencies (backend + frontend)
npm run install-all
```

### Configuration

```bash
cp .env.example .env
# Edit .env and add your OpenWeatherMap API key
```

### Running Locally

```bash
# Terminal 1 – Backend (port 5000)
npm run dev

# Terminal 2 – Frontend (port 3000)
npm run client
```

Open **http://localhost:3000** in your browser.

### Running Tests

```bash
npm test
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/weather/current/:city` | Current weather by city |
| GET | `/api/weather/forecast/:city` | 5-day forecast by city |
| GET | `/api/weather/coordinates?lat=X&lon=Y` | Current weather by coordinates |
| GET | `/api/weather/forecast/coordinates?lat=X&lon=Y` | Forecast by coordinates |
| GET | `/api/weather/aqi?lat=X&lon=Y` | Air Quality Index |
| GET | `/api/weather/search?q=query` | City search suggestions |

## Project Structure

```
weather-dashboard/
├── server/
│   ├── config/cache.js
│   ├── controllers/weatherController.js
│   ├── middleware/errorHandler.js
│   ├── routes/weather.js
│   ├── services/weatherService.js
│   └── index.js
├── client/
│   ├── public/index.html
│   └── src/
│       ├── components/
│       │   ├── WeatherCard.js
│       │   ├── Forecast.js
│       │   ├── SearchBar.js
│       │   ├── FavoritesList.js
│       │   ├── AlertPanel.js
│       │   ├── ThemeToggle.js
│       │   ├── AirQualityCard.js
│       │   └── TemperatureChart.js
│       ├── context/WeatherContext.js
│       ├── pages/Dashboard.js
│       ├── services/weatherApi.js
│       ├── App.js
│       └── index.js
├── tests/
│   ├── index.test.js
│   └── server.test.js
├── .env.example
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | — |
| `CACHE_TTL_SECONDS` | Cache time-to-live in seconds | `600` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:3000` |
| `REACT_APP_API_URL` | Backend API base URL for React | `/api/weather` |

## License

MIT
