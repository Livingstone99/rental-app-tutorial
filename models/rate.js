const { Number } = require('mongoose')
const mongoose = require('mongoose')

const Rating = new mongoose.Schema(
  {
    message: { type: String },
    username: { type: String, default: '' },
    rate: { type: Number },
    rated: { type: Boolean, default: false },
  },
  { timestamps: true },
)

module.exports = mongoose.model('rating', Rating)
