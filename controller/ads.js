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

const Ad = require("../models/ads");
const { getDateInYYMMDD } = require("../utils/functions");
const { errorHandling } = require("../utils/errorHandling");

dotenv.config();

const createAd = catchAsync(async (req, res, next) => {
  const { title, description, cover } = req.body;

  if (!title || !description || !cover)
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });

  let newAd = new Ad({
    ...req.body
  });

  await newAd.save();

  // fetching ad data
  return res.send({
    message: "Ad created",
    registered: true
  });
});

const updateAd = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let verifyAd = await Ad.findOne({ _id: id });
  if (verifyAd) {
    await Ad.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    return res.send({ message: "Ad updated successfully" });
  }
  return errorHandling(res, {
    message: "Not found",
    status: 404
  });
});

const deleteAd = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let deleteAd = await Ad.findByIdAndDelete({ _id: id });
  if (!deleteAd)
    return errorHandling(res, {
      message: "Not found",
      status: 404
    });
  return res.send({ message: "Ad deleted successfully" });
});

const getAd = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let Ads = await Ad.findOne({ _id: id });
  if (!Ads)
    return errorHandling(res, {
      message: "Not found",
      status: 404
    });
  return res.send({ ad: Ads });
});

const getActifAds = catchAsync(async (req, res, next) => {
  let Ads = await Ad.find({
    status: 0,
    period_start: { $lte: getDateInYYMMDD() },
    period_end: { $gte: getDateInYYMMDD() }
  });
  if (!Ads)
    return errorHandling(res, {
      message: "Not found",
      status: 404
    });
  return res.send({ ad: Ads });
});

const getAllAds = catchAsync(async (req, res, next) => {
  let allAds = await Ad.find().sort({ _id: -1 });
  return res.send({ ad: allAds });
});

const countAll = catchAsync(async (req, res, next) => {
  let allAds = await Ad.countDocuments({});
  return res.send({ ad: allAds });
});

module.exports = {
  createAd,
  updateAd,
  deleteAd,
  getAd,
  getAllAds,
  getActifAds,
  countAll
};
