const models = require('./models')
const constants = require('./constants')
const slackApi = require('./slack')

// Delete remote messages
// Delete local registry
async function deletePoll (currentPoll) {
  await Promise.all([
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

// All answers from poll
function readPollAnswers (currentPoll) {
  return models.PollAnswer.findAll({
    where: { pollId: currentPoll.id },
    raw: true
  })
}

// Create answer by given poll
async function addAnswerToPoll (currentPoll, answerData) {
  const isMultiple = currentPoll.mode === constants.pollMode.MULTIPLE

  const userSelectiveAnswerOptions = {
    ...isMultiple ? { answer: answerData.answer } : {},
    userId: answerData.userId,
    pollId: currentPoll.id
  }

  const currentAnswer = await models.PollAnswer.findOne({
    where: userSelectiveAnswerOptions,
    raw: true
  })

  if (currentAnswer && answerData.answer === currentAnswer.answer) {
    return models.PollAnswer.destroy({
      where: userSelectiveAnswerOptions
    })
  } else if (currentAnswer && answerData.answer !== currentAnswer.answer) {
    if (currentPoll.mode === constants.pollMode.MULTIPLE) {
      return models.PollAnswer
        .create(answerData)
        .then(m => m.get({ plain: true }))
    }

    return models.db.transaction((transaction) => {
      return models.PollAnswer.destroy({
        transaction,
        where: userSelectiveAnswerOptions
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
