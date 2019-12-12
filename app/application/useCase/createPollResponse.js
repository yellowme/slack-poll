function createCreatePollResponse(pollAnswersRepository) {
  return async function createPollResponse(pollAnswer) {
    const pollAnswerBaseParams = {
      owner: pollAnswer.owner,
      poll: pollAnswer.poll,
    };

    const existingPollAnswer = (
      await pollAnswersRepository.find(pollAnswerBaseParams)
    )[0];

    if (existingPollAnswer) {
      if (existingPollAnswer.option === pollAnswer.option)
        return pollAnswersRepository.destroy(pollAnswerBaseParams);
      existingPollAnswer.option = pollAnswer.option;
      return pollAnswersRepository.update(existingPollAnswer);
    }

    return pollAnswersRepository.insert(pollAnswer);
  };
}

module.exports = createCreatePollResponse;
