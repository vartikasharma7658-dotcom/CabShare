import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";

const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Signup = () => {
  const [step, setStep]         = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", gender: "", password: "" });
  const [nameError, setNameError]   = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showPassword, setShowPassword]         = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [otp, setOtp]               = useState(["", "", "", "", "", ""]);
  const [loadingRole, setLoadingRole] = useState(null);
  const [verifying, setVerifying]   = useState(false);
  const [role, setRole]             = useState(null);
  const navigate = useNavigate();

  const isValidEmail     = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isStrongPassword = (p) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(p);
  const passwordChecks = {
    length:    formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number:    /\d/.test(formData.password),
    special:   /[@$!%*?&]/.test(formData.password),
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setNameError(/\d/.test(val) ? "Name cannot contain numbers" : "");
    setFormData({ ...formData, name: val.replace(/\d/g, "") });
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.toLowerCase();
    setEmailError(val && !isValidEmail(val) ? "Enter a valid email address" : "");
    setFormData({ ...formData, email: val });
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setPhoneError(val.length > 0 && val.length !== 10 ? "Must be exactly 10 digits" : "");
    setFormData({ ...formData, phone: val });
  };

  const sendOTP = async (selectedRole) => {
    if (!formData.name || !formData.email || !formData.phone || !formData.gender || !formData.password) {
      alert("Please fill all details"); return;
    }
    if (!isValidEmail(formData.email))        { alert("Enter a valid email address"); return; }
    if (formData.phone.length !== 10)          { alert("Enter valid 10-digit phone number"); return; }
    if (!isStrongPassword(formData.password))  { alert("Password is not strong enough"); return; }

    setLoadingRole(selectedRole);
    setRole(selectedRole);
    try {
      await API.post("/auth/send-otp", { email: formData.email });
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally { setLoadingRole(null); }
  };

  const verifyOTPAndRegister = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) { alert("Enter complete OTP"); return; }
    setVerifying(true);
    try {
      await API.post("/auth/verify-otp", { email: formData.email, otp: otpCode });
      const res = await API.post("/auth/register", {
        ...formData,
        phone: "+91" + formData.phone,
        role,
      });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      if (role === "driver") navigate("/driver-details");
      else navigate("/passenger-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally { setVerifying(false); }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const lbl = {
    display: "block", fontSize: "0.75rem", color: "var(--text-muted)",
    letterSpacing: "0.1em", marginBottom: "7px", textTransform: "uppercase",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 md:p-6">
      <div className="fade-up w-full max-w-[420px]">

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <a href="/" className="font-[family-name:var(--font)] font-black text-2xl md:text-[2rem] text-[#0f172a] no-underline tracking-tighter">
            Cab<span style={{ color: "#6366f1" }}>Share</span>
          </a>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "6px" }}>
            {step === 1 ? "Join the Network" : "Verify your email"}
          </p>
        </div>

        <div className="glass-card p-4 sm:p-5 md:p-8">

          {/* ── Step 1: Details ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

              <div>
                <label style={lbl}>Full Name</label>
                <input type="text" className="input-field" placeholder="Your full name"
                  value={formData.name} onChange={handleNameChange} />
                {nameError && <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>{nameError}</p>}
              </div>

              <div>
                <label style={lbl}>Email Address</label>
                <input type="email" className="input-field" placeholder="you@example.com"
                  value={formData.email} onChange={handleEmailChange} />
                {emailError && <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>{emailError}</p>}
              </div>

              <div>
                <label style={lbl}>Phone Number</label>
                <input type="tel" className="input-field" placeholder="10-digit number" maxLength={10}
                  value={formData.phone} onChange={handlePhoneChange} />
                {phoneError && <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>{phoneError}</p>}
              </div>

              <div>
                <label style={lbl}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} className="input-field"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    onBlur={() => setShowPasswordError(true)}
                    style={{ paddingRight: "44px" }} />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "4px" }}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {showPasswordError && formData.password && !isStrongPassword(formData.password) && (
                  <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                    {!passwordChecks.length    ? "At least 8 characters"              :
                     !passwordChecks.uppercase ? "Add an uppercase letter"            :
                     !passwordChecks.lowercase ? "Add a lowercase letter"             :
                     !passwordChecks.number    ? "Add a number"                       :
                                                 "Add a special character (@$!%*?&)"}
                  </p>
                )}
              </div>

              <div>
                <label style={lbl}>Gender</label>
                <select className="input-field" value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <hr className="divider" />
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", marginBottom: "0.5rem" }}>I want to</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
                {[
                  { label: "Offer a Ride", thisRole: "driver"    },
                  { label: "Find a Ride",  thisRole: "passenger" },
                ].map(({ label, thisRole }) => (
                  <button key={thisRole} onClick={() => sendOTP(thisRole)} disabled={loadingRole !== null}
                    style={{ padding: "1rem", borderRadius: "var(--radius)", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem", cursor: loadingRole !== null ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { if (!loadingRole) e.currentTarget.style.background = "rgba(99,102,241,0.12)"; }}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"}>
                    {loadingRole === thisRole ? "Sending OTP..." : label}
                  </button>
                ))}
              </div>

              <hr className="divider" />
              <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 700 }}>Sign in</Link>
              </p>
            </div>
          )}

          {/* ── Step 2: Email OTP ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", fontSize: "0.7rem", color: "var(--primary)", fontWeight: 800, letterSpacing: "0.05em" }}>OTP</div>
                <p className="font-bold text-sm md:text-base text-[var(--text)]">Check your inbox</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                  We sent a 6-digit code to<br />
                  <strong style={{ color: "var(--text)" }}>{formData.email}</strong>
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {otp.map((digit, i) => (
                  <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="w-10 h-12 md:w-11 md:h-14 text-center text-xl md:text-2xl font-extrabold rounded-[calc(var(--radius)-4px)] outline-none transition-all duration-150"
                    style={{ border: digit ? "2px solid var(--primary)" : "1px solid var(--border)", background: digit ? "rgba(99,102,241,0.06)" : "var(--input-bg)", color: "var(--text)" }}
                  />
                ))}
              </div>
              <button onClick={verifyOTPAndRegister} disabled={verifying} className="btn-primary" style={{ width: "100%" }}>
                {verifying
                  ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span className="spinner" /> Verifying...</span>
                  : "Verify & Create Account"}
              </button>
              <button onClick={() => { setStep(1); setOtp(["","","","","",""]); }}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}>
                Change details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;