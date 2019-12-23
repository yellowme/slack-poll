const faker = require('faker');

const Poll = require('../../../domain/poll');
const createTestDatabase = require('../../../../test/database');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createCreatePoll = require('../createPoll');
const createStorePollPresenterTimestamp = require('../storePollPresenterTimestamp');

test('updates polls timestamp', async () => {
  const { pollsRepository } = await setUpSuite();

  const poll = Poll({
    id: faker.random.uuid(),
    options: [faker.lorem.word(), faker.lorem.word()],
    owner: faker.random.uuid(),
    question: faker.lorem.word(),
  });

  const createPoll = createCreatePoll(pollsRepository);
  const createdPoll = await createPoll(poll);

  expect(createdPoll.id).toBe(poll.id);

  const storePollPresenterTimestamp = createStorePollPresenterTimestamp(
    pollsRepository
  );

  const timestamp = Date.now().toString();
  createdPoll.timestamp = timestamp;
  const updatedPoll = await storePollPresenterTimestamp(createdPoll);

  expect(updatedPoll.id).toBe(createdPoll.id);
  expect(updatedPoll.timestamp).toBe(timestamp);
});

async function setUpSuite() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);

  return { pollsRepository };
}
