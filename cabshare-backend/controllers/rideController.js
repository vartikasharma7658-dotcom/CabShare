// controllers/rideController.js
const Ride    = require("../models/Ride");
const Booking = require("../models/Booking");

const DRIVER_FIELDS = "name phone profilePicture vehicleModel vehicleColor vehicleNumber averageRating totalRatings";

// ── Create ride (driver) ──────────────────────────────────────────────────
exports.createRide = async (req, res) => {
  try {
    const ride = await Ride.create({
      ...req.body,
      driverId: req.user.id,
    });
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get rides ─────────────────────────────────────────────────────────────
exports.getRides = async (req, res) => {
  try {
    let rides;
    if (req.query.role === "driver") {
      rides = await Ride.find({
        driverId: req.user.id,
        status: { $in: ["active", "started"] },
      })
        .populate("driverId", DRIVER_FIELDS)
        .sort({ createdAt: -1 });
    } else {
      rides = await Ride.find({ status: "active" })
        .populate("driverId", DRIVER_FIELDS)
        .sort({ createdAt: -1 });
    }
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Start ride ────────────────────────────────────────────────────────────
exports.startRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.driverId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    ride.status = "started";
    await ride.save();
    res.json({ message: "Ride started", ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Cancel ride ───────────────────────────────────────────────────────────
exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.driverId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    if (ride.status === "started")
      return res.status(400).json({ message: "Ride already started, cannot cancel" });
    ride.status = "cancelled";
    await ride.save();
    await Booking.updateMany({ rideId: ride._id }, { status: "cancelled" });
    res.json({ message: "Ride cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Complete ride ─────────────────────────────────────────────────────────
exports.completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.driverId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    ride.status = "completed";
    await ride.save();
    await Booking.updateMany({ rideId: ride._id }, { status: "completed" });
    res.json({ message: "Ride completed", ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};