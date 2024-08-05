class AppError extends Error {
  constructor(message, statusCode, data) {
    super(message); // Calling constructor of error class and passing the MESSAGE
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.data = data;

    // Stacktrace is where the error happened in the code
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
