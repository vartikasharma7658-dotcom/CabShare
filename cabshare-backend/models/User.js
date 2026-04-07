const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:     String,
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:    { type: String, required: true, unique: true },
    gender:   String,
    role:     { type: String, enum: ["driver", "passenger"] },
    password: { type: String, required: true },

    averageRating: { type: Number, default: 0 },
    totalRatings:  { type: Number, default: 0 },

    profilePicture: { type: String, default: "" },
    vehicleModel:   { type: String, default: "" },
    vehicleColor:   { type: String, default: "" },
    vehicleNumber:  { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);