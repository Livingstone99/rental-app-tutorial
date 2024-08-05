const mongoose = require("mongoose");

const Facilities = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    status: {
      type: Boolean,
      default: false
    }
  },

  { timestamps: true }
);
module.exports = mongoose.model("facilities", Facilities);
