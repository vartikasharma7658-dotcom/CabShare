const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const { generateOTP, sendOTP } = require("../utils/generateOTP");

// In-memory OTP store { email: { otp, expiresAt } }
const otpStore = {};

// ── SEND OTP (email) ──────────────────────────────────────────────────────
const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = generateOTP();
  otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 min
  console.log("OTP for", email, ":", otp);

  try {
    await sendOTP(email, otp);
    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Email send error:", err.message);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
};

// ── VERIFY OTP (email) ────────────────────────────────────────────────────
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ success: false, message: "No OTP sent to this email" });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }
  if (String(record.otp) !== String(otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  delete otpStore[email];
  res.json({ success: true, message: "OTP verified" });
};

// ── REGISTER ──────────────────────────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, phone, gender, role, password } = req.body;

  try {
    // Check email uniqueness
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) return res.status(400).json({ message: "Email already registered" });

    // Check phone uniqueness
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) return res.status(400).json({ message: "Phone number already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      gender,
      role,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "User registered successfully", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// ── LOGIN (by phone or email) ─────────────────────────────────────────────
const login = async (req, res) => {
  const { phone, email, password } = req.body;

  try {
    // Support login by phone (existing users) or email
    const user = phone
      ? await User.findOne({ phone })
      : await User.findOne({ email: email?.toLowerCase() });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login error" });
  }
};

module.exports = { register, login, sendOtp, verifyOtp };