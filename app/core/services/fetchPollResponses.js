function createFetchPollResponses(pollAnswersRepository) {
  return function fetchPollResponses(poll) {
    return pollAnswersRepository.find({ poll: poll.id });
  };
}

module.exports = createFetchPollResponses;
