const moxios = require('moxios');
const request = require('supertest');

jest.mock('../../models', () => {
  // eslint-disable-next-line global-require
  const Sequelize = require('sequelize-mock');
  const sequelize = new Sequelize();

  const PollModel = sequelize.define('polls');
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

describe('POST /poll', () => {
  const SLACK_VERIFICATION_TOKEN = 'test';
  const MOCK_TS = Date.now();
  const MOCK_USER_ID = 'test';
  const MOCK_CHANNEL_ID = 'test';
  const MOCK_SLASH_COMMAND_TEXT =
    '"⏰" "10:20 - 10-35" "9:50 - 10:05" "9:20 - 9:35"';

  beforeEach(() => {
    moxios.install();

    moxios.stubRequest('https://slack.com/api/chat.postMessage', {
      status: 201,
      response: { ts: MOCK_TS },
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('creates a poll via slash command', async () => {
    const requestBody = {
      text: MOCK_SLASH_COMMAND_TEXT,
      token: SLACK_VERIFICATION_TOKEN,
      user_id: MOCK_USER_ID,
      channel_id: MOCK_CHANNEL_ID,
    };

    const response = await request(server)
      .post('/poll')
      .send(requestBody)
      .expect(201);

    expect(response.body.text).toBe(requestBody.text);
    expect(response.body.channel).toBe(requestBody.channel_id);
    expect(response.body.titleTs).toBe(MOCK_TS);
    expect(response.body.mode).toBe('s');
    expect(response.body.owner).toBe(requestBody.user_id);
    expect(response.body.id).toBe(1);
  });
});
