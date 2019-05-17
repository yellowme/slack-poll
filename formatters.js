const constants = require('./constants');
const utils = require('./utils');

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

// Base message template from https://api.slack.com/docs/message-formatting
function buildMessageTemplate(currentPoll, parsedPollData) {
  return {
    attachments: [
      {
        fallback: parsedPollData.title,
        title: parsedPollData.title,
        callback_id: currentPoll.id,
        color: '#ffd100',
        attachment_type: 'default',
        footer: stringFromPollMode(currentPoll.mode),
      },
      {
        fallback: parsedPollData.options,
        text: parsedPollData.options,
        callback_id: currentPoll.id,
        color: '#ffd100',
        attachment_type: 'default',
      },
      ...utils
        .chunkArray(parsedPollData.messageItems.options, 5)
        .map((chunk, chunkIndex) => ({
          fallback: '',
          title: '',
          callback_id: currentPoll.id,
          color: '#ffd100',
          attachment_type: 'default',
          actions: chunk.map((option, index) => {
            const currentIndex = chunkIndex * 5 + index;
            return {
              name: `${option}-${currentIndex}`,
              text: `:${parsedPollData.emojis[currentIndex]}:`,
              type: 'button',
              value: `${option}-${currentIndex}`,
            };
          }),
        })),
      {
        fallback: '',
        title: '',
        callback_id: currentPoll.id,
        color: '#ffd100',
        attachment_type: 'default',
        actions: [
          {
            name: 'cancel',
            text: 'Delete Poll',
            style: 'danger',
            type: 'button',
            value: 'cancel-null',
            confirm: {
              title: 'Delete Poll?',
              text: 'Are you sure you want to delete the Poll?',
              ok_text: 'Yes',
              dismiss_text: 'No',
            },
          },
        ],
      },
    ],
  };
}

module.exports = {
  extractElementsFromSlackText,
  reducePollOptionsString,
  reducePollEnhancedOptionsString,
  stringFromPollMode,
  buildMessageTemplate,
};
