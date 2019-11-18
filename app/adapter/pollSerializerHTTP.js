function pollSerializer(pollData) {
  return {
    text: pollData.text,
    channel: pollData.channel,
    mode: pollData.mode,
    owner: pollData.owner,
  };
}

module.exports = {
  serialize: pollSerializer,
};
