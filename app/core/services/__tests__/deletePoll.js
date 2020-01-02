const faker = require('faker');
const Poll = require('../../../../test/factories/createPoll');
const createTestDatabase = require('../../../../test/sequelize');
const createPollsRepository = require('../../../../test/repositories/pollsRepository');
const createCreatePoll = require('../createPoll');
const createDeletePoll = require('../deletePoll');
const InvalidPollError = require('../../errors/InvalidPollError');
const NotPollOwnerError = require('../../errors/NotPollOwnerError');

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

test('fails to delete a poll that not exist', async () => {
  const { pollsRepository } = await setupTest();

  // Given
  const notPersistedPoll = Poll();

  try {
    // When
    const deletePoll = createDeletePoll(pollsRepository);
    await deletePoll(notPersistedPoll);
  } catch (error) {
    // Then
    expect(error).toBeInstanceOf(InvalidPollError);
    expect(error.message).toBe('Invalid Poll.');
  }
});

test('fails to delete a poll as not the same owner', async () => {
  const { createPoll, pollsRepository } = await setupTest();

  // Given
  const poll = Poll();
  const notPollOwner = faker.lorem.word();
  const createdPoll = await createPoll(poll);
  expect(createdPoll.id).toBe(poll.id);

  try {
    // When
    const deletePoll = createDeletePoll(pollsRepository);

    // replace poll owner
    poll.owner = notPollOwner;
    await deletePoll(poll);
  } catch (error) {
    // Then
    expect(error).toBeInstanceOf(NotPollOwnerError);
    expect(error.message).toBe(
      'Only the owner of the poll can remove this poll.'
    );
  }
});
