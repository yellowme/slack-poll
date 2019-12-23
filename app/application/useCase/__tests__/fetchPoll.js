const faker = require('faker');

const Poll = require('../../../domain/poll');
const createTestDatabase = require('../../../../test/database');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createCreatePoll = require('../createPoll');
const createFetchPoll = require('../fetchPoll');

test('returns a poll', async () => {
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

  const fetchPoll = createFetchPoll(pollsRepository);
  const singlePoll = await fetchPoll(createdPoll);

  expect(singlePoll.id).toBe(createdPoll.id);
});

async function setUpSuite() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);

  return { pollsRepository };
}
