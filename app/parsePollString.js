const Poll = require('./poll');

function removeDoubleCuotes(string) {
  // u201D is “ and u201C is ”
  return string.replace(/\u201D/g, '"').replace(/\u201C/g, '"');
}

function extractPollDataFromCommand(command) {
  // Slack inyects weird cuoutes when you use regular double cuoutes ("")
  const sanitizedCommand = removeDoubleCuotes(command);
  const mode =
    sanitizedCommand.search('-m') >= 0
      ? Poll.PollMode.MULTIPLE
      : Poll.PollMode.SINGLE;

  // Clean emptys and flags
  const rawOptions = sanitizedCommand
    .replace('-m', '')
    .split('"')
    .map((s) => s.trim())
    .filter((s) => s !== '' && s !== ' ');

  return {
    mode,
    question: rawOptions[0],
    options: rawOptions.slice(1),
  };
}

// parse poll from slack slash command
// eslint-disable-next-line camelcase
module.exports = function parsePollString({ text, userId }) {
  const pollData = extractPollDataFromCommand(text);

  const poll = Poll({
    options: pollData.options,
    mode: pollData.mode,
    owner: userId,
    question: pollData.question,
  });

  return poll;
};
