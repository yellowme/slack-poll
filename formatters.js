function splitItems (text) {
  const rawOptions = text.split('"').filter(s => s !== '' && s !== ' ')
  return {
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

module.exports = {
  splitItems,
  pollOptionsString,
  pollEnhancedOptionsString
}
