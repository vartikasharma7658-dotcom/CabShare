// controllers/bookingController.js
const Booking = require("../models/Booking");
const Ride    = require("../models/Ride");

const DRIVER_FIELDS    = "name phone profilePicture vehicleModel vehicleColor vehicleNumber averageRating totalRatings";
const PASSENGER_FIELDS = "name phone gender profilePicture averageRating totalRatings";

// ── All bookings for the logged-in passenger (used for live polling) ───────
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ passengerId: req.user.id })
      .populate({
        path: "rideId",
        populate: {
          path: "driverId",
          select: DRIVER_FIELDS,
        },
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Passenger history ─────────────────────────────────────────────────────
exports.getPassengerHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({
      passengerId: req.user.id,
      status: { $in: ["completed", "cancelled"] },
    })
      .populate({
        path: "rideId",
        populate: {
          path: "driverId",
          select: DRIVER_FIELDS,
        },
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("getPassengerHistory error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ── Driver history ────────────────────────────────────────────────────────
exports.getDriverHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ driverId: req.user.id })
      .sort({ createdAt: -1 });

    const rideIds = rides.map(r => r._id);
    const bookings = await Booking.find({ rideId: { $in: rideIds } })
      .populate("passengerId", PASSENGER_FIELDS);

    const bookingMap = {};
    bookings.forEach(b => {
      const key = b.rideId.toString();
      if (!bookingMap[key]) bookingMap[key] = [];
      bookingMap[key].push(b);
    });

    const result = rides.map(ride => ({
      ...ride.toObject(),
      passengers: bookingMap[ride._id.toString()] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error("getDriverHistory error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ── Bookings for a specific ride (driver dashboard live requests) ──────────
exports.getBookingsByRide = async (req, res) => {
  try {
    const bookings = await Booking.find({ rideId: req.params.rideId })
      .populate("passengerId", PASSENGER_FIELDS);
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createBooking = async (req, res) => {
  try {
    const { rideId, seatsBooked = 1 } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride)                             return res.status(404).json({ message: "Ride not found" });
    if (ride.seatsAvailable < seatsBooked) return res.status(400).json({ message: "Not enough seats" });

    const existing = await Booking.findOne({
      rideId, passengerId: req.user.id, status: { $nin: ["cancelled"] },
    });
    if (existing) return res.status(400).json({ message: "You already booked this ride" });

    const booking = await Booking.create({
      rideId, passengerId: req.user.id, seatsBooked, status: "pending", otpVerified: false,
    });
    ride.seatsAvailable -= seatsBooked;
    await ride.save();
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.body.otpVerified === true && req.body.enteredOtp !== undefined) {
      if (booking.otp !== req.body.enteredOtp)
        return res.status(400).json({ message: "Wrong OTP" });
    }

    const { messages, ...safeBody } = req.body;
    Object.assign(booking, safeBody);
    await booking.save();
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.passengerId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    if (booking.status === "cancelled") return res.status(400).json({ message: "Already cancelled" });
    const ride = await Ride.findById(booking.rideId);
    if (ride?.status === "started") return res.status(400).json({ message: "Cannot cancel a started ride" });
    booking.status = "cancelled";
    await booking.save();
    if (ride) { ride.seatsAvailable += booking.seatsBooked; await ride.save(); }
    res.json({ message: "Booking cancelled" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Chat: get messages ────────────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).select("messages");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking.messages || []);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ── Chat: send message ────────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const { sender, senderName, text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Message cannot be empty" });
    if (!sender)       return res.status(400).json({ message: "Sender role required" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.messages.push({
      sender,
      senderName: senderName || sender,
      text:       text.trim(),
      timestamp:  new Date(),
    });
    await booking.save();
    res.json(booking.messages);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: err.message });
  }
};