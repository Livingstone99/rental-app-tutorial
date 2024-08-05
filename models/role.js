const mongoose = require("mongoose");

const Role = new mongoose.Schema(
  {
    name: {
      type: String
    },
    list: {
      type: [
        {
          _id: String,
          name: String
        }
      ]
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("role", Role);
