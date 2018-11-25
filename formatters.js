const utils = require('./utils')

function cleanDoubleQuotes (text) {
  return utils.replaceAll(utils.replaceAll(text, '\u201D', '"'), '\u201C', '"')
}

function splitItems (text) {
  const rawOptions = text.split('"').filter(s => s !== '' && s !== ' ')
  return {
    question: rawOptions[0],
    options: rawOptions.slice(1)
  }
}

module.exports = {
  cleanDoubleQuotes,
  splitItems
}
