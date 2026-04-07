// src/pages/BecomeDriver.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCoords } from "../utils/geocode";
import API from "../utils/api";

// ── Icons ─────────────────────────────────────────────────────────────────
const HistoryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
  </svg>
);
const RideIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8l5 3v5h-5V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const statusColor = (s) => {
  if (s === "completed") return { bg: "rgba(22,163,74,0.1)", color: "#16a34a", border: "rgba(22,163,74,0.25)" };
  if (s === "cancelled") return { bg: "rgba(239,68,68,0.08)", color: "#ef4444", border: "rgba(239,68,68,0.2)" };
  return { bg: "rgba(99,102,241,0.08)", color: "var(--primary)", border: "rgba(99,102,241,0.2)" };
};

const BecomeDriver = () => {
  const navigate = useNavigate();

  // ── Tab state ─────────────────────────────────────────────────────────────
  const [tab, setTab] = useState("create");

  // ── History state ─────────────────────────────────────────────────────────
  const [history,        setHistory]        = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (tab !== "history") return;
    const load = async () => {
      setHistoryLoading(true);
      try {
        const res = await API.get("/bookings/history/driver");
        setHistory(res.data);
      } catch (err) { console.error(err); }
      finally { setHistoryLoading(false); }
    };
    load();
  }, [tab]);

  // ── Create ride state ─────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    source: "", destination: "",
    vehicleModel: "", vehicleColor: "", vehicleNumber: "",
    seatsAvailable: 4, fare: 150, womenOnly: false, date: "", time: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const cities = [
    "Agra","Ahmedabad","Ajmer","Aligarh","Amritsar","Banasthali","Bangalore","Bhopal",
    "Chandigarh","Dehradun","Delhi","Ghaziabad","Goa","Gurgaon","Haridwar",
    "Hyderabad","Indore","Jaipur","Jodhpur","Kanpur","Kolkata","Kota",
    "Lucknow","Manali","Mathura","Mumbai","Nainital","Navi Mumbai","Niwai",
    "Noida","Panipat","Pune","Rishikesh","Roorkee","Shimla","Udaipur","Varanasi"
  ];
  const carModels = [
    "Swift","Baleno","WagonR","Dzire","Brezza","Ertiga","Celerio","Fronx",
    "i10","i20","i20 N Line","Creta","Verna","Venue","Exter","Alcazar",
    "Nexon","Punch","Harrier","Safari","Altroz","Tiago","Tigor",
    "Thar","Scorpio","Scorpio N","XUV300","XUV500","XUV700","Bolero",
    "Seltos","Sonet","Carens","EV6","City","Amaze","WR-V",
    "Innova","Fortuner","Glanza","Hyryder",
    "Renault Kwid","Renault Triber","Nissan Magnite",
    "Skoda Slavia","Skoda Kushaq",
    "Volkswagen Polo","Volkswagen Virtus","Volkswagen Taigun"
  ];

  const [allCities,        setAllCities]        = useState(cities);
  const [suggestions,      setSuggestions]      = useState([]);
  const [activeField,      setActiveField]      = useState(null);
  const [modelSuggestions, setModelSuggestions] = useState([]);

  const vehicleNumberRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;

  const validate = () => {
    const e = {};
    if (!formData.source)      e.source      = "Required";
    if (!formData.destination) e.destination = "Required";
    if (formData.source === formData.destination) e.destination = "Source and destination can't be same";
    if (!formData.vehicleModel)  e.vehicleModel  = "Required";
    if (!formData.vehicleColor)  e.vehicleColor  = "Required";
    if (!formData.vehicleNumber) e.vehicleNumber = "Required";
    else if (!vehicleNumberRegex.test(formData.vehicleNumber.replace(/\s/g, "")))
      e.vehicleNumber = "Format: MH12AB1234";
    if (!formData.date) e.date = "Required";
    if (!formData.time) e.time = "Required";
    if (formData.seatsAvailable < 1 || formData.seatsAvailable > 12)
      e.seatsAvailable = "1–12 seats";
    if (formData.fare < 1) e.fare = "Must be > 0";
    if (formData.date) {
      const chosen = new Date(formData.date);
      const today  = new Date(); today.setHours(0,0,0,0);
      if (chosen < today) e.date = "Date cannot be in the past";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
    const filtered = allCities.filter(c => c.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(value ? (filtered.length ? filtered : [value]) : []);
    setActiveField(field);
  };

  const pickCity = (city, field) => {
    setFormData(prev => ({ ...prev, [field]: city }));
    if (!allCities.includes(city)) setAllCities(prev => [...prev, city]);
    setSuggestions([]);
    setActiveField(null);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const cleanNumber = formData.vehicleNumber.replace(/\s/g, "").toUpperCase();
      const [sourceCoords, destCoords] = await Promise.all([
        getCoords(formData.source),
        getCoords(formData.destination),
      ]);
      await API.post("/rides", {
        source: formData.source, destination: formData.destination,
        sourceCoords, destCoords,
        fare: Number(formData.fare), seatsAvailable: Number(formData.seatsAvailable),
        womenOnly: formData.womenOnly,
        vehicleModel: formData.vehicleModel, vehicleColor: formData.vehicleColor,
        vehicleNumber: cleanNumber, date: formData.date, time: formData.time,
      });
      const profileRes = await API.put("/users/me", {
        vehicleModel: formData.vehicleModel, vehicleColor: formData.vehicleColor,
        vehicleNumber: cleanNumber,
      });
      if (profileRes.data?.user) sessionStorage.setItem("user", JSON.stringify(profileRes.data.user));
      navigate("/driver-dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error creating ride. Please try again.");
    } finally { setLoading(false); }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const lbl = {
    fontSize: "0.72rem", color: "var(--text-muted)",
    letterSpacing: "0.1em", textTransform: "uppercase",
    display: "block", marginBottom: "7px", fontWeight: 600,
  };
  const sectionTitle = {
    fontSize: "0.8rem", fontWeight: 700, color: "var(--text)",
    letterSpacing: "0.08em", textTransform: "uppercase",
    marginBottom: "1rem", paddingBottom: "8px",
    borderBottom: "1px solid var(--border)",
  };
  const errStyle    = { fontSize: "0.72rem", color: "#ef4444", marginTop: "4px" };
  const dropdownStyle = {
    position: "absolute", background: "white", border: "1px solid #e5e7eb",
    borderRadius: "8px", width: "100%", marginTop: "4px", zIndex: 50,
    maxHeight: "180px", overflowY: "auto", boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  };
  const dropdownItem = {
    padding: "10px 14px", cursor: "pointer", fontSize: "0.88rem",
    borderBottom: "1px solid #f3f4f6", color: "#111",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-3 sm:p-4 md:p-8">
      <div className="max-w-[600px] mx-auto flex flex-col gap-3 sm:gap-4 md:gap-5">

        {/* Header */}
        <div className="fade-up" style={{ paddingTop: "1rem" }}>
          <span className="chip" style={{ marginBottom: "12px", display: "inline-flex" }}>
            <span className="chip-dot" />Driver Setup
          </span>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(1.1rem,3.5vw,1.6rem)", letterSpacing: "-0.03em", color: "var(--text)" }}>
            {tab === "history" ? "Ride History" : "Create Your Ride"}
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "5px" }}>
            {tab === "history"
              ? "Your past rides as a driver"
              : "Set your route and vehicle details so passengers can find you"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { key: "create",  label: "Create Ride", icon: <RideIcon /> },
            { key: "history", label: "History",     icon: <HistoryIcon /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "8px 18px", borderRadius: "8px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px", border: "1px solid",
              background:  tab === t.key ? "var(--primary, #6366f1)" : "transparent",
              color:       tab === t.key ? "white" : "var(--text-muted)",
              borderColor: tab === t.key ? "var(--primary, #6366f1)" : "rgba(99,102,241,0.2)",
              transition: "all 0.2s",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ══ HISTORY TAB ══ */}
        {tab === "history" && (
          <div className="fade-up">
            {historyLoading ? (
              <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
                <span className="spinner" style={{ margin: "0 auto" }} />
                <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "1rem" }}>Loading history…</p>
              </div>
            ) : history.length === 0 ? (
              <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>📋</div>
                <p style={{ color: "var(--text)", fontWeight: 700 }}>No ride history yet</p>
                <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "5px" }}>
                  Completed and cancelled rides will appear here
                </p>
                <button
                  onClick={() => setTab("create")}
                  style={{ marginTop: "1.5rem", padding: "10px 24px", borderRadius: "8px", background: "var(--primary, #6366f1)", color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>
                  Create your first ride →
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {history.map(ride => {
                  const sc = statusColor(ride.status);
                  return (
                    <div key={ride._id} className="glass-card p-4 md:px-6 md:py-5">
                      {/* Route + status */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.82rem" }}>{ride.source}</span>
                          <svg width="16" height="10" fill="none" viewBox="0 0 16 10">
                            <path d="M1 5h14M9 1l6 4-6 4" stroke="var(--primary,#6366f1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.82rem" }}>{ride.destination}</span>
                        </div>
                        <span style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, textTransform: "capitalize" }}>
                          {ride.status}
                        </span>
                      </div>

                      {/* Meta */}
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: ride.passengers?.length ? "12px" : 0 }}>
                        {ride.fare  && <span>₹{ride.fare}/seat</span>}
                        {ride.date  && <span>📅 {ride.date}</span>}
                        {ride.time  && <span>⏰ {ride.time}</span>}
                        {ride.vehicleModel && <span>🚗 {ride.vehicleModel}</span>}
                        <span>{ride.passengers?.length || 0} passenger{ride.passengers?.length !== 1 ? "s" : ""}</span>
                      </div>

                      {/* Passengers */}
                      {ride.passengers?.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {ride.passengers.map(b => (
                            <div key={b._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)", flexWrap: "wrap", gap: "8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>👤</div>
                                <div>
                                  <div style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.85rem" }}>{b.passengerId?.name || "Passenger"}</div>
                                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                                    {b.passengerId?.gender || ""}{b.seatsBooked && `  ·  ${b.seatsBooked} seat${b.seatsBooked !== 1 ? "s" : ""}`}
                                    {b.status === "cancelled" && <span style={{ color: "#ef4444", marginLeft: "6px" }}>· cancelled</span>}
                                  </div>
                                </div>
                              </div>
                              {b.passengerId?.phone && (
                                <a href={`tel:${b.passengerId.phone}`} style={{ padding: "5px 12px", borderRadius: "6px", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", color: "#16a34a", fontSize: "0.75rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                                  📞 {b.passengerId.phone}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ CREATE RIDE TAB ══ */}
        {tab === "create" && (
          <>
            {/* ── Route ── */}
            <div className="glass-card fade-up p-4 sm:p-5 md:p-8">
              <p style={sectionTitle}>Route</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                {/* Source */}
                <div>
                  <label style={lbl}>Pickup Location</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", zIndex: 1 }} />
                    <input className="input-field" placeholder="City or area"
                      value={formData.source}
                      onChange={e => handleInputChange(e.target.value, "source")}
                      onFocus={() => { setActiveField("source"); handleInputChange(formData.source, "source"); }}
                      onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                      style={{ paddingLeft: "36px", borderColor: errors.source ? "#ef4444" : "" }} />
                    {activeField === "source" && suggestions.length > 0 && (
                      <div style={dropdownStyle}>
                        {suggestions.map((city, i) => (
                          <div key={i} style={dropdownItem}
                            onMouseDown={() => pickCity(city, "source")}
                            onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                            onMouseLeave={e => e.currentTarget.style.background = "white"}>
                            {city}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.source && <p style={errStyle}>{errors.source}</p>}
                </div>

                {/* Destination */}
                <div>
                  <label style={lbl}>Drop-off Destination</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "8px", height: "8px", borderRadius: "2px", background: "#ef4444", zIndex: 1 }} />
                    <input className="input-field" placeholder="City or area"
                      value={formData.destination}
                      onChange={e => handleInputChange(e.target.value, "destination")}
                      onFocus={() => { setActiveField("destination"); handleInputChange(formData.destination, "destination"); }}
                      onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                      style={{ paddingLeft: "36px", borderColor: errors.destination ? "#ef4444" : "" }} />
                    {activeField === "destination" && suggestions.length > 0 && (
                      <div style={dropdownStyle}>
                        {suggestions.map((city, i) => (
                          <div key={i} style={dropdownItem}
                            onMouseDown={() => pickCity(city, "destination")}
                            onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                            onMouseLeave={e => e.currentTarget.style.background = "white"}>
                            {city}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.destination && <p style={errStyle}>{errors.destination}</p>}
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: "4px" }}>
                  <div>
                    <label style={lbl}>Date</label>
                    <input type="date" className="input-field"
                      value={formData.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => { setFormData(p => ({ ...p, date: e.target.value })); setErrors(p => ({ ...p, date: "" })); }}
                      style={{ borderColor: errors.date ? "#ef4444" : "" }} />
                    {errors.date && <p style={errStyle}>{errors.date}</p>}
                  </div>
                  <div>
                    <label style={lbl}>Time</label>
                    <input type="time" className="input-field"
                      value={formData.time}
                      onChange={e => { setFormData(p => ({ ...p, time: e.target.value })); setErrors(p => ({ ...p, time: "" })); }}
                      style={{ borderColor: errors.time ? "#ef4444" : "" }} />
                    {errors.time && <p style={errStyle}>{errors.time}</p>}
                  </div>
                </div>

                {/* Route preview */}
                {(formData.source || formData.destination) && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "12px 20px", borderRadius: "var(--radius)", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)" }}>
                    <span style={{ fontWeight: 700, color: "var(--text)" }}>{formData.source || "—"}</span>
                    <svg width="20" height="10" fill="none" viewBox="0 0 20 10">
                      <path d="M1 5h18M13 1l6 4-6 4" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontWeight: 700, color: "var(--text)" }}>{formData.destination || "—"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Vehicle Details ── */}
            <div className="glass-card fade-up p-4 sm:p-5 md:p-8 overflow-visible">
              <p style={sectionTitle}>Vehicle Details</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* Model */}
                  <div>
                    <label style={lbl}>Model</label>
                    <div style={{ position: "relative" }}>
                      <input className="input-field" placeholder="e.g. Swift, Innova"
                        value={formData.vehicleModel}
                        onChange={e => {
                          const val = e.target.value;
                          setFormData(p => ({ ...p, vehicleModel: val }));
                          setErrors(p => ({ ...p, vehicleModel: "" }));
                          setModelSuggestions(carModels.filter(c => c.toLowerCase().includes(val.toLowerCase())).slice(0, 10));
                        }}
                        onBlur={() => setTimeout(() => setModelSuggestions([]), 150)}
                        style={{ borderColor: errors.vehicleModel ? "#ef4444" : "" }} />
                      {modelSuggestions.length > 0 && (
                        <div style={dropdownStyle}>
                          {modelSuggestions.map((car, i) => (
                            <div key={i} style={dropdownItem}
                              onMouseDown={() => { setFormData(p => ({ ...p, vehicleModel: car })); setModelSuggestions([]); }}
                              onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
                              onMouseLeave={e => e.currentTarget.style.background = "white"}>
                              {car}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.vehicleModel && <p style={errStyle}>{errors.vehicleModel}</p>}
                  </div>

                  {/* Color */}
                  <div>
                    <label style={lbl}>Color</label>
                    <select className="input-field" value={formData.vehicleColor}
                      onChange={e => { setFormData(p => ({ ...p, vehicleColor: e.target.value })); setErrors(p => ({ ...p, vehicleColor: "" })); }}
                      style={{ borderColor: errors.vehicleColor ? "#ef4444" : "" }}>
                      <option value="">Select Color</option>
                      {["White","Black","Silver","Grey","Blue","Red","Green","Brown","Orange","Yellow","Pink","Other"].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    {errors.vehicleColor && <p style={errStyle}>{errors.vehicleColor}</p>}
                  </div>
                </div>

                {/* Vehicle Number */}
                <div>
                  <label style={lbl}>Vehicle Number</label>
                  <input className="input-field" placeholder="e.g. MH12AB1234"
                    value={formData.vehicleNumber} maxLength={10}
                    onChange={e => {
                      let val = e.target.value.toUpperCase();
                      let clean = "";
                      for (let i = 0; i < val.length && i < 10; i++) {
                        const ch = val[i];
                        if (i < 2  && /[A-Z]/.test(ch)) clean += ch;
                        else if (i < 4  && /[0-9]/.test(ch)) clean += ch;
                        else if (i < 7  && /[A-Z]/.test(ch)) clean += ch;
                        else if (i < 10 && /[0-9]/.test(ch)) clean += ch;
                        else break;
                      }
                      setFormData(p => ({ ...p, vehicleNumber: clean }));
                      setErrors(p => ({ ...p, vehicleNumber: "" }));
                    }}
                    style={{ letterSpacing: "0.12em", borderColor: errors.vehicleNumber ? "#ef4444" : "" }} />
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                    {["MH", "12", "AB", "1234"].map((seg, i) => (
                      <span key={i} style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: 700, background: "rgba(99,102,241,0.07)", color: "var(--primary)", border: "1px solid rgba(99,102,241,0.15)" }}>{seg}</span>
                    ))}
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", alignSelf: "center", marginLeft: "4px" }}>= state · district · series · number</span>
                  </div>
                  {errors.vehicleNumber && <p style={errStyle}>{errors.vehicleNumber}</p>}
                </div>
              </div>
            </div>

            {/* ── Ride Settings ── */}
            <div className="glass-card fade-up p-4 sm:p-5 md:p-8">
              <p style={sectionTitle}>Ride Settings</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label style={lbl}>Fare per Seat (Rs.)</label>
                    <input type="number" className="input-field" value={formData.fare} min={1}
                      onChange={e => { setFormData(p => ({ ...p, fare: Math.max(1, Number(e.target.value)) })); setErrors(p => ({ ...p, fare: "" })); }}
                      style={{ borderColor: errors.fare ? "#ef4444" : "" }} />
                    {errors.fare && <p style={errStyle}>{errors.fare}</p>}
                  </div>
                  <div>
                    <label style={lbl}>Seats Available</label>
                    <input type="number" className="input-field" value={formData.seatsAvailable} min={1} max={6}
                      onChange={e => { const v = Math.min(6, Math.max(1, Number(e.target.value))); setFormData(p => ({ ...p, seatsAvailable: v })); setErrors(p => ({ ...p, seatsAvailable: "" })); }}
                      style={{ borderColor: errors.seatsAvailable ? "#ef4444" : "" }} />
                    {errors.seatsAvailable && <p style={errStyle}>{errors.seatsAvailable}</p>}
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "12px", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <input type="checkbox" checked={formData.womenOnly}
                    onChange={e => setFormData(p => ({ ...p, womenOnly: e.target.checked }))} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Women-only ride</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Only female passengers can book</div>
                  </div>
                </label>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ marginBottom: "2rem" }}>
              {loading
                ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span className="spinner" />Setting up your ride...</span>
                : "Publish Ride"
              }
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default BecomeDriver;