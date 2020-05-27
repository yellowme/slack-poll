const request = require('supertest');
const faker = require('faker');
const app = require('../app');
const { PollMode } = require('../app/poll');
const createPoll = require('../services/createPoll');

test('rejects with invalid verification token', async () => {
  const slackVerificationToken = faker.lorem.word();
  const expectedQuestion = faker.lorem.word();
  const expectedOption = faker.lorem.word();
  const slashCommand = `"${expectedQuestion}" "${expectedOption}" "${expectedOption}"`;
  const exctedUserId = faker.random.uuid();
  const expectedSlackChannelId = faker.random.uuid();

  const requestBody = {
    text: slashCommand,
    token: slackVerificationToken,
    user_id: exctedUserId,
    channel_id: expectedSlackChannelId,
  };

  const response = await request(app).post('/polls').send(requestBody);

  expect(response.status).toBe(403);
});

test('creates a poll with slack command', async () => {
  // Given
  const slackVerificationToken = 'slack_verification_token';
  const expectedQuestion = faker.lorem.word();
  const expectedOption = faker.lorem.word();
  const slashCommand = `"${expectedQuestion}" "${expectedOption}" "${expectedOption}"`;
  const exctedUserId = faker.random.uuid();
  const expectedSlackChannelId = faker.random.uuid();

  const requestBody = {
    text: slashCommand,
    token: slackVerificationToken,
    user_id: exctedUserId,
    channel_id: expectedSlackChannelId,
  };

  // When
  const response = await request(app).post('/polls').send(requestBody);

  // Then
  expect(response.status).toBe(201);
});

test('creates a multioption poll with slack command', async () => {
  // Given
  const slackVerificationToken = 'slack_verification_token';
  const expectedQuestion = faker.lorem.word();
  const expectedOption = faker.lorem.word();
  const slashCommand = `"${expectedQuestion}" "${expectedOption}" "${expectedOption}" -m`;
  const exctedUserId = faker.random.uuid();
  const expectedSlackChannelId = faker.random.uuid();

  const requestBody = {
    text: slashCommand,
    token: slackVerificationToken,
    user_id: exctedUserId,
    channel_id: expectedSlackChannelId,
  };

  // When
  const response = await request(app).post('/polls').send(requestBody);

  // Then
  expect(response.status).toBe(201);
});
