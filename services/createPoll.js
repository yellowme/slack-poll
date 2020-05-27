const sequelize = require('../db');

module.exports = async function createPoll(poll) {
  const createdPoll = await sequelize.models.polls.create(poll);
  return createdPoll.toJSON();
};
