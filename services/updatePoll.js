const sequelize = require('../db');

module.exports = async function updatePoll({ id, ...data }) {
  await sequelize.models.polls.update(data, {
    where: { id },
  });

  const updatedPoll = await sequelize.models.polls.findOne({ id });
  return updatedPoll.toJSON();
};
