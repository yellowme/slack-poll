const Poll = require('../../../../test/factories/createPoll');
const createTestDatabase = require('../../../../test/sequelize');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createCreatePoll = require('../createPoll');
const createFetchPoll = require('../fetchPoll');

async function setupTest() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const createPoll = createCreatePoll(pollsRepository);
  const fetchPoll = createFetchPoll(pollsRepository);

  return { createPoll, fetchPoll, pollsRepository };
}

test('returns a poll', async () => {
  const { createPoll, fetchPoll } = await setupTest();

  // Given
  const poll = Poll();
  const createdPoll = await createPoll(poll);

  // When
  const singlePoll = await fetchPoll(createdPoll);

  // Then
  expect(singlePoll.id).toBe(createdPoll.id);
});
