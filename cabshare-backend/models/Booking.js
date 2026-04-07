// models/Booking.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender:     { type: String, enum: ["driver", "passenger"], required: true },
  senderName: { type: String, default: "" },
  text:       { type: String, required: true },
  timestamp:  { type: Date, default: Date.now },
});

const bookingSchema = new mongoose.Schema(
  {
    rideId:      { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seatsBooked: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["pending", "accepted", "started", "cancelled", "completed"],
      default: "pending",
    },
    otp:         { type: String, default: "" },
    otpVerified: { type: Boolean, default: false },
    messages:    { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);