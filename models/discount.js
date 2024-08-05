const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");

const Discount = new mongoose.Schema(
  {
    code: { type: String, default: "" },
    value: { type: Number, default: 0 },
    use: {
      type: Number,
      default: 0
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("discount", Discount);
