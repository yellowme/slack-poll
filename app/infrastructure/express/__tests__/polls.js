const request = require('supertest');
const faker = require('faker');

const createTestDatabase = require('../../../../test/database');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createPollsPresenter = require('../../../../test/presenters/pollsPresenter');

const createExpressServer = require('../server');

test('creates a poll with slack command', async () => {
  const { server, pollsPresenter, pollsRepository } = await setUpSuite();

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
  expect(pollsPresenterCalls.attachments[1].text).toBe(
    `:zero: ${expectedOption} \n\n:one: ${expectedOption} \n\n`
  );

  const pollsRepositoryInsertCalls = pollsRepository.insert.mock.calls[0][0];
  expect(pollsRepositoryInsertCalls.question).toBe(expectedQuestion);
  expect(pollsRepositoryInsertCalls.options[0]).toBe(expectedOption);
});

async function setUpSuite() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const pollsPresenter = createPollsPresenter();

  const server = createExpressServer({ pollsRepository, pollsPresenter });

  return { server, pollsRepository, pollsPresenter };
}
