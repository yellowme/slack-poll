const AppError = require('./AppError');

class InvalidPollError extends AppError {
  constructor(description = 'Invalid Poll.') {
    super('InvalidPollError', description);
  }
}

module.exports = InvalidPollError;
