const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mailgun = require("mailgun-js");
const { google } = require("googleapis");
const crypto = require("crypto");
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");
const { signedToken } = require("../utils/tokenSigning");
const { containsAny, uuidv4 } = require("../utils/functions");
const { FileFactory } = require("../handlers/file/file_factory");

dotenv.config();

const createUrlMobile = catchAsync(async (req, res, next) => {
  let awsfactory = new FileFactory().create("aws");
  let data = await awsfactory.upload64(req.body.file, "files/");
  console.log(data);
  if (data) {
    return res.send({ url: data, message: "url received", success: true });
  }
  return res.send({ message: "url not received", success: false });
});

const createUrlWeb = catchAsync(async (req, res, next) => {
  console.log("One");
  if (req.files) {
    console.log("Two");
    console.log("Three");
    let awsfactory = new FileFactory().create("aws");
    let data = await awsfactory.upload(
      req.files.file.data,
      uuidv4(),
      req.files.file.name.split(".").slice(-1).toString(),
      "files/"
    );
    console.log("Four");
    if (data) {
      return res.send({ url: data, message: "url received", success: true });
    }
    return res.send({ message: "url not received", success: false });
  } else {
    console.log("None");
    return res.send({ message: "url not received", success: false });
  }
});

const deleteUrl = catchAsync(async (req, res, next) => {
  let awsfactory = new FileFactory().create("aws");
  let data = await awsfactory.delete(req.body.filename, "files/");
  console.log(data);
  if (data) {
    return res.send({ message: "deleted successfully", success: true });
  }
  return res.send({ message: "not deleted", success: false });
});

module.exports = {
  createUrlMobile,
  createUrlWeb,
  deleteUrl
};
