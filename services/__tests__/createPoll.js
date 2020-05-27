const faker = require('faker');
const { PollMode } = require('../../app/poll');
const createPoll = require('../createPoll');

test('creates single mode poll', async () => {
  // Given
  const poll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  // When
  const createdPoll = await createPoll(poll);

  // Then
  expect(createdPoll.question).toBe(poll.question);
  expect(createdPoll.owner).toBe(poll.owner);
  expect(createdPoll.options).toEqual(poll.options);
  expect(createdPoll.mode).toBe('s');
});

test('creates multiple mode poll', async () => {
  // Given
  const poll = {
    mode: PollMode.MULTIPLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  // When
  const createdPoll = await createPoll(poll);

  // Then
  expect(createdPoll.question).toBe(poll.question);
  expect(createdPoll.owner).toBe(poll.owner);
  expect(createdPoll.options).toEqual(poll.options);
  expect(createdPoll.mode).toBe('m');
});
