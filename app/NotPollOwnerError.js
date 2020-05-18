class NotPollOwnerError extends Error {
  constructor() {
    super('Only the owner of the poll can remove this poll.');
  }
}

module.exports = NotPollOwnerError;
