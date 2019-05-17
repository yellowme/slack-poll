/* eslint-disable global-require */

jest.mock('../models.js', () => {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const Sequelize = require('sequelize-mock');
  const constants = require('../constants');

  const sequelize = new Sequelize();

  const PollModel = sequelize.define(
    'polls',
    {
      text: { type: Sequelize.STRING },
      owner: { type: Sequelize.STRING },
      channel: { type: Sequelize.STRING },
      titleTs: { type: Sequelize.STRING },
      mode: {
        defaultValue: constants.pollMode.SINGLE,
        type: Sequelize.ENUM(
          constants.pollMode.SINGLE,
          constants.pollMode.MULTIPLE
        ),
      },
    },
    {
      timestamps: true,
    }
  );

  const PollAnswerModel = sequelize.define(
    'poll_answers',
    {
      answer: { type: Sequelize.STRING },
      userId: { type: Sequelize.STRING },
      username: { type: Sequelize.STRING },
    },
    {
      timestamps: true,
    }
  );

  const Poll = sequelize.models.polls;
  const PollAnswer = sequelize.models.poll_answers;

  PollAnswerModel.belongsTo(PollModel);

  return {
    Poll,
    PollAnswer,
    sequelize,
  };
});
