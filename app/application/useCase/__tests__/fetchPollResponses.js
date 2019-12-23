const faker = require('faker');

const Poll = require('../../../domain/poll');
const PollAnswer = require('../../../domain/pollAnswer');
const createTestDatabase = require('../../../../test/database');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createPollAnswersRepository = require('../../../../test/repositories/pollAnswersRepository');
const createCreatePoll = require('../createPoll');
const createCreatePollResponse = require('../createPollResponse');
const createFetchPollResponses = require('../fetchPollResponses');

test('fetch all poll responses from a poll', async () => {
  const { pollsRepository, pollAnswersRepository } = await setUpSuite();

  const poll = Poll({
    id: faker.random.uuid(),
    options: [faker.lorem.word(), faker.lorem.word()],
    owner: faker.random.uuid(),
    question: faker.lorem.word(),
  });

  const createPoll = createCreatePoll(pollsRepository);
  const createdPoll = await createPoll(poll);

  expect(createdPoll.id).toBe(poll.id);

  const [firstPollAnswer, secondPollAnswer] = [
    PollAnswer({
      option: poll.options[0],
      owner: faker.random.uuid(),
      poll: createdPoll.id,
    }),
    PollAnswer({
      option: poll.options[1],
      owner: faker.random.uuid(),
      poll: createdPoll.id,
    }),
  ];

  const createPollResponse = createCreatePollResponse(pollAnswersRepository);

  const [firstCreatedPollAnswers, secondCreatedPollAnswers] = [
    await createPollResponse(createdPoll, firstPollAnswer),
    await createPollResponse(createdPoll, secondPollAnswer),
  ];

  const fetchPollResponses = createFetchPollResponses(pollAnswersRepository);
  const pollResponses = await fetchPollResponses(createdPoll);

  expect(pollResponses[0].id).toBe(firstCreatedPollAnswers.id);
  expect(pollResponses[1].id).toBe(secondCreatedPollAnswers.id);
});

async function setUpSuite() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const pollAnswersRepository = createPollAnswersRepository(sequelize);

  return { pollsRepository, pollAnswersRepository };
}
