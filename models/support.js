const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");

const Support = new mongoose.Schema(
  {
    pic: { type: String },
    message: { type: String },
    booking_id: { type: ObjectId, ref: "booking" },
    type: { type: String, enum: ["user", "landlord"] },
    user_id: { type: ObjectId, ref: "user" },
    // keep this implementation for need
    // user_id: { type: ObjectId, refPath: "user_type" },
    // user_type: {
    //   type: String,
    //   required: true,
    //   enum: ["user", "landlord"]
    // },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1, 2]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("support", Support);
