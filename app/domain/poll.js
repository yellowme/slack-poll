function createPoll({ id, options, owner, question, mode = 's' }) {
  return {
    id,
    mode,
    options,
    owner,
    question,
  };
}

module.exports = createPoll;
