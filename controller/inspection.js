const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");
const User = require("../models/user");
const Property = require("../models/property");

const Inspection = require("../models/inspection");
const Rate = require("../models/rate");
const { catchAsync } = require("../utils/catchAsync");
const { errorHandling } = require("../utils/errorHandling");

const Axios = require("axios");

dotenv.config();

const createInspection = catchAsync(async (req, res, next) => {
  const { user, property, totalCost, focus_off } = req.body;
  console.log(req.body);
  if (!user || !property) {
    return errorHandling(res, {
      status: 400,
      message: "User, property is not given"
    });
  }
  console.log("0000");

  // check if property & users exist

  let checkUser = await User.findOne({
    _id: user
  });

  let checkProperty = await Property.findOne({
    _id: property
  });
  console.log("1111");
  let checkLandlord = await User.findOne({
    _id: checkProperty.landlord
  });

  if (!checkUser || !checkProperty || !checkLandlord) {
    return errorHandling(res, {
      status: 400,
      message: "User or property or landlord do not exist into the system"
    });
  }
  console.log("2222");

  if (totalCost % 100 !== 0) {
    return errorHandling(res, {
      status: 400,
      message: `total cost should be a multiple of 100`
    });
  }

  let newInspection = new Inspection({
    ...req.body,
    landlord: checkProperty.landlord
  });

  await newInspection.save();

  console.log(newInspection._id);

  // get latest data
  const latestInspection = await Inspection.findOne({ _id: newInspection._id })
    .populate("user")
    .populate("property")
    .populate("landlord");
  // .populate("assignee");

  console.log("3333");

  if (focus_off === false) {
    await Axios.post(process.env.FOCUSPAY_ENCRYPT, {
      transaction_data: {
        value: process.env.FOCUSPAY_PIN,
        api_key: process.env.FOCUSPAY_API_KEY
      }
    })
      .then(async (data) => {
        console.log("4444");
        const { encryptedValue } = data.data;

        await Axios.post(process.env.FOCUSPAY_GEN, {
          transaction_data: {
            pin: encryptedValue,
            api_key: process.env.FOCUSPAY_API_KEY,
            merchant_data: process.env.FOCUSPAY_USER_KEY,
            amount: parseInt(totalCost),
            reason: "Inspecting property on lamaison.ci",
            callback_url: `https://server.lamaison.ci/v0/payment/inspection/callback-payment-inspection?inspection_id=${
              newInspection._id
            }&amount=${parseInt(totalCost)}`,
            currency: "xof",
            return_url: "https://xearth.ci?state=successful"
          }
        })
          .then((response) => {
            // console.log(response);
            console.log("5555");
            return res.send({
              booking: latestInspection,
              url: process.env.FOCUSPAY_URL + response.data.data,
              exist: false,
              status: 200,
              message: "Inspection sumitted successfully"
            });
          })
          .catch((err) => {
            // console.log(err);
            // console.log("it's me");
            return errorHandling(res, {
              status: 400,
              message: "We are facing a technical issue, try again later"
            });
          });
      })
      .catch((err) => {
        console.log("it's me (2)");
        return errorHandling(res, {
          status: 400,
          message: "We are facing a technical issue, try again later"
        });
      });
  }
  console.log("No focus ");
  return res.send({
    inspection: latestInspection,
    exist: false,
    message: "Inspection sumitted successfully"
  });
});

const updateInspection = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyInspection = await Inspection.findOne({ _id: id })
    .populate("user")
    .populate("property")
    .populate("landlord");
  // .populate("assignee");

  if (verifyInspection) {
    await Inspection.updateOne(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    let getUpdatedInspection = await Inspection.findOne({
      _id: id
    })
      .populate("user")
      .populate("property")
      .populate("landlord");
    // .populate("assignee");

    return res.send({ inspection: getUpdatedInspection });
  } else {
    return res.send({
      exist: false,
      message: "The inspection you want to update doesn't exist"
    });
  }
});

const deleteInspection = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyInspection = await Inspection.findOne({ _id: id });

  if (verifyInspection) {
    let deleteInspection = await Inspection.deleteOne({ _id: id });

    return res.send(deleteInspection);
  } else {
    return res.send({
      exist: false,
      message: "The inspection you want to delete doesnt exist"
    });
  }
});

const findAllInspectionsByUserOrLandlord = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    try {
      let findInspection = await Inspection.find({
        $or: [{ user: id }, { landlord: id }]
      })
        .populate("user")
        .populate("property")
        .populate("landlord");
      // .populate("assignee");

      return res.send({ inspection: findInspection });
    } catch (err) {
      console.log(err);
    }
  }
);

const getSpecificInspection = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let allInspection = await Inspection.find({
    _id: req.params.id
  })
    .populate("user")
    .populate("property")
    .populate("landlord");
  // .populate("assignee");

  return res.send({ inspection: allInspection });
});

const getAllInspections = catchAsync(async (req, res, next) => {
  let allInspection = await Inspection.find({})
    .populate("user")
    .populate("property")
    .populate("landlord");
  // .populate("assignee");

  return res.send({ inspection: allInspection });
});

const countDoc = catchAsync(async (req, res, next) => {
  let getAllInspections = await Inspection.countDocuments({});
  return res.send({ count: getAllInspections });
});

module.exports = {
  createInspection,
  updateInspection,
  deleteInspection,
  getAllInspections,
  getSpecificInspection,
  findAllInspectionsByUserOrLandlord,
  countDoc
};
