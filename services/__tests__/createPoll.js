const Poll = require('../../../../test/factories/createPoll');
const createTestDatabase = require('../../../../test/sequelize');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createCreatePoll = require('../createPoll');

async function setupTest() {
  const sequelize = await createTestDatabase();
  const pollsRepository = createPollsRepository(sequelize);
  const createPoll = createCreatePoll(pollsRepository);

  return { createPoll };
}

test('creates single mode poll', async () => {
  const { createPoll } = await setupTest();

  const poll = Poll();

  const createdPoll = await createPoll(poll);

  expect(createdPoll.id).toBe(poll.id);
  expect(createdPoll.question).toBe(poll.question);
  expect(createdPoll.owner).toBe(poll.owner);
  expect(createdPoll.options).toEqual(poll.options);
  expect(createdPoll.mode).toBe('s');
});

test('creates multiple mode poll', async () => {
  const { createPoll } = await setupTest();

  const poll = Poll({
    mode: 'm',
  });

  const createdPoll = await createPoll(poll);

  expect(createdPoll.id).toBe(poll.id);
  expect(createdPoll.question).toBe(poll.question);
  expect(createdPoll.owner).toBe(poll.owner);
  expect(createdPoll.options).toEqual(poll.options);
  expect(createdPoll.mode).toBe('m');
});
