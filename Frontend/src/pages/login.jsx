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

const Login = () => {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) { alert("Enter phone and password"); return; }
    if (formData.phone.length !== 10) { alert("Enter valid 10-digit phone number"); return; }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", {
        phone: "+91" + formData.phone,
        password: formData.password,
      });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === "driver") navigate("/driver-dashboard");
      else navigate("/passenger-dashboard");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center p-4">
      <div className="w-full fade-up max-w-[360px]">

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <a href="/" className="font-[family-name:var(--font)] font-bold text-2xl md:text-[2rem] text-[var(--gold)] no-underline inline-block tracking-tight">
            CabShare
          </a>
          <p style={{ color: "var(--text-muted)", fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", fontStyle: "italic", marginTop: "6px" }}>
            Welcome Back
          </p>
        </div>

        <div className="glass-card relative p-5 sm:p-6 md:p-10">
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent)", borderRadius: "4px 4px 0 0" }} />

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>

            {/* Phone */}
            <div>
              <label style={{ display: "block", fontFamily: "var(--font)", fontStyle: "italic", fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "7px" }}>
                Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
              />
            </div>

            {/* Password with eye toggle */}
            <div>
              <label style={{ display: "block", fontFamily: "var(--font)", fontStyle: "italic", fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "7px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "4px" }}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div style={{ marginTop: "0.4rem" }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span className="spinner" /> Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </div>
          </form>

          <div className="divider-glow" />

          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            New here?{" "}
            <Link to="/signup" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 700 }}>
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;