function createStorePollPresenterTimestampUseCase(pollsRepository) {
  return function storePollPresenterTimestamp(pollId, timestamp) {
    return pollsRepository.update({ id: pollId, timestamp });
  };
}

module.exports = createStorePollPresenterTimestampUseCase;
