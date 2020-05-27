// centralized error object that derives from Node’s Error
// https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/useonlythebuiltinerror.md
class AppError extends Error {
  constructor(name, description) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = name;
    Error.captureStackTrace(this);
  }
}

module.exports = AppError;
