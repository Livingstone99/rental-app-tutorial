const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Category = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String, default: null },
    discount: { type: Number, default: 0 },
    index: { type: Number, default: 0 },
    status: { type: Boolean, default: false }
  },
  { timestamps: true }
);
module.exports = mongoose.model("category", Category);
