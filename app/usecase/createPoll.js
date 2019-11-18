const Poll = require('../domain/poll');

function createCreatePollUseCase({ pollRepository }) {
  return function createPoll(pollData) {
    const poll = Poll(pollData);
    return pollRepository.insert(poll);
  };
}

module.exports = createCreatePollUseCase;
