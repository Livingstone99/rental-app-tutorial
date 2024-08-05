const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

const crypto = require("crypto");

const Facility = require("../models/facilities");
const { catchAsync } = require("../utils/catchAsync");
const { errorHandling } = require("../utils/errorHandling");
const createManyFacilities = catchAsync(async (req, res, next) => {
  Facility.create(req.body)
    .then(async function () {
      console.log("Data inserted"); // Success
      const allFacilities = await Facility.find({});
      return res.send({
        data: allFacilities,
        exist: false,
        registered: true,
        message: "Facilities sumitted successfully"
      });
    })
    .catch(function (error) {
      console.log(error); // Failure
      return res.status(401).send({
        exist: true,
        message: "Something went wrong"
      });
    });
});
const createFacility = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(401).send({
      message: "name must be provided"
    });
  }
  const checkIfExist = await Facility.findOne({
    name: name
  });
  if (checkIfExist) {
    return res.status(401).send({
      exist: true,
      message: "Facility already exist"
    });
  }
  //   let verifyFacility = await Facility.find({});

  //   if (verifyFacility.length > 0) {
  //     return res.status(200).send({
  //       exist: true,
  //       message: "Facility already exist"
  //     });
  //   }

  let newFacility = new Facility({
    ...req.body
  });
  await newFacility.save();

  return res.send({
    facility: newFacility,
    exist: false,
    registered: true,
    message: "Facility sumitted successfully"
  });
});

const updateFacility = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let verifyFacility = await Facility.findOne({ _id: id });
  if (verifyFacility) {
    await Facility.updateOne(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    let getUpdatedFacility = await Facility.findOne({ _id: id });
    return res.send({ facility: getUpdatedFacility });
  } else {
    return res.send({
      exist: false,
      message: "The facility you want to update doesn't exist"
    });
  }
});

const deleteFacility = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyFacility = await Facility.findOne({ _id: id });
  if (verifyFacility) {
    let deleteFacility = await Facility.deleteOne({ _id: id });
    return res.send({ message: "deleted successfully" });
  } else {
    return res.send({
      exist: false,
      message: "The facility you want to delete doesnt exist"
    });
  }
});

const getSpecificFacilitys = catchAsync(async (req, res, next) => {
  let allFacility = await Facility.findOne({ _id: req.params.id });
  return res.send({ facility: allFacility });
});

const getAllFacilitys = catchAsync(async (req, res, next) => {
  let allFacility = await Facility.find({});
  return res.send({ facility: allFacility });
});

const getActifFacility = catchAsync(async (req, res, next) => {
  let allFacility = await Facility.find({
    status: true
  }).sort({ _id: -1 });

  return errorHandling(res, {
    message: "Facility found",
    status: 200,
    facility: allFacility
  });
});

module.exports = {
  createFacility,
  updateFacility,
  deleteFacility,
  getAllFacilitys,
  getSpecificFacilitys,
  createManyFacilities,
  getActifFacility
};
