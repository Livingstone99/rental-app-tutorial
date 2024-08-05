const mongoose = require("mongoose");

const Notice = new mongoose.Schema(
  {
    slides: {
      type: Array,
      default: [
        // {
        //   title:"",
        //   body:"",
        //   image:""
        // }
      ]
    },
    redirect: { type: String, default: null },
    period_start: { type: String },
    period_end: { type: String },
    status: { type: Number, default: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("notice", Notice);
