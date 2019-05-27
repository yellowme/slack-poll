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

describe('GET /ping', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test('verify if server is running', async () => {
    const response = await request(server).get('/ping');
    expect(response.body.on).toBe(true);
  });
});
