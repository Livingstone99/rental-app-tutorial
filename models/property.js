const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const facilities = require("./facilities");
const Property = new mongoose.Schema(
  {
    landlord: { type: ObjectId, ref: "user" },
    title: { type: String },
    description: { type: String },

    houseType: {
      type: String,
      default: "entire",
      enum: ["entire", "private"]
    },
    availableSpace: {
      type: String,
      default: "allroom",
      enum: ["allroom", "privateroom"]
    },
    category: {
      type: Array,
      default: []
    },
    rate: {
      type: Number,
      default: 0
    },
    booked_rated: {
      type: Number,
      default: 0
    },
    total_booked: {
      type: Number,
      default: 0
    },
    city: {
      type: String,
      default: null
    },
    featured: {
      type: Boolean,
      default: false
    },
    choseUsers: {
      type: String,
      default: "all",
      enum: ["all", "verified"]
    },
    cover_image: { type: String },
    images: { type: Array, default: [] },
    //wifi, kitchen air_condition fire_extinguisher, first_aid, beach_access, washing_machine
    facilities: { type: Array, default: [] },
    discount: { type: Number, default: 0 },
    // bookDate: {
    //   startDate: { type: String },
    //   lastDate: { type: String }
    // },
    unavailable_date: {
      type: Array,
      default: []
    },
    available: {
      type: Boolean,
      default: true
    },
    //specific unavailable date
    address: {
      city: { type: String },
      municipal: { type: String },
      street: { type: String },
      houseAddress: { type: String }
    },
    propertyDetails: {
      bedRoom: {
        type: Number,
        default: 0
      },
      bed: {
        type: Number,
        default: 1
      },
      maxGuest: {
        type: Number,
        default: 1
      },
      bathRoom: {
        type: Number,
        default: 0
      }
    },
    cost: {
      type: Number,
      default: 0
    },
    position: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    // check if occupied
    occupied: {
      type: Boolean,
      default: false
    },
    rejection_msg: {
      type: String,
      default: null
    },
    status: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3]
      // 0 - in verification
      // 1 - enabled
      // 2 - issue
      // 3 - suspended
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("property", Property);
