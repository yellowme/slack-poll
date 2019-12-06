function createPollAnswer({ id, option, owner, poll }) {
  return {
    id,
    option,
    owner,
    poll,
  };
}

module.exports = createPollAnswer;
