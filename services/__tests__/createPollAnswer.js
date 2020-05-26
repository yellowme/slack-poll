const faker = require('faker');
const { PollMode } = require('../../app/poll');
const createPoll = require('../createPoll');
const createPollAnswer = require('../createPollAnswer');
const fetchPollAnswers = require('../fetchPollAnswers');

test('adds a poll response to a given poll', async () => {
  // Given
  const owner = faker.random.uuid();
  const poll = {
    owner,
    mode: PollMode.SINGLE,
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const [option] = poll.options;
  const createdPoll = await createPoll(poll);

  const pollAnswer = {
    owner,
    option,
    poll: createdPoll.id,
  };

  // When
  const createdPollAnswer = await createPollAnswer(createdPoll, pollAnswer);

  // Then
  expect(poll.options.includes(createdPollAnswer.option)).toBe(true);
  expect(createdPollAnswer.poll).toBe(createdPoll.id);
});

test('replaces response if tries to add another response to same poll', async () => {
  // Given
  const owner = faker.random.uuid();
  const poll = {
    owner,
    mode: PollMode.SINGLE,
    options: [faker.lorem.word(), faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const [initialOption, updatedOption] = poll.options;
  const createdPoll = await createPoll(poll);

  const initialPollAnswer = {
    owner,
    option: initialOption,
    poll: createdPoll.id,
  };

  const updatedPollAnswer = {
    owner,
    option: updatedOption,
    poll: createdPoll.id,
  };

  await createPollAnswer(createdPoll, initialPollAnswer);

  // When
  const createdPollAnswer = await createPollAnswer(
    createdPoll,
    updatedPollAnswer
  );

  // Then
  expect(poll.options.includes(createdPollAnswer.option)).toBe(true);
  expect(createdPollAnswer.option).toBe(updatedOption);
  expect(createdPollAnswer.poll).toBe(createdPoll.id);
});

test('delete response if tries to add another response with de same option and same poll', async () => {
  // Given
  const owner = faker.random.uuid();
  const poll = {
    owner,
    mode: PollMode.SINGLE,
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const [option] = poll.options;
  const createdPoll = await createPoll(poll);

  const pollAnswer = {
    owner,
    option,
    poll: createdPoll.id,
  };

  await createPollAnswer(createdPoll, pollAnswer);

  // When
  await createPollAnswer(createdPoll, pollAnswer);

  // Then
  const allPollAnwers = await fetchPollAnswers(createdPoll);
  expect(allPollAnwers.length).toBe(0);
});

test('adds two poll responses to a multioption poll', async () => {
  // Given
  const owner = faker.random.uuid();
  const poll = {
    owner,
    mode: PollMode.SINGLE,
    options: [faker.lorem.word(), faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const [firstSelectedOption, secondSelectedOption] = poll.options;
  const createdPoll = await createPoll(poll);

  const firstPollAnswer = {
    owner,
    option: firstSelectedOption,
    poll: createdPoll.id,
  };

  const secondPollAnswer = {
    owner,
    option: secondSelectedOption,
    poll: createdPoll.id,
  };

  // When
  const firstCreatedPollAnswer = await createPollAnswer(
    createdPoll,
    firstPollAnswer
  );

  const secondCreatedPollAnswers = await createPollAnswer(
    createdPoll,
    secondPollAnswer
  );

  // Then
  expect(poll.options.includes(firstCreatedPollAnswer.option)).toBe(true);
  expect(poll.options.includes(firstCreatedPollAnswer.option)).toBe(true);

  expect(firstCreatedPollAnswer.option).toBe(firstSelectedOption);
  expect(firstCreatedPollAnswer.owner).toBe(owner);
  expect(firstCreatedPollAnswer.poll).toBe(createdPoll.id);

  expect(secondCreatedPollAnswers.option).toBe(secondSelectedOption);
  expect(secondCreatedPollAnswers.owner).toBe(owner);
  expect(secondCreatedPollAnswers.poll).toBe(createdPoll.id);
});
