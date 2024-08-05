const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");

const Admin = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: {
      type: String
    },
    email: { type: String, unique: true },
    number: {
      type: String
    },
    password: {
      type: String,
      min: 12,
      max: 1024
    },
    permission: {
      type: ObjectId,
      ref: "permission",
      required: true
    },
    refresh_token: {
      type: String,
      default: null
    },
    status: { type: Number, default: 0, enum: [0, 1] }
  },
  { timestamps: true }
);
module.exports = mongoose.model("admin", Admin);
