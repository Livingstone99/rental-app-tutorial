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

const Notice = require("../models/notice");
const { getDateInYYMMDD } = require("../utils/functions");
const { errorHandling } = require("../utils/errorHandling");

dotenv.config();

const createNotice = catchAsync(async (req, res, next) => {
  const { slides, redirect, period_start, period_end } = req.body;

  if (!slides || slides.length === 0 || !period_start || !period_end)
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });

  let newNotice = new Notice({
    ...req.body
  });

  await newNotice.save();

  // fetching ad data
  return res.send({
    message: "Notice created",
    registered: true
  });
});

const updateNotice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let verifyNotice = await Notice.findOne({ _id: id });
  if (verifyNotice) {
    await Notice.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    return res.send({ message: "Notice updated successfully" });
  }
  return errorHandling(res, {
    message: "Not found",
    status: 404
  });
});

const deleteNotice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let deleteNotice = await Notice.findByIdAndDelete({ _id: id });
  if (!deleteNotice)
    return errorHandling(res, {
      message: "Not found",
      status: 404
    });
  return res.send({ message: "Notice deleted successfully" });
});

const getNotice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let Notices = await Notice.findOne({ _id: id });
  if (!Notices)
    return errorHandling(res, {
      message: "Not found",
      status: 404
    });
  return res.send({ notice: Notices });
});

const getActifNotices = catchAsync(async (req, res, next) => {
  let Notices = await Notice.find({
    status: 0,
    period_start: { $lte: getDateInYYMMDD() },
    period_end: { $gte: getDateInYYMMDD() }
  });
  if (!Notices)
    return errorHandling(res, {
      message: "Not found",
      status: 404
    });
  return res.send({ notice: Notices });
});

const getAllNotices = catchAsync(async (req, res, next) => {
  let allNotices = await Notice.find().sort({ _id: -1 });
  return res.send({ notice: allNotices });
});

const countAll = catchAsync(async (req, res, next) => {
  let allNotices = await Notice.countDocuments({});
  return res.send({ notice: allNotices });
});

module.exports = {
  createNotice,
  updateNotice,
  deleteNotice,
  getNotice,
  getAllNotices,
  getActifNotices,
  countAll
};
