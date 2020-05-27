const faker = require('faker');
const { PollMode } = require('../../app/poll');
const createPoll = require('../createPoll');
const createPollAnswer = require('../createPollAnswer');
const fetchPollAnswers = require('../fetchPollAnswers');

test('list poll answers by given poll', async () => {
  // Given
  const owner = faker.random.uuid();
  const poll = {
    owner,
    mode: PollMode.SINGLE,
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const [option] = poll.options;
  const createdPoll = await createPoll(poll);

  const pollAnswer = {
    owner,
    option,
    poll: createdPoll.id,
  };

  const createdPollAnswer = await createPollAnswer(createdPoll, pollAnswer);

  // When
  const allPollAnswers = await fetchPollAnswers(createdPoll);

  // Then
  expect(allPollAnswers.length).toBe(1);
  expect(allPollAnswers[0].id).toBe(createdPollAnswer.id);
});
