const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const City = new mongoose.Schema(
  {
    name: { type: String },
    pic: {
      type: String,
      default: null
    },
    index: { type: Number, default: 0 },
    status: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("city", City);
