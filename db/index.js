const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
  logging: config.NODE_ENV !== 'production',
});

const PollModel = sequelize.import('./models/poll.js');
const PollAnswerModel = sequelize.import('./models/pollAnswer.js');

PollModel.hasMany(PollAnswerModel, {
  foreignKey: {
    name: 'poll',
  },
});

module.exports = sequelize;
