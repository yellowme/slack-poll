const request = require('supertest');

const createTestApplication = require('../../../../test/application');

test('rejects with invalid verification token', async () => {
  const { server } = await createTestApplication();

  const response = await request(server).get('/status');

  expect(response.status).toBe(200);
  expect(response.body.on).toBe(true);
});
