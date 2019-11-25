function createStorePollPresenterTimestampUseCase(pollsRepository) {
  return function storePollPresenterTimestamp(pollId, timestamp) {
    return pollsRepository.update(pollId, { timestamp });
  };
}

module.exports = createStorePollPresenterTimestampUseCase;
