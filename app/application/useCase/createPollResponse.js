const Poll = require('../../domain/poll');

function createCreatePollResponse(pollAnswersRepository) {
  return async function createPollResponse(poll, pollAnswer) {
    const pollAnswerBaseParams = {
      owner: pollAnswer.owner,
      poll: pollAnswer.poll,
    };

    const existingPollAnswersForUser = await pollAnswersRepository.find(
      pollAnswerBaseParams
    );

    // if user does not have any answer just create it
    if (existingPollAnswersForUser.length === 0)
      return pollAnswersRepository.insert(pollAnswer);

    // if user respond with exact same response remove it
    const dupliquedAnswer = existingPollAnswersForUser.find(
      answer => answer.option === pollAnswer.option
    );
    if (dupliquedAnswer) return pollAnswersRepository.destroy(dupliquedAnswer);

    // if user respond with deferente answer
    // but is multiple poll, create a new answer
    // otherwise update the current single answer
    if (poll.mode === Poll.PollMode.MULTIPLE)
      return pollAnswersRepository.insert(pollAnswer);

    // existingPollAnswersForUser here should always have one item
    const [pollToUpdate] = existingPollAnswersForUser;
    pollToUpdate.option = pollAnswer.option;
    return pollAnswersRepository.update(pollToUpdate);
  };
}

module.exports = createCreatePollResponse;
