const moxios = require('moxios');
const request = require('supertest');

const SLACK_VERIFICATION_TOKEN = 'test';
const MOCK_POLL_ID = 1;
const MOCK_TS = Date.now();
const MOCK_USER_ID = 'test';
const MOCK_CHANNEL_ID = 'test';
const MOCK_SLASH_COMMAND_TEXT =
  '"⏰" "10:20 - 10-35" "9:50 - 10:05" "9:20 - 9:35"';

const models = jest.mock('../../models', () => {
  // eslint-disable-next-line global-require
  const Sequelize = require('sequelize-mock');
  const sequelize = new Sequelize();

  const PollModel = sequelize.define(
    'polls',
    {
      id: MOCK_POLL_ID,
      text: MOCK_SLASH_COMMAND_TEXT,
      owner: MOCK_USER_ID,
      channel: MOCK_CHANNEL_ID,
      titleTs: MOCK_TS,
      mode: 's',
    },
    {
      timestamps: true,
    }
  );

  const PollAnswerModel = sequelize.define('poll_answers');

  const Poll = sequelize.models.polls;
  const PollAnswer = sequelize.models.poll_answers;

  PollAnswerModel.belongsTo(PollModel);

  return {
    Poll,
    PollAnswer,
    sequelize,
  };
});

const server = require('../../server');

describe('express poll server', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest('https://slack.com/api/chat.update', {
      status: 201,
      response: {},
    });

    moxios.stubRequest('https://slack.com/api/chat.delete', {
      status: 201,
      response: {},
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('POST /hook', () => {
    models.fn().mockImplementation(() => {
      // eslint-disable-next-line global-require
      const Sequelize = require('sequelize-mock');
      const sequelize = new Sequelize();

      const PollModel = sequelize.define(
        'polls',
        {
          text: MOCK_SLASH_COMMAND_TEXT,
          owner: MOCK_USER_ID,
          channel: MOCK_CHANNEL_ID,
          titleTs: Date.now(),
          mode: 's',
        },
        {
          timestamps: true,
        }
      );

      const PollAnswerModel = sequelize.define('poll_answers');

      const Poll = sequelize.models.polls;
      const PollAnswer = sequelize.models.poll_answers;

      PollAnswerModel.belongsTo(PollModel);

      return {
        Poll,
        PollAnswer,
        sequelize,
      };
    });

    test('answer an option by selection a slack poll action', async () => {
      const requestBody = {
        payload: JSON.stringify({
          token: SLACK_VERIFICATION_TOKEN,
          type: 'interactive_message',
          user: {
            name: MOCK_USER_ID,
            id: MOCK_USER_ID,
          },
          channel: {
            id: MOCK_CHANNEL_ID,
          },
          actions: [
            {
              value: '1',
            },
          ],
        }),
        token: SLACK_VERIFICATION_TOKEN,
        user_id: MOCK_USER_ID,
        channel_id: MOCK_CHANNEL_ID,
      };

      return request(server)
        .post('/hook')
        .send(requestBody)
        .expect(201);
    });

    test('deny a non owner to delete a poll', async () => {
      const requestBody = {
        payload: JSON.stringify({
          callback_id: MOCK_POLL_ID,
          token: SLACK_VERIFICATION_TOKEN,
          type: 'interactive_message',
          user: {
            name: 'test2',
            id: 'test2',
          },
          channel: {
            id: MOCK_CHANNEL_ID,
          },
          actions: [
            {
              value: 'cancel-null',
            },
          ],
        }),
        token: SLACK_VERIFICATION_TOKEN,
        user_id: 'test2',
        channel_id: MOCK_CHANNEL_ID,
      };

      return request(server)
        .post('/hook')
        .send(requestBody)
        .expect(204);
    });

    test('deletes a poll', async () => {
      const requestBody = {
        payload: JSON.stringify({
          callback_id: MOCK_POLL_ID,
          token: SLACK_VERIFICATION_TOKEN,
          type: 'interactive_message',
          user: {
            name: MOCK_USER_ID,
            id: MOCK_USER_ID,
          },
          channel: {
            id: MOCK_CHANNEL_ID,
          },
          actions: [
            {
              value: 'cancel-null',
            },
          ],
        }),
        token: SLACK_VERIFICATION_TOKEN,
        user_id: MOCK_USER_ID,
        channel_id: MOCK_CHANNEL_ID,
      };

      return request(server)
        .post('/hook')
        .send(requestBody)
        .expect(201);
    });
  });
});
