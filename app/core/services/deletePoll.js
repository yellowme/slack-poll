function createDeletePoll(pollRepository) {
  return async function deletePoll(poll) {
    return pollRepository.destroy(poll);
  };
}

module.exports = createDeletePoll;
