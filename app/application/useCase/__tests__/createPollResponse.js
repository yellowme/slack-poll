const faker = require('faker');

const Poll = require('../../../domain/poll');
const PollAnswer = require('../../../domain/pollAnswer');
const createTestDatabase = require('../../../../test/database');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createPollAnswersRepository = require('../../../../test/repositories/pollAnswersRepository');
const createCreatePollUseCase = require('../createPoll');
const createCreatePollResponseUseCase = require('../createPollResponse');

test('creates a poll and adds a poll response', async () => {
  const { createPoll, createPollResponse } = await testSetup();

  const poll = Poll({
    options: [faker.lorem.word(), faker.lorem.word()],
    owner: faker.random.uuid(),
    question: faker.lorem.word(),
  });

  const createdPoll = await createPoll(poll);
  expect(createdPoll.question).toBe(poll.question);

  const [selectedPollAnswerValue] = poll.options;
  const pollAnswer = PollAnswer({
    option: selectedPollAnswerValue,
    owner: faker.random.uuid(),
    poll: createdPoll.id,
  });

  const createdPollAnswer = await createPollResponse(pollAnswer);
  expect(poll.options.includes(createdPollAnswer.option)).toBe(true);
  expect(createdPollAnswer.poll).toBe(poll.id);
});

async function testSetup() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const pollAnswersRepository = createPollAnswersRepository(sequelize);

  const createPoll = createCreatePollUseCase(pollsRepository);
  const createPollResponse = createCreatePollResponseUseCase(
    pollAnswersRepository
  );

  return { createPoll, createPollResponse };
}
