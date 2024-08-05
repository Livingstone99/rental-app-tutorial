const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");

const Config = require("../models/config");
const { catchAsync } = require("../utils/catchAsync");

dotenv.config();

const createConfig = catchAsync(async (req, res, next) => {
  let verifyConfig = await Config.find({});

  if (verifyConfig.length > 0) {
    return res.status(200).send({
      exist: true,
      message: "Config already exist"
    });
  }

  let newConfig = new Config({
    ...req.body
  });
  await newConfig.save();

  return res.send({
    // ...getConfig._doc,
    registered: true,
    message: "Config sumitted successfully"
  });
});

const updateConfig = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let verifyConfig = await Config.find({});

  if (verifyConfig.length > 0) {
    await Config.updateOne(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    let getUpdatedConfig = await Config.find({});
    return res.send({ config: getUpdatedConfig });
  }
  return res.send({
    exist: false,
    message: "The config you want to update doesn't exist"
  });
});

const deleteConfig = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyConfig = await Config.findOne();
  if (verifyConfig) {
    let deleteConfig = await Config.deleteOne({ _id: id });
    return res.send({
      message: "deleted"
    });
  }
  return res.send({
    exist: false,
    message: "The config you want to delete doesnt exist"
  });
});

const getSpecificConfigs = catchAsync(async (req, res, next) => {
  let allConfig = await Config.findOne({ _id: req.params.id });
  return res.send({ config: allConfig });
});

const getAllConfigs = catchAsync(async (req, res, next) => {
  let allConfig = await Config.find({});
  return res.send({
    config: allConfig[0]
  });
});

module.exports = {
  createConfig,
  updateConfig,
  deleteConfig,
  getAllConfigs,
  getSpecificConfigs
};
