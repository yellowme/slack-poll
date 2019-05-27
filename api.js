const models = require('./models');
const constants = require('./constants');
const slackApi = require('./slack');

const { Poll, PollAnswer, sequelize } = models;

function readPollAnswers(poll) {
  return PollAnswer.findAll({
    where: {
      pollId: poll.id,
    },
    raw: true,
  });
}

async function updatePollWithAnswers(channelId, ts, messageBody) {
  return slackApi('chat.update', 'POST', {
    ts,
    ...messageBody,
    channel: channelId,
  });
}

function publishPoll(channelId, messageBody) {
  return slackApi('chat.postMessage', 'POST', {
    ...messageBody,
    channel: channelId,
    username: 'Yellow Poll',
  });
}

// Delete remote messages
// Delete local registry
async function deletePoll(poll) {
  await slackApi('chat.delete', 'POST', {
    channel: poll.channel,
    ts: poll.titleTs,
  });

  return sequelize.transaction(transaction => {
    return PollAnswer.destroy(
      {
        where: { pollId: poll.id },
      },
      {
        transaction,
      }
    ).then(() => {
      return Poll.destroy({
        where: { id: poll.id },
      });
    });
  });
}

// Create answer by given poll
// Requires a sequelize transaction if the remote request to Slack fails
async function addAnswerToPoll(poll, answerData) {
  return sequelize.transaction(async transaction => {
    async function createPlainPollResponse(pollAnswerData) {
      const pollAnswerInstance = await PollAnswer.create(
        {
          pollId: poll.id,
          ...pollAnswerData,
        },
        {
          transaction,
        }
      );

      return pollAnswerInstance.get({ plain: true });
    }

    try {
      const isMultiple = poll.mode === constants.pollMode.MULTIPLE;

      // if is multiple prevent user to repeat the same answer
      // If not just verify if the user has already an answer
      const userSelectiveAnswerOptions = {
        ...(isMultiple ? { answer: answerData.answer } : {}),
        userId: answerData.userId,
        pollId: poll.id,
      };

      const currentAnswerInstance = await PollAnswer.findOne({
        where: userSelectiveAnswerOptions,
      });

      if (!currentAnswerInstance) {
        return createPlainPollResponse(answerData);
      }

      const currentAnswer = await currentAnswerInstance.get({ plain: true });

      // if user has made already an answer
      // or has a duplicated answer in multiple-reponse polls
      // just remove the answer
      if (answerData.answer === currentAnswer.answer) {
        return PollAnswer.destroy({
          transaction,
          where: userSelectiveAnswerOptions,
        });
      }

      // If the poll is multiple and user has not repeating answer
      // Just create a new poll response
      if (poll.mode === constants.pollMode.MULTIPLE) {
        return createPlainPollResponse(answerData);
      }

      // if is single poll
      // delete any other user poll responses and create a single one
      if (currentAnswerInstance) {
        await currentAnswerInstance.destroy({ transaction });
      }

      return createPlainPollResponse(answerData);
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  });
}

module.exports = {
  deletePoll,
  addAnswerToPoll,
  readPollAnswers,
  publishPoll,
  updatePollWithAnswers,
};
