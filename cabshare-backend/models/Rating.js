const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    rideId:      { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
    raterId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ratedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating:      { type: Number, required: true, min: 1, max: 5 },
    review:      { type: String, default: "" },
    raterRole:   { type: String, enum: ["driver", "passenger"] },
  },
  { timestamps: true }
);

// One rating per person per ride
ratingSchema.index({ rideId: 1, raterId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);