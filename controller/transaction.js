const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");

const Transaction = require("../models/transaction");
const { catchAsync } = require("../utils/catchAsync");
const { getDateInYYMMDD, getTimeInHHMMSS } = require("../utils/functions");

dotenv.config();

const createTransaction = catchAsync(async (req, res, next) => {
  const json = JSON.parse(JSON.stringify(req.body));

  let currentDate = getDateInYYMMDD();
  let currentTime = getTimeInHHMMSS();

  let newTransaction = new Transaction({
    ...json,
    date: currentDate,
    time: currentTime
  });
  await newTransaction.save();

  return res.send({
    // ...getTransaction._doc,
    registered: true,
    message: "Transaction sumitted successfully"
  });
});

const updateTransaction = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  try {
    let verifyTransaction = await Transaction.findOne({ _id: id }).populate(
      "landlord_data"
    );
    if (verifyTransaction) {
      await Transaction.updateOne(
        { _id: id },
        {
          $set: {
            ...req.body
          }
        }
      );
      let getUpdatedTransaction = await Transaction.findOne({
        _id: id
      }).populate("landlord_data");
      return res.send({ transaction: getUpdatedTransaction });
    } else {
      return res.send({
        exist: false,
        message: "The transaction you want to update doesn't exist"
      });
    }
  } catch (err) {
    return console.log(err);
  }
});

const deleteTransaction = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  try {
    let verifyTransaction = await Transaction.findOne({ _id: id });
    if (verifyTransaction) {
      let deleteTransaction = await Transaction.deleteOne({ _id: id });
      return res.send({ message: "deleted successfully" });
    } else {
      res.send({
        exist: false,
        message: "The transaction you want to delete doesnt exist"
      });
    }
  } catch (err) {
    return console.log(err);
  }
});

const getSpecificTransactions = catchAsync(async (req, res, next) => {
  let allTransaction = await Transaction.find({
    user_data: req.params.user_id
  }).populate("landlord_data");
  return res.send({ transaction: allTransaction });
});

const getAllTransactions = catchAsync(async (req, res, next) => {
  let allTransaction = await Transaction.find({}).populate("landlord_data");
  return res.send({
    transaction: allTransaction
  });
});

const getLandlordTransactions = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  let allTransaction = await Transaction.find({
    landlord_data: id
  }).populate("landlord_data");
  return res.send({ transaction: allTransaction });
});

const countDoc = catchAsync(async (req, res, next) => {
  let getAllTransactions = await Transaction.countDocuments({});
  return res.send({ count: getAllTransactions });
});

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  getSpecificTransactions,
  getLandlordTransactions,
  countDoc
};
