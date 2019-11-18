const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

async function createSequelizeDatabase() {
  sequelize.import('./models/poll.js');
  await sequelize.sync();
  return sequelize;
}

module.exports = createSequelizeDatabase;
