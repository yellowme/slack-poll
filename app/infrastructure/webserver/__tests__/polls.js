const request = require('supertest');
const faker = require('faker');

const createTestDatabase = require('../../../../test/database');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createPollsPresenter = require('../../../../test/presenters/pollsPresenter');

const createExpressServer = require('../server');

// TODO: move to test folder
async function setUpSuite() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const pollsPresenter = createPollsPresenter();

  const server = createExpressServer({ pollsRepository, pollsPresenter });

  return { server, pollsRepository, pollsPresenter };
}

test('creates a poll with slack command', async () => {
  const { server, pollsPresenter, pollsRepository } = await setUpSuite();

  const expectedQuestion = faker.lorem.word();
  const expectedOption = faker.lorem.word();
  const slashCommand = `"${expectedQuestion}" "${expectedOption}" "${expectedOption}"`;
  const slackVerificationToken = faker.random.uuid();
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
  expect(pollsPresenter.send.mock.calls[0][0].attachments[0].title).toBe(
    expectedQuestion
  );
  expect(pollsPresenter.send.mock.calls[0][0].attachments[1].title).toBe(
    [expectedOption, expectedOption].join(', ')
  );
  expect(pollsRepository.insert.mock.calls[0][0].question).toBe(
    expectedQuestion
  );
  expect(pollsRepository.insert.mock.calls[0][0].options[0]).toBe(
    expectedOption
  );
});
