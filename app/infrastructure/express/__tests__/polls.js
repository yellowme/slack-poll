const request = require('supertest');
const faker = require('faker');

const createTestDatabase = require('../../../../test/database');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createPollsPresenter = require('../../../../test/presenters/pollsPresenter');

const createExpressServer = require('../server');

test('rejects with invalid verification token', async () => {
  const { server } = await setUpSuite();

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

  const response = await request(server)
    .post('/polls')
    .send(requestBody);

  expect(response.status).toBe(401);
});

test('creates a poll with slack command', async () => {
  const { server, pollsPresenter } = await setUpSuite();

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

  const response = await request(server)
    .post('/polls')
    .send(requestBody);

  expect(response.status).toBe(201);

  const pollsPresenterCalls = pollsPresenter.send.mock.calls[0][0];
  expect(pollsPresenterCalls.attachments[0].title).toBe(expectedQuestion);
  expect(pollsPresenterCalls.attachments[0].footer).toContain('Mode: Single');
  expect(pollsPresenterCalls.attachments[1].text).toBe(
    `:zero: ${expectedOption} \n\n:one: ${expectedOption} \n\n`
  );
});

test('creates a multioption poll with slack command', async () => {
  const { server, pollsPresenter } = await setUpSuite();

  const slackVerificationToken = 'slack_verification_token';
  const expectedQuestion = faker.lorem.word();
  const expectedOption = faker.lorem.word();
  const slashCommand = `"${expectedQuestion}" "${expectedOption}" "${expectedOption}" -m`; // adds -m flag
  const exctedUserId = faker.random.uuid();
  const expectedSlackChannelId = faker.random.uuid();

  const requestBody = {
    text: slashCommand,
    token: slackVerificationToken,
    user_id: exctedUserId,
    channel_id: expectedSlackChannelId,
  };

  const response = await request(server)
    .post('/polls')
    .send(requestBody);

  expect(response.status).toBe(201);

  const pollsPresenterCalls = pollsPresenter.send.mock.calls[0][0];
  expect(pollsPresenterCalls.attachments[0].title).toBe(expectedQuestion);
  expect(pollsPresenterCalls.attachments[0].footer).toContain('Mode: Multiple');
  expect(pollsPresenterCalls.attachments[1].text).toBe(
    `:zero: ${expectedOption} \n\n:one: ${expectedOption} \n\n`
  );
});

async function setUpSuite() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const pollsPresenter = createPollsPresenter();

  const server = createExpressServer({ pollsRepository, pollsPresenter });

  return { server, pollsRepository, pollsPresenter };
}
