const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");

const Booking = require("../models/booking");
const Property = require("../models/property");
const User = require("../models/user");
const Rate = require("../models/rate");

const Config = require("../models/config");

const { catchAsync } = require("../utils/catchAsync");
const { errorHandling } = require("../utils/errorHandling");

const Axios = require("axios");

dotenv.config();

const createBooking = catchAsync(async (req, res, next) => {
  const { user, property, bookDate, totalCost, focus_off } = req.body;

  if (
    !user ||
    !property ||
    !bookDate ||
    !bookDate.startDate ||
    !bookDate.lastDate ||
    !totalCost
  ) {
    return errorHandling(res, {
      status: 400,
      message: `Data is missing to initiate a booking (user, property, bookDate, startDate, lastDate) 
      please verify those keys carrefully`
    });
  }

  const transformedStartDate = bookDate.startDate.split(" ")[0];
  const transformedLastDate = bookDate.lastDate.split(" ")[0];

  if (totalCost % 100 !== 0) {
    return errorHandling(res, {
      status: 400,
      message: `total cost should be a multiple of 100`
    });
  }

  // check if property & users exist

  let checkUser = await User.findOne({
    _id: user
  });

  let checkProperty = await Property.findOne({
    _id: property
  });

  let checkLandlord = await User.findOne({
    _id: checkProperty.landlord
  });

  console.log("1");
  if (!checkUser || !checkProperty || !checkLandlord) {
    return errorHandling(res, {
      status: 400,
      message: "User or property or landlord do not exist into the system"
    });
  }
  console.log("2");
  if (checkUser._id === checkProperty.landlord) {
    return errorHandling(res, {
      status: 400,
      message: "Vous ne pouvez pas commander votre propre résidence"
    });
  }
  console.log("3");
  // check if there is no other booking on the same property same day
  let verifyBookingInAvailableDate = await Property.find({
    $and: [
      { _id: property },
      { unavailable_date: { $in: [transformedStartDate, transformedLastDate] } }
    ]
  });

  console.log("4");
  let checkExistingBooking = await Booking.find({
    $and: [
      { property: property },
      { paid: true },
      {
        $or: [
          { "bookDate.startDate": transformedStartDate },
          {
            "bookDate.lastDate": transformedLastDate
          },
          {
            "bookDate.startDate": transformedLastDate
          },
          {
            "bookDate.lastDate": transformedStartDate
          }
        ]
      }
    ]
  });
  console.log("5");
  if (verifyBookingInAvailableDate.length > 0) {
    // console.log(checkExistingBooking);
    return errorHandling(res, {
      status: 400,
      message: "Il y a pas de disponibilité dans la période"
    });
  }
  console.log("6");
  if (checkExistingBooking.length > 0) {
    // console.log(checkExistingBooking);
    return errorHandling(res, {
      status: 400,
      message: "Il y a pas de disponibilité dans la période"
    });
  }
  console.log("7");
  let rate = new Rate({});
  await rate.save();

  // get config
  let getConfig = await Config.find({});

  // calcule fee

  const earn_lamaison =
    (totalCost *
      (getConfig[0].fee.landlord_fee + getConfig[0].fee.extra_on_property)) /
    100;

  const earn_landlord = totalCost - earn_lamaison;

  console.log(earn_lamaison);
  console.log(earn_landlord);

  let newBooking = new Booking({
    ...req.body,
    bookDate: {
      startDate: transformedStartDate,
      lastDate: transformedLastDate
    },
    landlord: checkProperty.landlord,
    rate: rate._id,
    earn_landlord,
    earn_lamaison
  });

  await newBooking.save();

  // console.log(newBooking._id);

  // get latest data
  const latestBooking = await Booking.findOne({ _id: newBooking._id })
    .populate("user")
    .populate("property")
    .populate("landlord")
    .populate("rate");

  if (focus_off === false) {
    await Axios.post(process.env.FOCUSPAY_ENCRYPT, {
      transaction_data: {
        value: process.env.FOCUSPAY_PIN,
        api_key: process.env.FOCUSPAY_API_KEY
      }
    })
      .then(async (data) => {
        const { encryptedValue } = data.data;
        await Axios.post(process.env.FOCUSPAY_GEN, {
          transaction_data: {
            pin: encryptedValue,
            api_key: process.env.FOCUSPAY_API_KEY,
            merchant_data: process.env.FOCUSPAY_USER_KEY,
            amount: parseInt(totalCost),
            reason: "Commande de résidence sur lamaison.ci",
            callback_url: `${process.env.LAMAISON_CALLBACK_URL}?booking_id=${
              newBooking._id
            }&amount=${parseInt(totalCost)}`,
            currency: "xof",
            return_url: "https://xearth.ci?state=successful"
          }
        })
          .then((response) => {
            // console.log(respone);
            return res.send({
              booking: latestBooking,
              url:
                process.env.FOCUSPAY_URL +
                response.data.data +
                "?countrycode=225",
              exist: false,
              status: 200,
              message: "Booking sumitted successfully"
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

  return res.send({
    booking: latestBooking,
    exist: false,
    status: 200,
    message: "Booking sumitted successfully"
  });
});

const updateBooking = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyBooking = await Booking.findOne({ _id: id })
    .populate("user")
    .populate("property")
    .populate("landlord")
    .populate("rate");

  if (verifyBooking) {
    await Booking.updateOne(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    let getUpdatedBooking = await Booking.findOne({
      _id: id
    })
      .populate("user")
      .populate("property")
      .populate("landlord")
      .populate("rate");

    return res.send({ data: getUpdatedBooking });
  } else {
    return res.status(404).send({
      exist: false,
      message: "The booking you want to update doesn't exist"
    });
  }
});

const deleteBooking = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyBooking = await Booking.findOne({ _id: id });
  if (verifyBooking) {
    let deleteBooking = await Booking.deleteOne({ _id: id });
    return res.send({ message: "deleted successfully" });
  } else {
    return res.send({
      exist: false,
      message: "The booking you want to delete doesnt exist"
    });
  }
});

const getAllRatingFromABookedProperty = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      message: "no property id assigned"
    });
  }

  let findBooking = await Booking.find(
    {
      property: id
    },
    {
      rate: 1
    }
  ).populate("rate");

  return res.send({ booking: findBooking }).sort({ _id: -1 });
});

