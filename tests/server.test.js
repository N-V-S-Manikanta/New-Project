const request = require('supertest');
const app = require('../server/index');

describe('Weather API endpoints', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/weather/current/:city returns 400 for empty city', async () => {
    const res = await request(app).get('/api/weather/current/ ');
    expect([400, 404]).toContain(res.status);
  });

  test('GET /api/weather/coordinates returns 400 when lat/lon missing', async () => {
    const res = await request(app).get('/api/weather/coordinates');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/weather/coordinates returns 400 for invalid numbers', async () => {
    const res = await request(app).get('/api/weather/coordinates?lat=abc&lon=xyz');
    expect(res.status).toBe(400);
  });

  test('GET /api/weather/search returns 400 for short query', async () => {
    const res = await request(app).get('/api/weather/search?q=a');
    expect(res.status).toBe(400);
  });

  test('GET /api/weather/aqi returns 400 when lat/lon missing', async () => {
    const res = await request(app).get('/api/weather/aqi');
    expect(res.status).toBe(400);
  });

  test('GET /unknown returns 404', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
  });
});
