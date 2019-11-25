function createCreatePollUseCase(pollsRepository) {
  return function createPoll(poll) {
    return pollsRepository.insert(poll);
  };
}

module.exports = createCreatePollUseCase;
