const Poll = require('../../domain/poll');

function pollsStringSerializer(text, user_id) {
  const pollData = extractPollDataFromCommand(text);

  const poll = Poll({
    options: pollData.options,
    mode: pollData.mode,
    owner: user_id,
    question: pollData.question,
  });

  return poll;
}

function extractPollDataFromCommand(command) {
  const sanitizedCommand = removeDoubleCuotes(command);
  const mode = sanitizedCommand.search('-m') >= 0 ? 'm' : 's';

  const rawOptions = sanitizedCommand
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

function removeDoubleCuotes(string) {
  return string.replace('/\u201D/g', '"').replace('/\u201C/g', '"');
}

module.exports = pollsStringSerializer;
