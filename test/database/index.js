const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false,
});

async function createSequelizeTestDatabase() {
  const PollModel = sequelize.import('./models/poll.js');
  const PollAnswerModel = sequelize.import('./models/pollAnswer.js');

  PollModel.hasMany(PollAnswerModel);

  await sequelize.sync({ force: true });
  return sequelize;
}

module.exports = createSequelizeTestDatabase;
