class InvalidPollOptionError extends Error {
  constructor(option) {
    super(`${option} is not a valid option.`);
  }
}

module.exports = InvalidPollOptionError;
