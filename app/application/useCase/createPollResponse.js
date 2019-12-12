const Poll = require('../../domain/poll');

function createCreatePollResponse(pollAnswersRepository) {
  return async function createPollResponse(poll, pollAnswer) {
    const pollAnswerBaseParams = {
      owner: pollAnswer.owner,
      poll: pollAnswer.poll,
    };

    const existingPollAnswer = (
      await pollAnswersRepository.find(pollAnswerBaseParams)
    )[0];

    if (!existingPollAnswer) return pollAnswersRepository.insert(pollAnswer);

    if (existingPollAnswer.option === pollAnswer.option)
      return pollAnswersRepository.destroy(pollAnswerBaseParams);

    if (poll.mode === Poll.PollMode.MULTIPLE)
      return pollAnswersRepository.insert(pollAnswer);

    existingPollAnswer.option = pollAnswer.option;
    return pollAnswersRepository.update(existingPollAnswer);
  };
}

module.exports = createCreatePollResponse;
