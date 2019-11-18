const Poll = require('../domain/poll');

function createCreatePollUseCase(pollRepository) {
  return function createPoll({ text, channel, owner }) {
    const poll = Poll({ text, channel, owner });
    return pollRepository.insert(poll);
  };
}

module.exports = createCreatePollUseCase;
