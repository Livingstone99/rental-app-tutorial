const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");

const Permission = new mongoose.Schema(
  {
    name: {
      type: String
    },
    role: {
      type: ObjectId,
      ref: "role"
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("permission", Permission);
