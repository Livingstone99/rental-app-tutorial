const mongoose = require("mongoose");

const Push = new mongoose.Schema(
  {
    message: { type: String },
    time: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("push", Push);
