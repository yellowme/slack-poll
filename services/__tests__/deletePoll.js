const faker = require('faker');
const { PollMode } = require('../../app/poll');
const createPoll = require('../createPoll');
const deletePoll = require('../deletePoll');
const InvalidPollError = require('../../app/InvalidPollError');
const NotPollOwnerError = require('../../app/NotPollOwnerError');

test('deletes a poll', async () => {
  // Given
  const poll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const createdPoll = await createPoll(poll);

  // When
  const deletedPoll = await deletePoll(createdPoll);

  // Then
  expect(deletedPoll.id).toBe(createdPoll.id);
});

test('fails to delete a poll that not exist', async () => {
  // Given
  const notPersistedPoll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  try {
    // When
    await deletePoll(notPersistedPoll);
  } catch (error) {
    // Then
    expect(error).toBeInstanceOf(InvalidPollError);
    expect(error.message).toBe('Invalid Poll.');
  }
});

test('fails to delete a poll as not the same owner', async () => {
  // Given
  const notSameOwner = faker.random.uuid();
  const poll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const createdPoll = await createPoll(poll);

  try {
    // When
    await deletePoll({ id: createdPoll.id, owner: notSameOwner });
  } catch (error) {
    // Then
    expect(error).toBeInstanceOf(NotPollOwnerError);
    expect(error.message).toBe(
      'Only the owner of the poll can remove this poll.'
    );
  }
});
