const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/authController");


const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login); // ✅ ADD THIS
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;