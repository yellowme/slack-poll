const faker = require('faker');

const Poll = require('../../../domain/poll');
const createTestDatabase = require('../../../../test/database');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createCreatePoll = require('../createPoll');

test('creates single mode poll', async () => {
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
  expect(createdPoll.question).toBe(poll.question);
  expect(createdPoll.owner).toBe(poll.owner);
  expect(createdPoll.options).toEqual(poll.options);
  expect(createdPoll.mode).toBe(Poll.PollMode.SINGLE);
});

test('creates multiple mode poll', async () => {
  const { pollsRepository } = await setUpSuite();

  const poll = Poll({
    id: faker.random.uuid(),
    options: [faker.lorem.word(), faker.lorem.word()],
    owner: faker.random.uuid(),
    question: faker.lorem.word(),
    mode: Poll.PollMode.MULTIPLE,
  });

  const createPoll = createCreatePoll(pollsRepository);
  const createdPoll = await createPoll(poll);

  expect(createdPoll.id).toBe(poll.id);
  expect(createdPoll.question).toBe(poll.question);
  expect(createdPoll.owner).toBe(poll.owner);
  expect(createdPoll.options).toEqual(poll.options);
  expect(createdPoll.mode).toBe(Poll.PollMode.MULTIPLE);
});

async function setUpSuite() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);

  return { pollsRepository };
}
