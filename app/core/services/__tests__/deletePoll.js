const Poll = require('../../../../test/factories/createPoll');
const createTestDatabase = require('../../../../test/sequelize');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createCreatePoll = require('../createPoll');
const createDeletePoll = require('../deletePoll');

async function setupTest() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const createPoll = createCreatePoll(pollsRepository);

  return { pollsRepository, createPoll };
}

test('deletes a poll', async () => {
  const { createPoll, pollsRepository } = await setupTest();

  // Given
  const poll = Poll();
  const createdPoll = await createPoll(poll);
  expect(createdPoll.id).toBe(poll.id);

  // When
  const deletePoll = createDeletePoll(pollsRepository);
  await deletePoll(poll);

  // Then
  expect((await pollsRepository.find()).length).toBe(0);
});
