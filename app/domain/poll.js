function createPoll({ text, owner, channel, mode = 's' }) {
  return {
    text,
    owner,
    channel,
    mode,
  };
}

module.exports = createPoll;
