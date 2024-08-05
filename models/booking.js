const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const { getDateInYYMMDD, getTimeInHHMMSS } = require("../utils/functions");

const Booking = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "user" },
    property: { type: ObjectId, ref: "property" },
    landlord: {
      type: ObjectId,
      ref: "user"
    },
    //payment status
    //no of guests
    guests: {
      type: Number,
      default: 1
    },
    infant: {
      type: Number,
      default: 0
    },
    pet: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number
    },
    earn_landlord: {
      type: Number
    },
    earn_lamaison: {
      type: Number
    },
    //no of infants
    //range of date a property is booked
    //refund possibility
    bookDate: {
      startDate: { type: String },
      lastDate: { type: String }
    },
    rate: {
      type: ObjectId,
      ref: "rating"
    },
    paid: {
      type: Boolean,
      default: false
    },
    discount: { type: Number, default: 0 },
    withdraw: { type: Boolean, default: false },
    clientNumber: {
      type: String,
      default: ""
    },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4]
    },
    // 0 waiting
    // 1 accepted
    // 2 completed
    // 3 canceled
    // 4 refunded
    //indicating start date and finish date

    time: { type: String, default: getTimeInHHMMSS() }
  },
  { timestamps: true }
);

module.exports = mongoose.model("booking", Booking);
