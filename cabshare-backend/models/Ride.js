const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    source: String,
    destination: String,
    sourceCoords: { lat: Number, lng: Number },
    destCoords:   { lat: Number, lng: Number },
    fare: Number,
    seatsAvailable: Number,
    womenOnly: Boolean,
    vehicleModel:  { type: String, default: "" },
    vehicleColor:  { type: String, default: "" },
    vehicleNumber: { type: String, default: "" },
    status: {
      type: String,
      default: "active",
    },
    date: String,
    time: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);