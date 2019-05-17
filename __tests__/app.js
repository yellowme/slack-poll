const request = require('supertest');

const app = require('../index');

describe('express poll server', () => {
  it('GET /ping', async () => {
    const response = await request(app).get('/ping');
    expect(response.body.on).toBe(true);
  });
});
