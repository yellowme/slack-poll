const { Sequelize } = require('sequelize');

const config = require('../../config');

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
});

async function createSequelizeDatabase() {
  const PollModel = sequelize.import('./models/poll.js');
  const PollAnswerModel = sequelize.import('./models/pollAnswer.js');

  PollModel.hasMany(PollAnswerModel);

  await sequelize.sync();
  return sequelize;
}

module.exports = createSequelizeDatabase;
