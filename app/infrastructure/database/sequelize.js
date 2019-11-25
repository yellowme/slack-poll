const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

function createSequelizeDatabase() {
  sequelize.import('./models/poll.js');
  return sequelize;
}

module.exports = createSequelizeDatabase;
