const request = require('supertest');
const faker = require('faker');

const createTestDatabase = require('../../../../jest/createTestDatabase');
const createTestSlackApi = require('../../../../jest/createTestSlackApi');
const createExpressServer = require('../server');

test('creates a poll with slack command', async () => {
  const sequelizeInstance = await createTestDatabase();
  const slackInstance = createTestSlackApi();

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

  const server = createExpressServer(sequelizeInstance, slackInstance);
  const response = await request(server)
    .post('/poll')
    .send(requestBody);

  expect(response.status).toBe(201);
});
