function splitItems (text) {
  const rawOptions = text.split('"').filter(s => s !== '' && s !== ' ')
  return {
    question: rawOptions[0],
    options: rawOptions.slice(1)
  }
}

module.exports = {
  splitItems
}
