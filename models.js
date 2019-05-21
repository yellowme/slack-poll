const Sequelize = require('sequelize');
const config = require('./config');
const constants = require('./constants');

const sequelize = config.DATABASE_URL
  ? new Sequelize(config.DATABASE_URL, { logging: false })
  : new Sequelize('yellowpoll', null, null, {
      dialect: 'sqlite',
      storage: './yellowpoll.sqlite',
      logging: false,
    });

const PollModel = sequelize.define(
  'polls',
  {
    text: { type: Sequelize.TEXT('long') },
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

sequelize.sync();

PollAnswerModel.belongsTo(PollModel);

const Poll = sequelize.models.polls;
const PollAnswer = sequelize.models.poll_answers;

module.exports = { Poll, PollAnswer, sequelize };
