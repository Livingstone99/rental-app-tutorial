const mongoose = require("mongoose");

const Config = new mongoose.Schema(
  {
    country_name: {
      type: String,
      default: "côte d'ivoire"
    },
    country_code: {
      type: String,
      default: "+225"
    },
    digit_limit: { type: Number, default: 10 },
    flag: { type: String, default: null },
    fee: {
      landlord_fee: {
        type: Number,
        default: 5
        // this is in percentage %
      },
      extra_on_property: {
        type: Number,
        default: 3
        // this is in normal XOF
      }
    },
    general: {
      terms: { type: String, default: "" },
      about_us: { type: String, default: "" },
      contact_us: { type: String, default: "" },
      logo: { type: String, default: null },
      version: { type: String, default: "1.0.0" },
      maintenance: { type: Boolean, default: false }
    },
    social: {
      support_contact: { type: String, default: "" },
      support_email: { type: String, default: "" },
      support_whatsapp: { type: String, default: "" },
      support_telegram: { type: String, default: "" },
      url_to_web: { type: String, default: "" },
      url_to_app: { type: String, default: "" },
      url_to_facebook: { type: String, default: "" },
      url_to_instagram: { type: String, default: "" },
      url_to_twitter: { type: String, default: "" },
      url_to_youtube: { type: String, default: "" },
      url_to_linkedin: { type: String, default: "" }
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("config", Config);
