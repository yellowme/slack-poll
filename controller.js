const models = require('./models')
const slackApi = require('./slack')

/**
 * Deberia poder crear un poll
 */

function _deletePollMessages (currentPoll) {
  return Promise.all([
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.buttonDeleteTs
    }),
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.buttons2Ts
    }),
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.buttonsTs
    }),
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.optionsTs
    }),
    slackApi('chat.delete', 'POST', {
      channel: currentPoll.channel,
      ts: currentPoll.titleTs
    })
  ])
}

function _deletePollRegistry (currentPoll) {
  return models.db.transaction((transaction) => {
    return models.PollAnswer.destroy({
      where: { pollId: currentPoll.id }
    }, {
      transaction
    }).then(() => {
      return models.Poll.destroy({
        where: { id: currentPoll.id }
      })
    })
  })
}

function deletePoll (currentPoll) {
  return _deletePollMessages(currentPoll).then(() => _deletePollRegistry(currentPoll))
}

function readPollAnswers (currentPoll) {
  return models.PollAnswer.findAll({
    where: { pollId: currentPoll.id },
    raw: true
  })
}

async function addAnswerToPoll (currentPoll, answerData) {
  const currentAnswer = await models.PollAnswer.findOne({
    where: { userId: answerData.userId, pollId: currentPoll.id },
    raw: true
  })

  if (currentAnswer && answerData.answer === currentAnswer.answer) {
    return models.PollAnswer.destroy({
      where: {
        userId: answerData.userId,
        pollId: currentPoll.id
      }
    })
  } else if (currentAnswer && answerData.answer !== currentAnswer.answer) {
    return models.db.transaction((transaction) => {
      return models.PollAnswer.destroy({
        transaction,
        where: {
          userId: answerData.userId,
          pollId: currentPoll.id
        }
      }).then(() => (
        models.PollAnswer
          .create(answerData, { transaction })
          .then(m => m.get({ plain: true }))
      ))
    })
  } else {
    return models.PollAnswer.create(answerData).then(m => m.get({ plain: true }))
  }
}

module.exports = {
  deletePoll,
  addAnswerToPoll,
  readPollAnswers
}
