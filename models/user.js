const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { server, development } = require("../url");

dotenv.config();

const User = new mongoose.Schema(
  {
    fullname: { type: String, default: null },
    email: { type: String, default: null },
    pic: {
      type: String,
      default: null
    },
    verified: { type: Boolean, default: false },
    number: { type: String, default: null },
    iam_landlord: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      min: 12,
      max: 1024
    },
    userVerification: {
      numberVerification: {
        type: Boolean,
        default: false
      },
      capturedIdOrPassport: {
        type: String,
        default: null
      },
      first_name: { type: String },
      last_name: { type: String },
      contact_address: { type: String },
      number: {
        type: String,
        default: null
      },
      pics: {
        type: String,
        default: null
      },
      rejectionText: {
        type: String,
        default: null
      },
      //0 not verified
      // 1 verified
      //rejected
      state: {
        type: Number,
        default: 0
      }
    },
    pushToken: { type: String, default: null },
    position: {
      type: Object,
      default: {
        lat: null,
        lng: null
      }
    },
    payment_details: {
      network: { type: String, default: null },
      number: { type: String, default: null }
    },
    wallet: { type: Number, default: 0 },
    fee: { type: Number, default: 3 },
    status: {
      type: Number,
      default: 1,
      enum: [0, 1, 2]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", User);
