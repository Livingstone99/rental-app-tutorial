const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");

const Notification = require("../models/notification");
const { catchAsync } = require("../utils/catchAsync");

dotenv.config();

const createNotification = catchAsync(async (req, res, next) => {
  const { message, type, user_id } = req.body;

  if (!message || !type || !user_id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }
  let newNotification = new Notification({
    ...req.body
  });

  await newNotification.save();

  return res.send({
    // ...getNotification._doc,
    registered: true,
    message: "Notification sumitted successfully"
  });
});

const updateNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let verifyNotification = await Notification.findOne({ _id: id });

  if (verifyNotification) {
    await Notification.updateOne(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    let getUpdatedNotification = await Notification.findOne({
      _id: id
    }).populate("user_id");

    return res.send({
      notification: getUpdatedNotification,
      message: "updated successfully"
    });
  }

  return res.send({
    exist: false,
    message: "The help_user you want to update doesn't exist"
  });
});

const updateManyNotification = catchAsync(async (req, res, next) => {
  const { list } = req.body;

  if (!list) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let getUpdatedNotification = await Notification.updateMany(
    {
      _id: { $in: list }
    },
    {
      $set: {
        seen: true
      }
    }
  ).populate("user_id");

  return res.send({
    notification: getUpdatedNotification,
    message: "updated successfully"
  });
});

const deleteNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let verifyNotification = await Notification.findOne({ _id: id });

  if (verifyNotification) {
    let deleteNotification = await Notification.deleteOne({ _id: id });
    return res.send({ message: "deleted successfully" });
  }

  return res.send({
    exist: false,
    message: "The help_user you want to delete doesnt exist"
  });
});

const getSpecificNotifications = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }
  let notificationData = await Notification.findOne({
    _id: id
  }).populate("user_id");

  return res.send({ notification: notificationData });
});

const getAllNotifications = catchAsync(async (req, res, next) => {
  let allNotification = await Notification.find({}).populate("user_id");

  return res.send({ notification: allNotification });
});

const getAllLandlordNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }
  let allNotification = await Notification.find({
    user_id: id,
    type: "landlord"
  }).populate("user_id");

  return res.send({ notification: allNotification });
});

const getAllUserNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  let allNotification = await Notification.find({
    user_id: id,
    type: "user"
  }).populate("user_id");

  return res.send({ notification: allNotification });
});

const countDoc = catchAsync(async (req, res, next) => {
  let allNotification = await Notification.countDocuments({});

  return res.send({ count: allNotification });
});

module.exports = {
  createNotification,
  updateNotification,
  deleteNotification,
  getAllNotifications,
  getSpecificNotifications,
  getAllLandlordNotification,
  getAllUserNotification,
  updateManyNotification,
  countDoc
};
