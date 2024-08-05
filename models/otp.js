const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const Otp = new mongoose.Schema(
  {
    number: {
      type: String
    },
    country_code: {
      type: String
    },
    otp: {
      type: String
    },
    expire: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", Otp);
