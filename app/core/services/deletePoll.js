const NotPollOwnerError = require('../errors/NotPollOwnerError');
const InvalidPollError = require('../errors/InvalidPollError');

function createDeletePoll(pollRepository) {
  return async function deletePoll(poll) {
    const [pollToDelete] = await pollRepository.find({ id: poll.id });
    if (!pollToDelete) throw new InvalidPollError();
    if (pollToDelete.owner !== poll.owner) throw new NotPollOwnerError();
    return pollRepository.destroy(poll);
  };
}

module.exports = createDeletePoll;
