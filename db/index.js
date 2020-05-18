const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
});

const PollModel = sequelize.import('./models/poll.js');
const PollAnswerModel = sequelize.import('./models/pollAnswer.js');

PollModel.hasMany(PollAnswerModel);

sequelize.sync();

module.exports = sequelize;
