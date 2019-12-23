function createStorePollPresenterTimestampUseCase(pollsRepository) {
  return function storePollPresenterTimestamp(poll) {
    return pollsRepository.update(poll);
  };
}

module.exports = createStorePollPresenterTimestampUseCase;
