const faker = require('faker');
const { PollMode } = require('../../app/poll');
const createPoll = require('../createPoll');
const updatePoll = require('../updatePoll');

test('updates polls timestamp', async () => {
  // Given
  const poll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const createdPoll = await createPoll(poll);

  const timestamp = Date.now().toString();
  createdPoll.timestamp = timestamp;

  // When
  const updatedPoll = await updatePoll(createdPoll);

  // Then
  expect(updatedPoll.id).toBe(createdPoll.id);
  expect(updatedPoll.timestamp).toBe(timestamp);
});
