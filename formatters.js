const constants = require('./constants')

function splitItems (text) {
  const mode = text.search('-m') >= 0
    ? constants.pollMode.MULTIPLE
    : constants.pollMode.SINGLE

  const rawOptions = text
    .replace('-m', '')
    .split('"')
    .map(s => s.trim())
    .filter(s => s !== '' && s !== ' ')

  return {
    mode,
    question: rawOptions[0],
    options: rawOptions.slice(1)
  }
}

function pollOptionsString (items, emojis) {
  return items.options.reduce((text, option, index) => (
    `${text}:${emojis[index]}: ${option} \n\n`
  ), '')
}

function pollEnhancedOptionsString (items, currentPollAnswers, emojis) {
  return items.options.reduce((text, option, index) => {
    const answerValue = `${option}-${index}`
    const allUserAnswers = currentPollAnswers.filter(cpa => cpa.answer === answerValue)
    const usernamesString = allUserAnswers.reduce((text, user) => `${text} @${user.username}`, '')
    const counterString = allUserAnswers.length !== 0
      ? ': `' + allUserAnswers.length + '`'
      : ''

    return `${text}:${emojis[index]}: ${option}${counterString} ${usernamesString} \n\n `
  }, '')
}

function stringFromPollMode (pollMode) {
  return pollMode === constants.pollMode.MULTIPLE ? 'Multiple' : 'Single'
}

module.exports = {
  splitItems,
  pollOptionsString,
  pollEnhancedOptionsString,
  stringFromPollMode
}
