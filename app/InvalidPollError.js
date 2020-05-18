class InvalidPollError extends Error {
  constructor() {
    super('Invalid Poll.');
  }
}

module.exports = InvalidPollError;
