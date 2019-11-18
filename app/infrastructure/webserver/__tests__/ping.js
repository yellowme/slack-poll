const request = require('supertest');

const createExpressServer = require('../server');

test('get server response to be online', async () => {
  const response = await request(createExpressServer()).get('/ping');
  expect(response.status).toBe(200);
  expect(response.body.on).toBe(true);
});
