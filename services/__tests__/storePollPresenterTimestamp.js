const Poll = require('../../../../test/factories/createPoll');
const createTestDatabase = require('../../../../test/sequelize');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createCreatePoll = require('../createPoll');
const createStorePollPresenterTimestamp = require('../storePollPresenterTimestamp');

async function setupTest() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const createPoll = createCreatePoll(pollsRepository);
  const storePollPresenterTimestamp = createStorePollPresenterTimestamp(
    pollsRepository
  );

  return { createPoll, storePollPresenterTimestamp, pollsRepository };
}

test('updates polls timestamp', async () => {
  const { createPoll, storePollPresenterTimestamp } = await setupTest();

  // Given
  const poll = Poll();
  const createdPoll = await createPoll(poll);

  const timestamp = Date.now().toString();
  createdPoll.timestamp = timestamp;

  // When
  const updatedPoll = await storePollPresenterTimestamp(createdPoll);

  // Then
  expect(updatedPoll.id).toBe(createdPoll.id);
  expect(updatedPoll.timestamp).toBe(timestamp);
});
