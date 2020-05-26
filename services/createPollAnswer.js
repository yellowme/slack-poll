const sequelize = require('../db');
const Poll = require('../app/poll');

module.exports = async function createPollAnswer(poll, pollAnswer) {
  const userPollAnswers = await sequelize.models.pollAnswers.findAll({
    where: {
      owner: pollAnswer.owner,
      poll: pollAnswer.poll,
    },
  });

  // if user does not have any answer just create it
  if (userPollAnswers.length === 0) {
    return (await sequelize.models.pollAnswers.create(pollAnswer)).toJSON();
  }

  // if user respond with exact same response, remove it
  const duplicateAnswer = userPollAnswers.find((a) => {
    return a.option === pollAnswer.option;
  });

  if (duplicateAnswer) {
    await duplicateAnswer.destroy();
    return duplicateAnswer.toJSON();
  }

  // if user respond with diferent answer
  // but is multiple poll mode, create a new answer
  // otherwise update the current answer if single mode
  if (poll.mode === Poll.PollMode.MULTIPLE) {
    return (await sequelize.models.pollAnswers.create(pollAnswer)).toJSON();
  }

  const [currentPollAnswer] = userPollAnswers;
  currentPollAnswer.option = pollAnswer.option;
  return currentPollAnswer.save();
};
