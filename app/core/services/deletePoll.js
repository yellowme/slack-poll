const PollOwnerException = require('../errors/PollOwnerException');

function createDeletePoll(pollRepository) {
  return async function deletePoll(poll) {
    const [pollToDelete] = await pollRepository.find({ id: poll.id });
    if (pollToDelete.owner !== poll.owner) throw new PollOwnerException();
    return pollRepository.destroy(poll);
  };
}

module.exports = createDeletePoll;
