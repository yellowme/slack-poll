const request = require('supertest');
const faker = require('faker');

const createTestDatabase = require('../../../../test/database');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createPollAnswersRepository = require('../../../../test/repositories/pollAnswersRepository');
const createPollsPresenter = require('../../../../test/presenters/pollsPresenter');
const createExpressServer = require('../server');

test('rejects with invalid verification token', async () => {
  const { server } = await setUpSuite();

  const slackVerificationToken = faker.random.uuid();
  const expectedOption = faker.lorem.word();
  const userId = faker.random.uuid();
  const pollId = faker.random.uuid();

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: userId,
      },
      callback_id: pollId,
      actions: [
        {
          value: expectedOption,
        },
      ],
    }),
  };

  const response = await request(server)
    .post('/hook')
    .send(requestBody);

  expect(response.status).toBe(401);
});

test('add poll answer by calling slack interactive components', async () => {
  const { server, pollsRepository, pollAnswersRepository } = await setUpSuite();

  const slackVerificationToken = 'slack_verification_token';
  const expectedQuestion = faker.lorem.word();
  const expectedOption = faker.lorem.word();
  const slashCommand = `"${expectedQuestion}" "${expectedOption}" "${expectedOption}"`;
  const exctedUserId = faker.random.uuid();
  const expectedSlackChannelId = faker.random.uuid();

  await request(server)
    .post('/polls')
    .send({
      text: slashCommand,
      token: slackVerificationToken,
      user_id: exctedUserId,
      channel_id: expectedSlackChannelId,
    });

  const [lastCreatedPoll] = await pollsRepository.find();

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: exctedUserId,
      },
      callback_id: lastCreatedPoll.id,
      actions: [
        {
          value: expectedOption,
        },
      ],
    }),
  };

  const response = await request(server)
    .post('/hook')
    .send(requestBody);

  expect(response.status).toBe(201);

  const pollAnswers = await pollAnswersRepository.find({
    option: expectedOption,
    owner: exctedUserId,
  });

  expect(pollAnswers.length).toBe(1);

  const [lastPollAnswer] = pollAnswers;
  expect(lastPollAnswer.option).toBe(expectedOption);
  expect(lastPollAnswer.owner).toBe(exctedUserId);
  expect(lastPollAnswer.poll).toBe(lastCreatedPoll.id);
});

async function setUpSuite() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const pollAnswersRepository = createPollAnswersRepository(sequelize);
  const pollsPresenter = createPollsPresenter();

  const server = createExpressServer({
    pollsRepository,
    pollAnswersRepository,
    pollsPresenter,
  });

  return { server, pollsRepository, pollAnswersRepository };
}
