const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");

const Report = require("../models/report");
const { catchAsync } = require("../utils/catchAsync");
const { errorHandling } = require("../utils/errorHandling");

dotenv.config();

const createReport = catchAsync(async (req, res, next) => {
  const { title, message, user_id } = req.body;

  if (!title || !message || !user_id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let newReport = new Report({
    ...req.body
  });
  await newReport.save();

  return res.send({
    // ...getReport._doc,
    registered: true,
    message: "Report sumitted successfully"
  });
});

const updateReport = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let verifyReport = await Report.findOne({ _id: id });

  if (verifyReport) {
    await Report.updateOne(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    let getUpdatedReport = await Report.findOne({ _id: id });

    return res.send({
      property: getUpdatedReport,
      message: "Updated successfully"
    });
  }

  return res.send({
    exist: false,
    message: "The report you want to update doesn't exist"
  });
});

const deleteReport = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }
  let verifyReport = await Report.findOne({ _id: id });
  if (verifyReport) {
    let deleteReport = await Report.deleteOne({ _id: id });
    return res.send({
      message: "deleted successfully"
    });
  }
  return res.send({
    exist: false,
    message: "The report you want to delete doesnt exist"
  });
});

const getSpecificReports = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let reportData = await Report.findOne({
    _id: req.params.id
  });

  return res.send({
    property: reportData
  });
});

const getAllReports = catchAsync(async (req, res, next) => {
  let allReport = await Report.find({});
  return res.send({
    property: allReport
  });
});

const getAllUserReport = catchAsync(async (req, res, next) => {
  const { user_id } = req.params;

  if (!user_id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let allReport = await Report.find({
    user_id
  });

  return res.send({
    property: allReport
  });
});

const countDoc = catchAsync(async (req, res, next) => {
  let allReport = await Report.countDocuments({});
  return res.send({ count: allReport });
});

module.exports = {
  createReport,
  updateReport,
  deleteReport,
  getAllReports,
  getSpecificReports,
  getAllUserReport,
  countDoc
};
