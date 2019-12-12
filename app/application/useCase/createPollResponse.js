function createCreatePollResponse(pollAnswersRepository) {
  return async function createPollResponse(pollAnswer) {
    const existingPollAnswer = (
      await pollAnswersRepository.find({
        owner: pollAnswer.owner,
        poll: pollAnswer.poll,
      })
    )[0];

    if (existingPollAnswer) {
      existingPollAnswer.option = pollAnswer.option;
      return pollAnswersRepository.update(existingPollAnswer);
    }

    return pollAnswersRepository.insert(pollAnswer);
  };
}

module.exports = createCreatePollResponse;
