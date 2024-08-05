const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");

const Payment = require("../models/payment");
const Booking = require("../models/booking");
const Inspection = require("../models/inspection");
const Notification = require("../models/notification");
const { catchAsync } = require("../utils/catchAsync");
const { errorHandling } = require("../utils/errorHandling");
const Property = require("../models/property");
const { sendPushDirect } = require("./push");
const { generateDateRange } = require("../utils/functions");

dotenv.config();

const successfulPayment = catchAsync(async (req, res, next) => {
  const { num_transaction_from_gu, amount, data } = req.query;

  if (!num_transaction_from_gu || !amount || !data) {
    return res.render("failed", {
      transactionId: num_transaction_from_gu,
      amount
    });
  }

  // check if payment has already been registered and also check state of booking has changed
  const checkIfExistPayment = await Payment.findOne({
    transaction_id: num_transaction_from_gu
  });

  const checkIfExistBooking = await Booking.findOne({
    _id: data
  }).populate("property");

  if (checkIfExistPayment) {
    return res.render("failed", {
      transactionId: num_transaction_from_gu,
      amount
    });
  }

  if (!checkIfExistBooking || checkIfExistBooking.paid === true) {
    return res.render("failed", {
      transactionId: num_transaction_from_gu,
      amount
    });
  }

  let newPayment = new Payment({
    transaction_id: num_transaction_from_gu,
    amount
  });

  await newPayment.save();

  // let us update booking now
  let updatedBooking = await Booking.updateOne(
    {
      _id: data
    },
    {
      paid: true
    }
  );

  let updateProperty = await property.updateOne(
    {
      _id: checkIfExistBooking.property._id
    },
    {
      $push: { unavailable_date: checkIfExistBooking.bookDate.lastDate }
    }
  );

  return res.render("success", {
    transactionId: num_transaction_from_gu,
    amount
  });
});

const failedPayment = catchAsync(async (req, res, next) => {
  const { num_transaction_from_gu, amount, data } = req.query;

  if (!num_transaction_from_gu || !amount || !data) {
    return res.render("failed", {
      transactionId: num_transaction_from_gu,
      amount
    });
  }

  // check if payment has already been registered and also check state of booking has changed
  const checkIfExistPayment = await Payment.findOne({
    transaction_id: num_transaction_from_gu
  });

  const checkIfExistBooking = await Booking.findOne({
    _id: data
  });

  if (checkIfExistPayment) {
    return res.render("failed", {
      transactionId: num_transaction_from_gu,
      amount
    });
  }

  if (!checkIfExistBooking || checkIfExistBooking.paid === true) {
    res.render("failed", { transactionId: num_transaction_from_gu, amount });
  }

  // let us delete the record now of the booking

  let deleteBooking = await Booking.deleteOne({
    _id: data
  });

  return res.render("failed", {
    transactionId: num_transaction_from_gu,
    amount
  });
});

const deletePayment = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyPayment = await Payment.findOne({ _id: id });
  if (verifyPayment) {
    let deletePayment = await Payment.deleteOne({ _id: id });
    return res.send({ message: "deleted successfully" });
  } else {
    res.send({
      exist: false,
      message: "The paiement you want to delete doesnt exist"
    });
  }
});

const getSpecificPayment = catchAsync(async (req, res, next) => {
  let payment = await Payment.find({
    transaction_id: req.params.transaction_id
  });
  return res.send({ payment: payment });
});

const getAllPayments = catchAsync(async (req, res, next) => {
  let allPayment = await Payment.find({});
  return res.send({ payment: allPayment });
});

const countDoc = catchAsync(async (req, res, next) => {
  let getAllPayments = await Payment.countDocuments({});
  return res.send({ count: getAllPayments });
});

