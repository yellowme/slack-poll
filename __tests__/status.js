const request = require('supertest');
const app = require('../app');

test('respons with ok', async () => {
  const response = await request(app).get('/status');
  expect(response.status).toBe(200);
  expect(response.body.on).toBe(true);
});
