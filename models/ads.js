const mongoose = require("mongoose");

const Ads = new mongoose.Schema(
  {
    cover: { type: String },
    title: { type: String },
    description: { type: String },
    link: { type: String, default: null },
    period_start: { type: String },
    period_end: { type: String },
    ads_type: { type: String, enum: ["click", "link"], default: "click" },
    status: { type: Number, default: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ad", Ads);
