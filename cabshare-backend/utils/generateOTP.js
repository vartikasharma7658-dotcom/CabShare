const nodemailer = require("nodemailer");

// ── Generate 6-digit OTP ──────────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Nodemailer transporter (Gmail SMTP) ───────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ── Send OTP via Email ────────────────────────────────────────────────────
const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"CabShare" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your CabShare OTP",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e5e7eb">
        <h2 style="color:#6366f1;margin-bottom:8px">CabShare</h2>
        <p style="color:#374151;margin-bottom:24px">Your one-time password:</p>
        <div style="font-size:2.5rem;font-weight:800;letter-spacing:0.2em;color:#0f172a;text-align:center;padding:16px;background:#f1f5f9;border-radius:8px">
          ${otp}
        </div>
        <p style="color:#6b7280;font-size:0.85rem;margin-top:24px">
          Expires in <strong>10 minutes</strong>. Do not share with anyone.
        </p>
      </div>
    `,
  });
  console.log("Email OTP sent to:", email);
};

module.exports = { generateOTP, sendOTP };