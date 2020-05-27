const sequelize = require('../db');

module.exports = async function fetchPoll({ id }) {
  const poll = await sequelize.models.polls.findOne({ where: { id } });
  return poll.toJSON();
};
