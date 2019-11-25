const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

async function createSequelizeTestDatabase() {
  sequelize.import('./models/poll.js');
  await sequelize.sync({ force: true });
  return sequelize;
}

module.exports = createSequelizeTestDatabase;
