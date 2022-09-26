const { StatusCodes } = require("http-status-codes");

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

class Unauthenticated extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = { BadRequest, Unauthenticated, NotFound };
