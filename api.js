const models = require('./models');
const constants = require('./constants');
const utils = require('./utils');
const slackApi = require('./slack');

const { Poll, PollAnswer, sequelize } = models;

// Delete remote messages
// Delete local registry
async function deletePoll(currentPoll) {
  await Promise.all([
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.buttonDeleteTs,
    }),
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.buttons2Ts,
    }),
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.buttonsTs,
    }),
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.optionsTs,
    }),
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.titleTs,
    }),
  ]);

  return sequelize.transaction(transaction => {
    return PollAnswer.destroy(
      {
        where: { pollId: currentPoll.id },
      },
      {
        transaction,
      }
    ).then(() => {
      return Poll.destroy({
        where: { id: currentPoll.id },
      });
    });
  });
}

function readPollAnswers(currentPoll) {
  return PollAnswer.findAll({
    where: { pollId: currentPoll.id },
    raw: true,
  });
}

async function createPlainPollResponse(pollAnswerData, options = {}) {
  const pollAnswerInstance = await PollAnswer.create(pollAnswerData, options);
  return pollAnswerInstance.get({ plain: true });
}

// Create answer by given poll
// Requires a sequelize transaction
async function addAnswerToPoll(currentPoll, answerData, transaction) {
  const isMultiple = currentPoll.mode === constants.pollMode.MULTIPLE;

  // if is multiple prevent user to repeat the same answer
  // If not just verify if the user has already an answer
  const userSelectiveAnswerOptions = {
    ...(isMultiple ? { answer: answerData.answer } : {}),
    userId: answerData.userId,
    pollId: currentPoll.id,
  };

  const currentAnswer = await PollAnswer.findOne({
    where: userSelectiveAnswerOptions,
    raw: true,
  });

  if (!currentAnswer) {
    return createPlainPollResponse(answerData, { transaction });
  }

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
  if (currentPoll.mode === constants.pollMode.MULTIPLE) {
    return createPlainPollResponse(answerData, { transaction });
  }

  // if is single poll
  // delete any other user poll responses and create a single one
  await currentAnswer.destroy({ transaction });
  return createPlainPollResponse(answerData, { transaction });
}

function updatePollWithAnswers(channelId, currentPoll, parsedPollData) {
  return slackApi('chat.update', 'POST', {
    ...utils.buildMessageTemplate(currentPoll, parsedPollData),
    link_names: 1,
    parse: 'full',
    channel: channelId,
    ts: currentPoll.titleTs,
  });
}

function publishPoll(channelId, currentPoll, parsedPollData) {
  return slackApi('chat.postMessage', 'POST', {
    ...utils.messageTemplate(currentPoll, parsedPollData),
    channel: channelId,
    username: 'Yellow Poll',
  });
}

module.exports = {
  deletePoll,
  addAnswerToPoll,
  readPollAnswers,
  publishPoll,
  updatePollWithAnswers,
};
