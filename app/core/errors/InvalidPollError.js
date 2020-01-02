class InvalidPollOptionError extends Error {
  constructor() {
    super('Invalid Poll.');
  }
}

module.exports = InvalidPollOptionError;
