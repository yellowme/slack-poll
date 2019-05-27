const models = require('../models');

const { Poll, PollAnswer } = models;

jest.mock('../models.js', () => {
  // eslint-disable-next-line global-require
  const Sequelize = require('sequelize-mock');
  const sequelize = new Sequelize();

  const PollModel = sequelize.define('polls');
  const PollAnswerModel = sequelize.define('poll_answers');

  const PollMock = sequelize.models.polls;
  const PollAnswerMock = sequelize.models.poll_answers;

  PollAnswerModel.belongsTo(PollModel);

  return {
    Poll: PollMock,
    PollAnswer: PollAnswerMock,
    sequelize,
  };
});

describe('models.js', () => {
  test('Poll', async () => {
    const pollInstance = await Poll.create();
    const poll = await pollInstance.get({ plain: true });
    expect(poll.id).toBeDefined();
  });

  test('PollAnswer', async () => {
    const pollInstance = await Poll.create();
    const poll = await pollInstance.get({ plain: true });
    expect(poll.id).toBeDefined();

    const pollAnswerInstance = await PollAnswer.create({ pollId: poll.id });
    const pollAnswer = await pollAnswerInstance.get({ plain: true });
    expect(pollAnswer.id).toBeDefined();
    expect(pollAnswer.pollId).toBe(poll.id);
  });
});
