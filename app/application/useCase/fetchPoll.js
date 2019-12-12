function createFetchPoll(pollRepository) {
  return async function fetchPoll({ id }) {
    const [poll] = await pollRepository.find({ id });
    return poll;
  };
}

module.exports = createFetchPoll;
