const constants = require('./constants');

function extractElementsFromSlackText(text) {
  const mode =
    text.search('-m') >= 0
      ? constants.pollMode.MULTIPLE
      : constants.pollMode.SINGLE;

  const rawOptions = text
    .replace('-m', '')
    .split('"')
    .map(s => s.trim())
    .filter(s => s !== '' && s !== ' ');

  return {
    mode,
    question: rawOptions[0],
    options: rawOptions.slice(1),
  };
}

function reducePollOptionsString(items, emojis) {
  return items.options.reduce(
    (text, option, index) => `${text}:${emojis[index]}: ${option} \n\n`,
    ''
  );
}

// Enhance polloptions with user answers
function reducePollEnhancedOptionsString(items, currentPollAnswers, emojis) {
  return items.options.reduce((text, option, index) => {
    const answerValue = `${option}-${index}`;
    const allUserAnswers = currentPollAnswers.filter(
      cpa => cpa.answer === answerValue
    );

    const usernamesString = allUserAnswers.reduce(
      (baseText, user) => `${baseText} @${user.username}`,
      ''
    );

    const counterString =
      allUserAnswers.length !== 0 ? `: \`${allUserAnswers.length}\`` : '';

    return `${text}:${
      emojis[index]
    }: ${option}${counterString} ${usernamesString} \n\n `;
  }, '');
}

function stringFromPollMode(pollMode) {
  return pollMode === constants.pollMode.MULTIPLE ? 'Multiple' : 'Single';
}

module.exports = {
  extractElementsFromSlackText,
  reducePollOptionsString,
  reducePollEnhancedOptionsString,
  stringFromPollMode,
};
