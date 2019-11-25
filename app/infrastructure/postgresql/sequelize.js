const { Sequelize } = require('sequelize');
const config = require('../../config');

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
});

function createSequelizeDatabase() {
  sequelize.import('./models/poll.js');
  return sequelize;
}

module.exports = createSequelizeDatabase;
