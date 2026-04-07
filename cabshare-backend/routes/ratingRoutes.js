const express = require("express");
const router  = express.Router();
const { submitRating, hasRated, getUserRating } = require("../controllers/ratingController");

// Handle both export styles:
// module.exports = protect        (default export)
// module.exports = { protect }    (named export)
const authMiddleware = require("../middleware/authMiddleware");
const protect = typeof authMiddleware === "function" ? authMiddleware : authMiddleware.protect;

router.post("/submit",               protect, submitRating);
router.get("/ride/:rideId/hasRated", protect, hasRated);
router.get("/user/:userId",          protect, getUserRating);

module.exports = router;