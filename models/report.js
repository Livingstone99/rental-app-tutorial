const mongoose = require("mongoose");

const { ObjectId } = require("mongoose");

const Report = new mongoose.Schema(
  {
    user_id: { type: ObjectId, ref: "user", default:null },
    contact:{type: String, default: ""},
    title: { type: String, default: null },
    message: { type: String, default: null },
    pic: { type: String, default: null },
    status: { type: Number, enum: [0, 1, 2], default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("report", Report);
