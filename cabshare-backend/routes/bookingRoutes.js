// routes/bookingRoutes.js
const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const ctrl    = require("../controllers/bookingController");

// ── Named routes FIRST — before any /:id pattern ─────────────────────────
router.get("/",                  auth, ctrl.getMyBookings);
router.get("/history/passenger", auth, ctrl.getPassengerHistory);  // ← fixed: was ctrl.getMyHistory
router.get("/history/driver",    auth, ctrl.getDriverHistory);
router.get("/ride/:rideId",      auth, ctrl.getBookingsByRide);
router.post("/",                 auth, ctrl.createBooking);
router.put("/cancel/:id",        auth, ctrl.cancelBooking);

// ── Messages MUST be before /:id ──────────────────────────────────────────
router.get("/:id/messages",      auth, ctrl.getMessages);
router.post("/:id/messages",     auth, ctrl.sendMessage);

// ── Generic booking update — last ─────────────────────────────────────────
router.put("/:id",               auth, ctrl.updateBooking);

module.exports = router;