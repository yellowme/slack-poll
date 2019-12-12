function createCreatePoll(pollsRepository) {
  return function createPoll(poll) {
    return pollsRepository.insert(poll);
  };
}

module.exports = createCreatePoll;
