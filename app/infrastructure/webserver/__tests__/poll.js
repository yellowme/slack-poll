const request = require('supertest');
const faker = require('faker');

const createExpressServer = require('../server');

test('creates a poll with slack command', async () => {
  const slackVerificationToken = faker.random.uuid();
  const expectedPollMode = 's'; // single
  const exctedUserId = faker.random.uuid();
  const expectedSlackChannelId = faker.random.uuid();
  const slashCommand = '"⏰" "10:20 - 10-35" "9:50 - 10:05" "9:20 - 9:35"';

  const requestBody = {
    text: slashCommand,
    token: slackVerificationToken,
    user_id: exctedUserId,
    channel_id: expectedSlackChannelId,
  };

  const response = await request(createExpressServer())
    .post('/poll')
    .send(requestBody);

  expect(response.status).toBe(201);
  expect(response.body.text).toBe(requestBody.text);
  expect(response.body.channel).toBe(requestBody.channel_id);
  expect(response.body.mode).toBe(expectedPollMode);
  expect(response.body.owner).toBe(requestBody.user_id);
});
