const faker = require('faker');

const Poll = require('../../../../test/factories/createPoll');
const PollAnswer = require('../../../../test/factories/createPollAnswer');
const createTestDatabase = require('../../../../test/sequelize');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createPollAnswersRepository = require('../../../../test/repositories/pollAnswersRepository');
const createCreatePollUseCase = require('../createPoll');
const createCreatePollResponseUseCase = require('../createPollResponse');
const InvalidPollOptionError = require('../../errors/InvalidPollOptionError');

async function setupTest() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const pollAnswersRepository = createPollAnswersRepository(sequelize);

  const createPoll = createCreatePollUseCase(pollsRepository);
  const createPollResponse = createCreatePollResponseUseCase(
    pollAnswersRepository
  );

  return { pollAnswersRepository, createPoll, createPollResponse };
}

test('adds a poll response to a given poll', async () => {
  const {
    createPoll,
    createPollResponse,
    pollAnswersRepository,
  } = await setupTest();

  // Given
  const poll = Poll();
  const createdPoll = await createPoll(poll);
  const [selectedPollAnswerValue] = poll.options;

  const pollAnswer = PollAnswer({
    option: selectedPollAnswerValue,
    poll: createdPoll.id,
  });

  // When
  const createdPollAnswer = await createPollResponse(createdPoll, pollAnswer);

  // Then
  expect(poll.options.includes(createdPollAnswer.option)).toBe(true);
  expect(createdPollAnswer.poll).toBe(createdPoll.id);

  // Then
  const allPollAnswers = await pollAnswersRepository.find({
    option: selectedPollAnswerValue,
    poll: createdPoll.id,
  });

  expect(allPollAnswers.length).toBe(1);
});

test('replaces response if tries to add another response to same poll', async () => {
  const {
    createPoll,
    createPollResponse,
    pollAnswersRepository,
  } = await setupTest();

  // Given
  const answerOwner = faker.random.uuid();

  const poll = Poll();
  const createdPoll = await createPoll(poll);
  const [selectedPollAnswerValue, updatedPollAnswerValue] = poll.options;

  const firstPollAnswer = PollAnswer({
    option: selectedPollAnswerValue,
    owner: answerOwner,
    poll: createdPoll.id,
  });

  await createPollResponse(createdPoll, firstPollAnswer);

  const secondPollAnswer = PollAnswer({
    option: updatedPollAnswerValue,
    owner: answerOwner,
    poll: createdPoll.id,
  });

  // When
  const createdPollAnswer = await createPollResponse(
    createdPoll,
    secondPollAnswer
  );

  // Then
  expect(poll.options.includes(createdPollAnswer.option)).toBe(true);
  expect(createdPollAnswer.option).toBe(updatedPollAnswerValue);
  expect(createdPollAnswer.poll).toBe(createdPoll.id);

  // Then
  const allPollAnswers = await pollAnswersRepository.find({
    owner: answerOwner,
    poll: createdPoll.id,
  });

  expect(allPollAnswers.length).toBe(1);
});

test('delete response if tries to add another response with de same option and same poll', async () => {
  const {
    createPoll,
    createPollResponse,
    pollAnswersRepository,
  } = await setupTest();

  // Given
  const answerOwner = faker.random.uuid();

  const poll = Poll();
  const createdPoll = await createPoll(poll);
  const [selectedPollAnswerValue] = poll.options;

  const firstPollAnswer = PollAnswer({
    option: selectedPollAnswerValue,
    owner: answerOwner,
    poll: createdPoll.id,
  });

  await createPollResponse(createdPoll, firstPollAnswer);

  // When
  await createPollResponse(createdPoll, firstPollAnswer);

  // Then
  const allPollAnswers = await pollAnswersRepository.find({
    owner: answerOwner,
    poll: createdPoll.id,
  });

  expect(allPollAnswers.length).toBe(0);
});

test('adds two poll responses to a given poll', async () => {
  const {
    createPoll,
    createPollResponse,
    pollAnswersRepository,
  } = await setupTest();

  // Given
  const answerOwner = faker.random.uuid();

  const poll = Poll({ mode: 'm' });
  const createdPoll = await createPoll(poll);

  const [
    firstSelectedPollAnswerValue,
    secondSelectedPollAnswerValue,
  ] = poll.options;

  const [firstPollAnswer, secondPollAnswer] = [
    PollAnswer({
      option: firstSelectedPollAnswerValue,
      owner: answerOwner,
      poll: createdPoll.id,
    }),
    PollAnswer({
      option: secondSelectedPollAnswerValue,
      owner: answerOwner,
      poll: createdPoll.id,
    }),
  ];

  // When
  const [firstCreatedPollAnswers, secondCreatedPollAnswers] = [
    await createPollResponse(createdPoll, firstPollAnswer),
    await createPollResponse(createdPoll, secondPollAnswer),
  ];

  // Then
  expect(poll.options.includes(firstCreatedPollAnswers.option)).toBe(true);
  expect(poll.options.includes(secondCreatedPollAnswers.option)).toBe(true);

  expect(firstCreatedPollAnswers.option).toBe(firstSelectedPollAnswerValue);
  expect(firstCreatedPollAnswers.owner).toBe(answerOwner);
  expect(firstCreatedPollAnswers.poll).toBe(createdPoll.id);

  expect(secondCreatedPollAnswers.option).toBe(secondSelectedPollAnswerValue);
  expect(secondCreatedPollAnswers.owner).toBe(answerOwner);
  expect(secondCreatedPollAnswers.poll).toBe(createdPoll.id);

  // Then
  const allPollAnswers = await pollAnswersRepository.find({
    owner: answerOwner,
    poll: createdPoll.id,
  });

  expect(allPollAnswers.length).toBe(2);
});

test('fails to create poll answer with invalid poll option', async () => {
  const { createPoll, createPollResponse } = await setupTest();

  // Given
  const poll = Poll();
  const createdPoll = await createPoll(poll);

  const pollAnswer = PollAnswer({
    option: faker.lorem.word(),
    poll: createdPoll.id,
  });

  // When
  try {
    await createPollResponse(createdPoll, pollAnswer);
  } catch (error) {
    // Then
    expect(error).toBeInstanceOf(InvalidPollOptionError);
    expect(error.message).toBe(`${pollAnswer.option} is not a valid option.`);
  }
});
