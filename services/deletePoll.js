const sequelize = require('../db');
const NotPollOwnerError = require('../app/NotPollOwnerError');
const InvalidPollError = require('../app/InvalidPollError');

module.exports = async function deletePoll(poll) {
  const pollRecord = await sequelize.models.polls.findOne({
    where: { id: poll.id },
  });

  if (!pollRecord) throw new InvalidPollError();
  if (pollRecord.owner !== poll.owner) throw new NotPollOwnerError();

  await pollRecord.destroy();
  return pollRecord.toJSON();
};