const callbackPayment = catchAsync(async (req, res, next) => {
  const { transaction_id, transaction_status } = req.body;

  const { booking_id, amount } = req.query;

  if (!transaction_id || !transaction_status || !booking_id) {
    console.log("it has failed to update due to missing data");
    return errorHandling(res, {
      status: 400,
      message: "it has failed to update"
    });
  }

  // check if payment has already been registered and also check state of booking has changed
  const newPayment = new Payment({
    transaction_id: transaction_id,
    amount
  });

  await newPayment.save();

  const checkIfExistBooking = await Booking.findOne({
    _id: booking_id
  })
    .populate("property")
    .populate("user")
    .populate("landlord");

  if (!checkIfExistBooking) {
    return errorHandling(res, {
      status: 400,
      message: "booking not existing"
    });
  }

  // let us update booking now
  let updatedBooking = await Booking.updateOne(
    {
      _id: booking_id
    },
    {
      paid: true
    }
  );

  // generate date range

  // Example usage:
  let dateRange = generateDateRange(
    checkIfExistBooking.bookDate.startDate,
    checkIfExistBooking.bookDate.lastDate
  );

  let updateProperty = await Property.updateOne(
    {
      _id: checkIfExistBooking.property._id
    },
    {
      $push: {
        unavailable_date: {
          $each: dateRange === null ? [] : dateRange
        }
      },
      $inc: {
        total_booked: 1
      }
    }
  );

  // save into notification module

  // user first

  let newNotifcationUser = await Notification({
    user_id: checkIfExistBooking.user._id,
    type: "user",
    message: "Votre commande de propriété est un succès"
  });

  // landlord
  let newNotifcationLandlord = await Notification({
    user_id: checkIfExistBooking.landlord._id,
    type: "landlord",
    message:
      "L'une de vos propriété a été commandée, veuillez consulter votre historique de commande"
  });

  await newNotifcationUser.save();
  await newNotifcationLandlord.save();

  // send to user
  sendPushDirect(
    "Commande effectuée",
    "Votre commande de propriété est un succès",
    [checkIfExistBooking.user.pushToken]
  );

  // send to landlord
  sendPushDirect(
    "Proprieté commandée",
    "L'une de vos propriété a été commandée, veuillez consulter votre historique de commande",
    [checkIfExistBooking.landlord.pushToken]
  );

  console.log("done all");

  return errorHandling(res, {
    status: 200,
    message: "booking successfully paid"
  });
});

const callbackPaymentInspection = catchAsync(async (req, res, next) => {
  const { transaction_id, transaction_status } = req.body;

  const { inspection_id, amount } = req.query;

  if (!transaction_id || !transaction_status || !inspection_id) {
    console.log("it has failed to update due to missing data");
    return errorHandling(res, {
      status: 400,
      message: "it has failed to update"
    });
  }

  // check if payment has already been registered and also check state of booking has changed
  const newPayment = new Payment({
    transaction_id: transaction_id,
    amount
  });

  await newPayment.save();

  const checkIfExistInspection = await Inspection.findOne({
    _id: inspection_id
  })
    .populate("property")
    .populate("user")
    .populate("landlord");

  if (!checkIfExistInspection) {
    return errorHandling(res, {
      status: 400,
      message: "inspection not existing"
    });
  }

  // let us update booking now
  let updatedInspection = await Inspection.updateOne(
    {
      _id: inspection_id
    },
    {
      paid: true
    }
  );

  // save into notification module

  // user first

  await Notification({
    user_id: checkIfExistBooking.user._id,
    type: "user",
    message: "Votre paiement pour l'inspection a bien pris en compte"
  });

  // send to user
  sendPushDirect(
    "Inpection confirmée",
    "Votre paiement pour l'inspection a bien pris en compte",
    [checkIfExistBooking.user.pushToken]
  );

  return errorHandling(res, {
    status: 200,
    message: "Inpection successfully paid"
  });
});

module.exports = {
  successfulPayment,
  failedPayment,
  deletePayment,
  getAllPayments,
  getSpecificPayment,
  countDoc,
  callbackPayment,
  callbackPaymentInspection
};
