function PollOwnerException(
  message = 'Only the owner of the poll can remove this poll'
) {
  this.message = message;
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error)
    Error.captureStackTrace(this, PollOwnerException);
  else this.stack = new Error().stack;
}

PollOwnerException.prototype = Object.create(Error.prototype);
PollOwnerException.prototype.name = 'PollOwnerException';
PollOwnerException.prototype.constructor = PollOwnerException;

module.exports = PollOwnerException;
