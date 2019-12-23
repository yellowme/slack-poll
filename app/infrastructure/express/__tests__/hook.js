const request = require('supertest');
const faker = require('faker');

const createTestApplication = require('../../../../test/application');

test('rejects with invalid verification token', async () => {
  const { server } = await createTestApplication();

  const slackVerificationToken = faker.random.uuid();
  const expectedOption = faker.lorem.word();
  const userId = faker.random.uuid();
  const pollId = faker.random.uuid();

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: userId,
      },
      callback_id: pollId,
      actions: [
        {
          value: expectedOption,
        },
      ],
    }),
  };

  const response = await request(server)
    .post('/hook')
    .send(requestBody);

  expect(response.status).toBe(401);
});

test('add poll answer by calling slack interactive components', async () => {
  const { server, repositories } = await createTestApplication();

  const slackVerificationToken = 'slack_verification_token';
  const expectedQuestion = faker.lorem.word();
  const expectedOption = faker.lorem.word();
  const slashCommand = `"${expectedQuestion}" "${expectedOption}" "${expectedOption}"`;
  const exctedUserId = faker.random.uuid();
  const expectedSlackChannelId = faker.random.uuid();

  await request(server)
    .post('/polls')
    .send({
      text: slashCommand,
      token: slackVerificationToken,
      user_id: exctedUserId,
      channel_id: expectedSlackChannelId,
    });

  const [lastCreatedPoll] = await repositories.pollsRepository.find();

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: exctedUserId,
      },
      callback_id: lastCreatedPoll.id,
      actions: [
        {
          value: expectedOption,
        },
      ],
    }),
  };

  const response = await request(server)
    .post('/hook')
    .send(requestBody);

  expect(response.status).toBe(201);

  const pollAnswers = await repositories.pollAnswersRepository.find({
    option: expectedOption,
    owner: exctedUserId,
  });

  expect(pollAnswers.length).toBe(1);

  const [lastPollAnswer] = pollAnswers;
  expect(lastPollAnswer.option).toBe(expectedOption);
  expect(lastPollAnswer.owner).toBe(exctedUserId);
  expect(lastPollAnswer.poll).toBe(lastCreatedPoll.id);
});

test('deletes a poll', async () => {
  const { server, repositories } = await createTestApplication();

  const slackVerificationToken = 'slack_verification_token';
  const expectedQuestion = faker.lorem.word();
  const expectedOption = faker.lorem.word();
  const slashCommand = `"${expectedQuestion}" "${expectedOption}" "${expectedOption}"`;
  const exctedUserId = faker.random.uuid();
  const expectedSlackChannelId = faker.random.uuid();

  await request(server)
    .post('/polls')
    .send({
      text: slashCommand,
      token: slackVerificationToken,
      user_id: exctedUserId,
      channel_id: expectedSlackChannelId,
    });

  const [lastCreatedPoll] = await repositories.pollsRepository.find();

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: exctedUserId,
      },
      callback_id: lastCreatedPoll.id,
      actions: [
        {
          value: 'cancel-null',
        },
      ],
    }),
  };

  const response = await request(server)
    .post('/hook')
    .send(requestBody);

  expect(response.status).toBe(200);

  const poll = await repositories.pollsRepository.find();
  expect(poll.length).toBe(0);
});
