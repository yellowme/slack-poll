const sequelize = require('../db');

module.exports = async function fetchPollAnswers(poll) {
  const responses = await sequelize.models.pollAnswers.findAll({
    where: { pollId: poll.id },
  });

  return responses.map((pa) => pa.toJSON());
};
