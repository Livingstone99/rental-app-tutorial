const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const { getDateInYYMMDD, getTimeInHHMMSS } = require("../utils/functions");

const Transaction = new mongoose.Schema(
  {
    landlord_data: { type: ObjectId, ref: "landlord" },
    amount: { type: Number },
    days: { type: Number },
    date: { type: String },
    time: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", Transaction);
