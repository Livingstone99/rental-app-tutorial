const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mailgun = require("mailgun-js");
const { google } = require("googleapis");
const crypto = require("crypto");
const { catchAsync } = require("../utils/catchAsync");
const { errorHandling } = require("../utils/errorHandling");
const { signedToken } = require("../utils/tokenSigning");

const City = require("../models/city");
const { sortArray } = require("../utils/functions");

dotenv.config();

const createCity = catchAsync(async (req, res, next) => {
  const { name, pic } = req.body;

  if (!name || !pic)
    return errorHandling(res, {
      message: "Nom & pic sont obligatoires",
      status: 400
    });

  let newCity = new City({
    ...req.body
  });

  await newCity.save();
  // fetching permissiondata
  return errorHandling(res, {
    message: "City created successfully",
    status: 200
  });
});

const updateCity = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let verifyCity = await City.findOne({ _id: id });
  if (verifyCity) {
    await City.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    return errorHandling(res, {
      message: "City updated",
      status: 200
    });
  }
  return errorHandling(res, {
    message: "City not updated",
    status: 404
  });
});

const deleteCity = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let deleteCity = await City.findByIdAndDelete({ _id: id });

  if (!deleteCity)
    return errorHandling(res, {
      message: "City not found",
      status: 404
    });

  return errorHandling(res, {
    message: "City deleted successfully",
    status: 200
  });
});

const getCity = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let getCity = await City.findOne({ _id: id });
  if (getCity)
    return errorHandling(res, {
      message: "City found",
      status: 200,
      city: getCity
    });

  return res.status(404).send({ message: "city not found" });
});

const getActifCity = catchAsync(async (req, res, next) => {
  let allCity = await City.find({
    status: true
  }).sort({ _id: -1 });

  const sortedCity = sortArray(allCity);

  return errorHandling(res, {
    message: "City found",
    status: 200,
    city: sortedCity
  });
});

const getAllCity = catchAsync(async (req, res, next) => {
  let allCity = await City.find().sort({ _id: -1 });
  return errorHandling(res, {
    message: "City found",
    status: 200,
    city: allCity
  });
});

module.exports = {
  createCity,
  updateCity,
  deleteCity,
  getCity,
  getActifCity,
  getAllCity
};
