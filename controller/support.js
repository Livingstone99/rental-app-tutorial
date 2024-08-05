const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");

const Support = require("../models/support");
const { catchAsync } = require("../utils/catchAsync");

dotenv.config();

const createSupport = catchAsync(async (req, res, next) => {
  const { booking_id, message, type, user_id } = req.body;

  if (!booking_id || !message || !type || !user_id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }
  let newSupport = new Support({
    ...req.body
  });

  await newSupport.save();

  return res.send({
    // ...getSupport._doc,
    registered: true,
    message: "Support sumitted successfully"
  });
});

const updateSupport = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let verifySupport = await Support.findOne({ _id: id });

  if (verifySupport) {
    await Support.updateOne(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    let getUpdatedSupport = await Support.findOne({ _id: id })
      .populate("user_id")
      .populate("booking_id");

    return res.send({
      support: getUpdatedSupport,
      message: "updated successfully"
    });
  }

  return res.send({
    exist: false,
    message: "The help_user you want to update doesn't exist"
  });
});

const deleteSupport = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let verifySupport = await Support.findOne({ _id: id });

  if (verifySupport) {
    let deleteSupport = await Support.deleteOne({ _id: id });
    return res.send({ message: "deleted successfully" });
  }

  return res.send({
    exist: false,
    message: "The help_user you want to delete doesnt exist"
  });
});

const getSpecificSupports = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }
  let supportData = await Support.findOne({
    _id: id
  })
    .populate("user_id")
    .populate("booking_id");

  return res.send({ support: supportData });
});

const getAllSupports = catchAsync(async (req, res, next) => {
  let allSupport = await Support.find({})
    .populate("user_id")
    .populate("booking_id");

  return res.send({ support: allSupport });
});

const getAllLandlordSupport = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }
  let allSupport = await Support.find({
    user_id: id,
    type: "landlord"
  })
    .populate("user_id")
    .populate("booking_id");

  return res.send({ support: allSupport });
});

const getAllUserSupport = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let allSupport = await Support.find({
    user_id: id,
    type: "user"
  })
    .populate("user_id")
    .populate("booking_id");

  return res.send({ support: allSupport });
});

const countDoc = catchAsync(async (req, res, next) => {
  let allSupport = await Support.countDocuments({});

  return res.send({ count: allSupport });
});

module.exports = {
  createSupport,
  updateSupport,
  deleteSupport,
  getAllSupports,
  getSpecificSupports,
  getAllLandlordSupport,
  getAllUserSupport,
  countDoc
};