const findAllBookingbyUserOrLandlord = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let findBooking = await Booking.find({
    $or: [{ landlord: id }],
    paid: true
  })
    .populate("user")
    .populate("property")
    .populate("landlord")
    .populate("rate");

  return res.send({ booking: findBooking }).sort({ _id: -1 });
});

const findAllBookingbyUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let findBooking = await Booking.find({
    $or: [{ user: id }],
    paid: true
  })
    .populate("user")
    .populate("property")
    .populate("landlord")
    .populate("rate");

  return res.send({ booking: findBooking }).sort({ _id: -1 });
});

const getSpecificBookings = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let allBooking = await Booking.findOne({
    _id: id
  })
    .populate("user")
    .populate("property")
    .populate("landlord")
    .populate("rate");

  return res.send({ booking: allBooking });
});

const getAllBookings = catchAsync(async (req, res, next) => {
  let allBooking = await Booking.find({})
    .populate("user")
    .populate("property")
    .populate("landlord")
    .populate("rate");

  return res.send({ booking: allBooking }).sort({ _id: -1 });
});

const rateLandlord = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // verify booking

  let currentBooking = await Booking.findOne({
    _id: id
  }).populate("rate");

  if (!currentBooking) {
    return res.status(400).send({
      message: "No booking found"
    });
  }

  // update property

  let currentProperty = await Property.updateOne(
    { _id: id },
    {
      $inc: {
        rate: req.body.rate,
        booked_rated: 1
      }
    }
  );

  let currentRate = await Rate.updateOne(
    { _id: id },
    {
      $set: {
        ...req.body,
        rated: true
      }
    },
    {
      new: true
    }
  );

  if (!currentRate) {
    return res.status(400).send({
      message: "Not updated"
    });
  }

  // update the property

  return res.send({
    booking: currentRate,
    message: "Mise à jour avec succès"
  });
});
const countDoc = catchAsync(async (req, res, next) => {
  let getAllBookings = await Booking.countDocuments({});
  res.send({ count: getAllBookings });
});

module.exports = {
  createBooking,
  updateBooking,
  rateLandlord,
  deleteBooking,
  getAllBookings,
  getSpecificBookings,
  findAllBookingbyUserOrLandlord,
  findAllBookingbyUser,
  getAllRatingFromABookedProperty,
  countDoc
};
