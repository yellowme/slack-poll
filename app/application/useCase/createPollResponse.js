function createCreatePollResponseUseCase(pollResponsesRepository) {
  return function createPollResponse(poll) {
    return pollResponsesRepository.insert(poll);
  };
}

module.exports = createCreatePollResponseUseCase;
