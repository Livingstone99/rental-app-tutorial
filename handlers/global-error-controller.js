const dotenv = require("dotenv");
const { AppError } = require("../utils/appError");

dotenv.config();

/**
 * Handling non operational errors. Functions
 * @param {*} err
 * @returns
 */

// 1. Cast Error
const handleCastErrorDB = (err) => {
  console.log(err);
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// 2. Duplicate Eror
const handleDuplicateErrorDB = (err) => {
  console.log(err);
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value} Please use another value`;
  return new AppError(message, 400, { exists: true, duplicate: true });
};

// 3. Validation Error
const handleValidationErrorDB = (err) => {
  // Object.values(err.errors) -> gets all the objects within 🗡️ err.errors 🗡️
  const errors = Object.values(err.errors).map((element) => element.message);
  const message = `Invalid input data: \n ${errors.join(". ")}`;
  return new AppError(message, 400, { cantValidate: true });
};

// JWT
// 1. JWTError
const handleJWTError = () =>
  new AppError("Invalid token please login again", 401, {
    logged: false,
    tokenInvalid: true
  });

// 2. handleTokenExpiredError
const handleTokenExpiredError = () =>
  new AppError("Token expired, please login again", 401, {
    logged: false,
    tokenExpired: true
  });

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
    data: err.data
  });
};

const sendErrorProduction = (err, res) => {
  // For an operational error that is trusted
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      data: err.data
    });

    // Programming or unknown error: Don't leak the details to the client
  } else {
    // 1) Log error in console
    console.error("Error 💥💥", err);

    // 2) Sending generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
      data: err.data
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack); // For logging the stack trace

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.ENVIRON === "development") {
    sendErrorDev(err, res);
  } else if (process.env.ENVIRON === "production") {
    console.log(err.name);
    let error = err;
    if (err.name === "CastError") {
      // For cast error in mongoDB
      error = handleCastErrorDB(error);
    }

    if (err.code === 11000) {
      // For duplicate key Error in MongoDB
      error = handleDuplicateErrorDB(error);
    }

    if (err.name === "ValidationError") {
      // For handling validation errors
      error = handleValidationErrorDB(error);
    }

    if (err.name === "JsonWebTokenError") error = handleJWTError();

    if (err.name === "TokenExpiredError") {
      error = handleTokenExpiredError();
    }
    sendErrorProduction(error, res);
  }
};
