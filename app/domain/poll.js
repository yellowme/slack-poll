function createPoll({
  text,
  question,
  options,
  owner,
  channel,
  timestamp,
  mode = 's',
}) {
  return {
    text,
    question,
    options,
    channel,
    mode,
    owner,
    timestamp,
  };
}

module.exports = createPoll;
