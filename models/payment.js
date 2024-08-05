const mongoose = require("mongoose");

const Payment = new mongoose.Schema(
  {
    transaction_id: { type: String, default: null },
    amount: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("paiement", Payment);
