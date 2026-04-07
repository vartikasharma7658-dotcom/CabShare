const Rating = require("../models/Rating");
const User   = require("../models/User");
const Ride   = require("../models/Ride");

// ── Helper: recalculate and persist a user's average rating ──────────────
const recalcUserRating = async (userId) => {
  const all = await Rating.find({ ratedUserId: userId });
  const avg = all.length
    ? Math.round((all.reduce((s, r) => s + r.rating, 0) / all.length) * 10) / 10
    : 0;
  return User.findByIdAndUpdate(
    userId,
    { averageRating: avg, totalRatings: all.length },
    { new: true }
  ).select("averageRating totalRatings name");
};

// POST /api/ratings/submit
exports.submitRating = async (req, res) => {
  try {
    const { rideId, ratedUserId, rating, review } = req.body;
    const raterId = req.user.id;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.status !== "completed")
      return res.status(400).json({ message: "Can only rate completed rides" });

    const raterRole =
      ride.driverId?.toString() === raterId ? "driver" : "passenger";

    const newRating = await Rating.create({
      rideId, raterId, ratedUserId, rating, review, raterRole,
    });

    // Recalculate and get updated user stats
    const updatedUser = await recalcUserRating(ratedUserId);

    res.status(201).json({
      rating: newRating,
      updatedUser: {
        _id:           updatedUser._id,
        averageRating: updatedUser.averageRating,
        totalRatings:  updatedUser.totalRatings,
      },
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "You already rated this ride" });
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ratings/ride/:rideId/hasRated
exports.hasRated = async (req, res) => {
  try {
    const existing = await Rating.findOne({
      rideId:  req.params.rideId,
      raterId: req.user.id,
    });
    res.json({ hasRated: !!existing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ratings/user/:userId
exports.getUserRating = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("averageRating totalRatings name");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};