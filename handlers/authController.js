const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { promisify } = require("util");
const AdminModel = require("../models/admin");
const UserModel = require("../models/user");
const { errorHandling } = require("../utils/errorHandling");

dotenv.config();

const protectAdmin = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;
  // 1) Gettting token and checking if its there
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
  }

  if (!token) {
    return errorHandling(res, {
      message: "You are not authorised accessing this ressource (1)",
      status: 401
    });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  // 3) Check if user still exists
  let userStillExists = await AdminModel.findById(decoded.id);
  if (!userStillExists) {
    // If there is no fresh user
    return errorHandling(res, {
      message: "You are not authorised accessing this ressource (2)",
      status: 401
    });
  }
  if (userStillExists.status === 0) {
    // If there is no fresh user
    return errorHandling(res, {
      message: "You are currently disabled (2)",
      status: 401
    });
  }

  req.user = userStillExists;
  // GRANT ACCESS to protected route
  next();
});

const protectUser = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;
  // 1) Gettting token and checking if its there
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
  }

  if (!token) {
    return errorHandling(res, {
      message: "You are not authorised accessing this ressource (1)",
      status: 401
    });
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  // 3) Check if user still exists
  let userStillExists = await UserModel.findById(decoded.id);
  if (!userStillExists) {
    // If there is no fresh user
    return errorHandling(res, {
      message: "You are not authorised accessing this ressource (2)",
      status: 401
    });
  }

  req.user = userStillExists;
  // GRANT ACCESS to protected route
  next();
});

module.exports = { protectAdmin, protectUser };
