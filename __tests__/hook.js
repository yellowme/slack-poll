const request = require('supertest');
const faker = require('faker');
const app = require('../app');
const { PollMode } = require('../app/poll');
const createPoll = require('../services/createPoll');

test('rejects with invalid verification token', async () => {
  // Given
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

  // When
  const response = await request(app).post('/hook').send(requestBody);

  // Then
  expect(response.status).toBe(403);
});

test('add poll answer by calling slack interactive components', async () => {
  // Given
  const poll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const slackVerificationToken = 'slack_verification_token';
  const exctedUserId = faker.random.uuid();
  const [option] = poll.options;

  const createdPoll = await createPoll(poll);

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: exctedUserId,
      },
      callback_id: createdPoll.id,
      actions: [
        {
          value: `${option}-0`,
        },
      ],
    }),
  };

  // When
  const response = await request(app).post('/hook').send(requestBody);

  // Then
  expect(response.status).toBe(200);
});

test('deletes a poll', async () => {
  // Given
  const poll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const slackVerificationToken = 'slack_verification_token';

  const createdPoll = await createPoll(poll);

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: poll.owner,
      },
      callback_id: createdPoll.id,
      actions: [
        {
          value: 'cancel-null',
        },
      ],
    }),
  };

  // When
  const response = await request(app).post('/hook').send(requestBody);

  // Then
  expect(response.status).toBe(200);
});

test('fails to create a poll response with invalid answer', async () => {
  // Given
  const poll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const slackVerificationToken = 'slack_verification_token';
  const exctedUserId = faker.random.uuid();
  const invalidOption = faker.lorem.word();

  const createdPoll = await createPoll(poll);

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: exctedUserId,
      },
      callback_id: createdPoll.id,
      actions: [
        {
          value: invalidOption,
        },
      ],
    }),
  };

  // When
  const response = await request(app).post('/hook').send(requestBody);

  // Then
  expect(response.status).toBe(200);
  expect(response.body.text).toBe(
    "Sorry, there's been an error. Try again later."
  );
});

test('fails to delete a poll with invalid id', async () => {
  // Given
  const slackVerificationToken = 'slack_verification_token';
  const exctedUserId = faker.random.uuid();
  const invalidPollId = faker.lorem.word();

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: exctedUserId,
      },
      callback_id: invalidPollId,
      actions: [
        {
          value: 'cancel-null',
        },
      ],
    }),
  };

  // When
  const response = await request(app).post('/hook').send(requestBody);

  // Then
  expect(response.status).toBe(200);
  expect(response.body.text).toBe(
    "Sorry, there's been an error. Try again later."
  );
});

test('fails to delete a poll as not poll owner', async () => {
  // Given
  const poll = {
    mode: PollMode.SINGLE,
    owner: faker.random.uuid(),
    options: [faker.lorem.word()],
    question: faker.lorem.word(),
  };

  const slackVerificationToken = 'slack_verification_token';
  const invalidOwner = faker.random.uuid();

  const createdPoll = await createPoll(poll);

  const requestBody = {
    payload: JSON.stringify({
      token: slackVerificationToken,
      user: {
        id: invalidOwner,
      },
      callback_id: createdPoll.id,
      actions: [
        {
          value: 'cancel-null',
        },
      ],
    }),
  };

  // When
  const response = await request(app).post('/hook').send(requestBody);

  // 200 response for slack to display error message
  expect(response.status).toBe(200);
  expect(response.body.text).toBe(
    'Only the owner of the poll can remove this poll.'
  );
});
