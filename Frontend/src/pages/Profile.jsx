import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const Profile = () => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "", gender: "", role: "",
    vehicleModel: "", vehicleColor: "", vehicleNumber: "",
  });
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("profile");
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    API.get("/users/me").then(res => {
      const u = res.data;
      setUser(u);
      setForm({
        name:          u.name          || "",
        gender:        u.gender        || "",
        role:          u.role          || "",
        vehicleModel:  u.vehicleModel  || "",
        vehicleColor:  u.vehicleColor  || "",
        vehicleNumber: u.vehicleNumber || "",
      });
      setPreview(u.profilePicture || null);
      sessionStorage.setItem("user", JSON.stringify(u));
    }).catch(console.error);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.put("/users/me", { ...form, profilePicture: preview });
      const updatedUser = res.data.user;
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (updatedUser.role !== user.role) {
        setTimeout(() => {
          if (updatedUser.role === "driver") navigate("/driver-details");
          else navigate("/passenger-dashboard");
        }, 1000);
      }
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPwMsg("Please fill all fields"); return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPwMsg("Passwords do not match"); return;
    }
    if (passwords.newPass.length < 8) {
      setPwMsg("Minimum 8 characters required"); return;
    }
    setSaving(true);
    try {
      await API.put("/users/me/password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      setPwMsg("Password changed successfully");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setPwMsg("Failed: " + (err.response?.data?.message || "Something went wrong"));
    } finally { setSaving(false); }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";
  const avg      = user?.averageRating || 0;
  const total    = user?.totalRatings  || 0;
  const stars    = Math.round(avg);
  const ratingLabel =
    avg >= 4.5 ? "Excellent" :
    avg >= 4   ? "Great"     :
    avg >= 3   ? "Good"      :
    avg >= 2   ? "Fair"      :
    avg > 0    ? "Poor"      : "";
  const ratingColor =
    avg >= 4 ? "#16a34a" :
    avg >= 3 ? "#d97706" :
    avg > 0  ? "#ef4444" : "var(--text-muted)";

  const lbl = {
    fontSize: "0.72rem", color: "var(--text-muted)",
    letterSpacing: "0.1em", textTransform: "uppercase",
    display: "block", marginBottom: "7px", fontWeight: 600,
  };

  const sectionTitle = {
    fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)",
    letterSpacing: "0.08em", textTransform: "uppercase",
    marginBottom: "12px",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-3 sm:p-4 md:p-8">
      <div className="max-w-[580px] mx-auto flex flex-col gap-3 sm:gap-4 md:gap-5">

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          background: "none", border: "none", color: "var(--text-muted)",
          cursor: "pointer", fontSize: "0.875rem",
          display: "flex", alignItems: "center", gap: "6px",
          padding: 0, width: "fit-content",
        }}>
          ← Back
        </button>

        {/* Header */}
        <div className="fade-up">
          <h1 style={{ fontWeight: 800, fontSize: "clamp(1.1rem,3.5vw,1.5rem)", color: "var(--text)", letterSpacing: "-0.03em" }}>
            My Profile
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Manage your account details</p>
        </div>

        {/* Avatar banner */}
        <div className="glass-card fade-up flex flex-col sm:flex-row items-center sm:items-center gap-4 md:gap-6 p-4 sm:p-5 md:p-7">
          <div style={{ position: "relative" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, color: "white",
              overflow: "hidden", border: "3px solid var(--border)", flexShrink: 0,
            }}>
              {preview
                ? <img src={preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: "1.3rem" }}>{initial}</span>
              }
            </div>
            <button onClick={() => fileRef.current.click()} style={{
              position: "absolute", bottom: 0, right: 0,
              width: "26px", height: "26px", borderRadius: "50%",
              background: "var(--primary)", border: "2px solid white",
              color: "white", fontSize: "0.65rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700,
            }}>
              ✎
            </button>
            <input ref={fileRef} type="file" accept="image/*"
              style={{ display: "none" }} onChange={handleImageChange} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text)" }}>
              {user?.name || "—"}
            </div>
            {user?.email && (
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "3px" }}>
                {user.email}
              </div>
            )}
            <div style={{
              marginTop: "6px", display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "3px 12px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 700,
              background: user?.role === "driver" ? "rgba(99,102,241,0.1)" : "rgba(22,163,74,0.1)",
              color: user?.role === "driver" ? "var(--primary)" : "#16a34a",
              border: `1px solid ${user?.role === "driver" ? "rgba(99,102,241,0.2)" : "rgba(22,163,74,0.2)"}`,
              textTransform: "capitalize",
            }}>
              {user?.role || "—"}
            </div>
            {user?.vehicleNumber && (
              <div style={{ marginTop: "4px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {user.vehicleModel} &middot; {user.vehicleNumber}
              </div>
            )}
          </div>
        </div>

        {/* Rating Card */}
        <div className="glass-card fade-up p-4 sm:p-5 md:px-8 md:py-6">
          <p style={{
            fontSize: "0.72rem", color: "var(--text-muted)",
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: "1rem", fontWeight: 600,
          }}>
            Your Rating
          </p>

          {total === 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
              }}>⭐</div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.9rem" }}>No ratings yet</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "2px" }}>
                  Complete a ride to receive your first rating
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "16px",
                background: `${ratingColor}14`, border: `1px solid ${ratingColor}33`,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <div className="font-extrabold text-2xl md:text-[1.8rem] leading-none" style={{ color: ratingColor }}>
                  {avg.toFixed(1)}
                </div>
                <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "2px" }}>out of 5</div>
              </div>
              <div>
                <div style={{ display: "flex", gap: "3px", marginBottom: "5px" }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ fontSize: "1.1rem", color: s <= stars ? "#f59e0b" : "var(--border)" }}>★</span>
                  ))}
                  {ratingLabel && (
                    <span style={{ marginLeft: "6px", fontSize: "0.75rem", fontWeight: 700, color: ratingColor, alignSelf: "center" }}>
                      {ratingLabel}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Based on {total} rating{total !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "4px",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "4px",
        }}>
          {[
            { key: "profile",  label: "Profile"  },
            { key: "password", label: "Password" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: "9px", borderRadius: "calc(var(--radius) - 4px)",
              border: "none", cursor: "pointer", fontWeight: 700,
              fontSize: "0.85rem", transition: "all 0.2s",
              background: tab === t.key ? "white" : "transparent",
              color: tab === t.key ? "var(--primary)" : "var(--text-muted)",
              boxShadow: tab === t.key ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="glass-card fade-up flex flex-col gap-3 sm:gap-4 md:gap-5 p-4 sm:p-5 md:p-8">

            <div>
              <label style={lbl}>Full Name</label>
              <input className="input-field" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name" />
            </div>

            {/* Email — read only */}
            <div>
              <label style={lbl}>Email Address</label>
              <input className="input-field" value={user?.email || ""} disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }} />
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "5px" }}>
                Email verified - cannot be changed here
              </p>
            </div>

            {/* Phone — read only */}
            <div>
              <label style={lbl}>Phone Number</label>
              <input className="input-field" value={user?.phone || ""} disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }} />
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "5px" }}>
                Phone number cannot be changed here
              </p>
            </div>

            <div>
              <label style={lbl}>Gender</label>
              <select className="input-field" value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Role selector */}
            <div>
              <label style={lbl}>Role</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { value: "driver",    label: "Driver"    },
                  { value: "passenger", label: "Passenger" },
                ].map(({ value, label }) => (
                  <button key={value} onClick={() => setForm({ ...form, role: value })}
                    style={{
                      padding: "12px", borderRadius: "var(--radius)",
                      cursor: "pointer", fontWeight: 700, fontSize: "0.9rem",
                      transition: "all 0.2s",
                      border: form.role === value ? "2px solid var(--primary)" : "1px solid var(--border)",
                      background: form.role === value ? "rgba(99,102,241,0.08)" : "var(--input-bg)",
                      color: form.role === value ? "var(--primary)" : "var(--text-muted)",
                    }}>
                    {label}
                  </button>
                ))}
              </div>
              {form.role !== user?.role && (
                <p style={{
                  fontSize: "0.72rem", color: "#d97706", marginTop: "8px",
                  background: "rgba(217,119,6,0.08)", padding: "8px 12px",
                  borderRadius: "8px", border: "1px solid rgba(217,119,6,0.2)",
                }}>
                  {form.role === "driver"
                    ? "You will be redirected to fill your vehicle details before driving"
                    : "You will be redirected to the passenger dashboard after saving"
                  }
                </p>
              )}
            </div>

            {/* Vehicle details */}
            {form.role === "driver" && (
              <div style={{
                padding: "16px", borderRadius: "var(--radius)",
                background: "rgba(99,102,241,0.04)",
                border: "1px solid rgba(99,102,241,0.15)",
                display: "flex", flexDirection: "column", gap: "10px",
              }}>
                <p style={sectionTitle}>Vehicle Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label style={lbl}>Model</label>
                    <input className="input-field" placeholder="e.g. Swift"
                      value={form.vehicleModel}
                      onChange={e => setForm({ ...form, vehicleModel: e.target.value })} />
                  </div>
                  <div>
                    <label style={lbl}>Color</label>
                    <input className="input-field" placeholder="e.g. White"
                      value={form.vehicleColor}
                      onChange={e => setForm({ ...form, vehicleColor: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Vehicle Number</label>
                  <input className="input-field" placeholder="e.g. RJ 14 AB 1234"
                    value={form.vehicleNumber}
                    onChange={e => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })}
                    style={{ letterSpacing: "0.08em" }} />
                </div>
              </div>
            )}

            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving
                ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span className="spinner" />Saving...</span>
                : saved ? "Saved successfully ✓" : "Save Changes"
              }
            </button>
          </div>
        )}

        {/* Password Tab */}
        {tab === "password" && (
          <div className="glass-card fade-up flex flex-col gap-3 sm:gap-4 md:gap-5 p-4 sm:p-5 md:p-8">
            {[
              { key: "current", label: "Current Password",     placeholder: "Your current password" },
              { key: "newPass", label: "New Password",         placeholder: "Minimum 8 characters"  },
              { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password"   },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={lbl}>{label}</label>
                <input type="password" className="input-field" placeholder={placeholder}
                  value={passwords[key]}
                  onChange={e => setPasswords({ ...passwords, [key]: e.target.value })} />
              </div>
            ))}

            {pwMsg && (
              <p style={{
                fontSize: "0.85rem",
                color: pwMsg.includes("successfully") ? "#16a34a" : "#ef4444",
                background: pwMsg.includes("successfully") ? "rgba(22,163,74,0.08)" : "rgba(239,68,68,0.08)",
                padding: "10px 14px", borderRadius: "8px",
                border: `1px solid ${pwMsg.includes("successfully") ? "rgba(22,163,74,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}>
                {pwMsg}
              </p>
            )}

            <button onClick={handlePasswordChange} disabled={saving} className="btn-primary">
              {saving
                ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span className="spinner" />Updating...</span>
                : "Update Password"
              }
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;