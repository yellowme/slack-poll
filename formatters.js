const constants = require('./constants')

const emojis = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'keycap_ten']

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

function mapAttatchmenBody (items, currentPoll, body) {
  return [
    {
      ...body,
      actions: items.options.slice(0, 5).map((option, index) => ({
        name: `${option}-${index}`,
        text: `:${emojis[index]}:`,
        type: 'button',
        value: `${option}-${index}`
      }))
    },
    ...items.options.length > 5
      ? [{
        ...body,
        actions: items.options.slice(5, 10).map((option, _index) => {
          const index = _index + 5
          return {
            name: `${option}-${index}`,
            text: `:${emojis[index]}:`,
            type: 'button',
            value: `${option}-${index}`
          }
        })
      }]
      : [{}]
  ]
}

function pollOptionsString (items) {
  return items.options.reduce((text, option, index) => (
    `${text}:${emojis[index]}: ${option} \n\n`
  ), '')
}

function pollEnhancedOptionsString (items, currentPollAnswers) {
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
  mapAttatchmenBody,
  pollOptionsString,
  pollEnhancedOptionsString
}
