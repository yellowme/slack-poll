const Poll = require('../../../../test/factories/createPoll');
const PollAnswer = require('../../../../test/factories/createPollAnswer');
const createTestDatabase = require('../../../../test/sequelize');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createPollAnswersRepository = require('../../../../test/repositories/pollAnswersRepository');
const createCreatePoll = require('../createPoll');
const createCreatePollResponse = require('../createPollResponse');
const createFetchPollResponses = require('../fetchPollResponses');

async function setupTest() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const pollAnswersRepository = createPollAnswersRepository(sequelize);
  const fetchPollResponses = createFetchPollResponses(pollAnswersRepository);
  const createPollResponse = createCreatePollResponse(pollAnswersRepository);
  const createPoll = createCreatePoll(pollsRepository);

  return {
    createPoll,
    createPollResponse,
    fetchPollResponses,
    pollsRepository,
    pollAnswersRepository,
  };
}

test('fetch all poll responses from a poll', async () => {
  const {
    createPoll,
    createPollResponse,
    fetchPollResponses,
  } = await setupTest();

  // Given
  const poll = Poll();
  const createdPoll = await createPoll(poll);

  const [firstPollAnswer, secondPollAnswer] = [
    PollAnswer({
      option: poll.options[0],
      poll: createdPoll.id,
    }),
    PollAnswer({
      option: poll.options[1],
      poll: createdPoll.id,
    }),
  ];

  const [firstCreatedPollAnswers, secondCreatedPollAnswers] = [
    await createPollResponse(createdPoll, firstPollAnswer),
    await createPollResponse(createdPoll, secondPollAnswer),
  ];

  // When
  const pollResponses = await fetchPollResponses(createdPoll);

  // Then
  expect(pollResponses[0].id).toBe(firstCreatedPollAnswers.id);
  expect(pollResponses[1].id).toBe(secondCreatedPollAnswers.id);
});
