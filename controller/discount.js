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

const Discount = require("../models/discount");
const { getDateInYYMMDD } = require("../utils/functions");
const { errorHandling } = require("../utils/errorHandling");

dotenv.config();

const createDiscount = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  if (!code)
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });

  let newDiscount = new Discount({
    ...req.body
  });

  await newDiscount.save();

  // fetching discount data
  return res.send({
    message: "Discount created",
    registered: true
  });
});

const updateDiscount = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let verifyDiscount = await Discount.findOne({ _id: id });
  if (verifyDiscount) {
    await Discount.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    return res.send({ message: "Discount updated successfully" });
  }
  return errorHandling(res, {
    message: "Not found",
    status: 404
  });
});

const deleteDiscount = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let deleteDiscount = await Discount.findByIdAndDelete({ _id: id });
  if (!deleteDiscount)
    return errorHandling(res, {
      message: "Not found",
      status: 404
    });
  return res.send({ message: "Discount deleted successfully" });
});

const getDiscount = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let Discounts = await Discount.findOne({ _id: id });
  if (!Discounts)
    return errorHandling(res, {
      message: "Not found",
      status: 404
    });
  return res.send({ discount: Discounts });
});

const getActifDiscounts = catchAsync(async (req, res, next) => {
  let Discounts = await Discount.find({
    status: true
  });
  if (!Discounts)
    return errorHandling(res, {
      message: "Not found",
      status: 404
    });
  return res.send({ discount: Discounts });
});

const getAllDiscounts = catchAsync(async (req, res, next) => {
  let allDiscounts = await Discount.find().sort({ _id: -1 });
  return res.send({ discount: allDiscounts });
});

const countAll = catchAsync(async (req, res, next) => {
  let allDiscounts = await Discount.countDocuments({});
  return res.send({ discount: allDiscounts });
});

module.exports = {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscount,
  getAllDiscounts,
  getActifDiscounts,
  countAll
};
