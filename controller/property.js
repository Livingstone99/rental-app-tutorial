const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");

const Property = require("../models/property");
const Rate = require("../models/rate");
const { catchAsync } = require("../utils/catchAsync");
const { sortArrayByDiscount } = require("../utils/functions");

dotenv.config();

const createProperty = catchAsync(async (req, res, next) => {
  console.log("am here");
  const {
    title,
    description,
    houseType,
    facilities,
    address,
    cost,
    images,
    landlord
  } = req.body;
  if (
    !title ||
    !cost ||
    !images ||
    !description ||
    !facilities ||
    !address ||
    !houseType ||
    !landlord
  ) {
    return res.status(400).send({
      message: "Datas are missing to create a property"
    });
  }

  console.log("first");

  let newProperties = new Property({
    ...req.body
  });

  await newProperties.save();

  console.log("second");

  console.log(newProperties._id);

  // get latest data
  const latestProperty = await Property.findOne({
    _id: newProperties._id
  }).populate("landlord");

  console.log(latestProperty);

  return res.send({
    property: latestProperty,
    registered: true,
    message: "Property sumitted successfully"
  });
});
const updateProperty = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyProperty = await Property.findOne({ _id: id }).populate("landlord");

  if (verifyProperty) {
    await Property.updateOne(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    let getUpdatedProperty = await Property.findOne({
      _id: id
    }).populate("landlord");

    return res.send({ property: getUpdatedProperty });
  } else {
    return res.send({
      exist: false,
      message: "The property you want to update doesn't exist"
    });
  }
});

const deleteProperty = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyProperty = await Property.findOne({ _id: id });

  if (verifyProperty) {
    let deleteProperty = await Property.deleteOne({ _id: id });

    return res.send({ message: "deleted successfully" });
  } else {
    res.send({
      exist: false,
      message: "The property you want to delete doesnt exist"
    });
  }
});

const getLandlordProperties = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      message: "no landlord provided"
    });
  }

  let findProperty = await Property.find({
    landlord: id
  })
    .sort({ _id: -1 })
    .populate("landlord");

  return res.send({ property: findProperty });
});

const getSpecificProperty = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let allProperty = await Property.findOne({
    _id: id
  })
    .sort({ _id: -1 })
    .populate("landlord");

  return res.send({ property: allProperty });
});

const getActifProperties = catchAsync(async (req, res, next) => {
  let allProperty = await Property.find({
    status: 1,
    available: true
  })
    .sort({ _id: -1 })
    .populate("landlord");

  const sortedProperties = sortArrayByDiscount(allProperty);

  return res.send({ property: sortedProperties });
});

const getActifPerCityProperties = catchAsync(async (req, res, next) => {
  const { city } = req.params;

  let allProperty = await Property.find({
    status: 1,
    available: true,
    city: city
  })
    .sort({ _id: -1 })
    .populate("landlord");

  const sortedProperties = sortArrayByDiscount(allProperty);

  return res.send({ property: sortedProperties });
});

const getAllProperties = catchAsync(async (req, res, next) => {
  let allProperty = await Property.find({})
    .sort({ _id: -1 })
    .populate("landlord");
  return res.send({ property: allProperty });
});

module.exports = {
  createProperty,
  updateProperty,
  deleteProperty,
  getActifProperties,
  getActifPerCityProperties,
  getAllProperties,
  getSpecificProperty,
  getLandlordProperties
};
