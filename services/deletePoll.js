const sequelize = require('../db');
const NotPollOwnerError = require('../app/NotPollOwnerError');
const InvalidPollError = require('../app/InvalidPollError');

module.exports = async function deletePoll(poll) {
  let pollRecord = null;

  try {
    pollRecord = await sequelize.models.polls.findOne({
      where: { id: poll.id },
    });
  } catch (err) {
    // console.log(err);
    throw new InvalidPollError();
  }

  if (pollRecord.owner !== poll.owner) throw new NotPollOwnerError();

  await pollRecord.destroy();
  return pollRecord.toJSON();
};
