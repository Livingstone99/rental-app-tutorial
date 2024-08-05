const mongoose = require('mongoose')
const { ObjectId, Types } = require('mongoose')

const Notification = new mongoose.Schema(
  {
    type: { type: String, enum: ['user', 'landlord'] },
    user_id: { type: ObjectId, ref: 'user' },
    message: { type: String },
    title: { type: String },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true },
)

module.exports = mongoose.model('notification', Notification)
