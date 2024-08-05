const { Number } = require("mongoose");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");

const Inspection = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "user" },
    landlord: { type: ObjectId, ref: "user" },
    property: { type: ObjectId, ref: "property" },
    concerns: { type: String, default: null },
    singleDate: { type: String, default: null },
    totalCost: {
      type: Number,
      default: null
    },
    // assignee: {
    //   type: ObjectId,
    //   ref: "user"
    // },
    paid: {
      type: Boolean,
      default: false
    },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1, 2]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("inspection", Inspection);
