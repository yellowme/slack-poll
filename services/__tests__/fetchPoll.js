const faker = require('faker');
const { PollMode } = require('../../app/poll');
const createPoll = require('../createPoll');
const fetchPoll = require('../fetchPoll');

test('returns a poll', async () => {
  // Given
  const poll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const createdPoll = await createPoll(poll);

  // When
  const samePoll = await fetchPoll(createdPoll);

  // Then
  expect(samePoll.id).toBe(createdPoll.id);
});
