import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useWeatherContext } from '../context/WeatherContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function TemperatureChart() {
  const { forecast, unit, convertTemp, theme } = useWeatherContext();

  const chartData = useMemo(() => {
    if (!forecast || !forecast.list) return null;
    const items = forecast.list.slice(0, 16); // next ~48 hours
    const labels = items.map((item) =>
      new Date(item.dt * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        hour12: false,
      })
    );
    const temps = items.map((item) => convertTemp(item.main.temp));
    const feels = items.map((item) => convertTemp(item.main.feels_like));
    return { labels, temps, feels };
  }, [forecast, convertTemp]);

  if (!chartData) return null;

  const textColor = theme === 'dark' ? '#eee' : '#333';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: `Temperature (°${unit})`,
        data: chartData.temps,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25,118,210,0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: `Feels Like (°${unit})`,
        data: chartData.feels,
        borderColor: '#f57c00',
        backgroundColor: 'rgba(245,124,0,0.08)',
        fill: false,
        tension: 0.4,
        pointRadius: 2,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { labels: { color: textColor } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        ticks: { color: textColor, maxTicksLimit: 8 },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Temperature Trend (48h)
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
}
