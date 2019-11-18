const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

async function createSequelizeDatabase() {
  sequelize.import('../app/infrastructure/database/models/poll.js');
  await sequelize.sync({ force: true });
  return sequelize;
}

module.exports = createSequelizeDatabase;
