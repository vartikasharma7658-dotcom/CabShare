// src/pages/PassengerDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const cities = [
  "Agra","Ahmedabad","Ajmer","Aligarh","Amritsar",
  "Bangalore","Bhopal","Banasthali",
  "Chandigarh",
  "Dehradun","Delhi",
  "Ghaziabad","Goa","Gurgaon",
  "Haridwar","Hyderabad",
  "Indore",
  "Jaipur","Jodhpur","Jaisalmer",
  "Kanpur","Kolkata","Kota","Lucknow",
  "Manali","Mathura","Mumbai",
  "Nainital","Navi Mumbai","Niwai","Noida",
  "Panipat","Pune","Rishikesh","Roorkee",
  "Shimla","Udaipur","Varanasi",
];

const HistoryIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
  </svg>
);
const RideIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8l5 3v5h-5V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const lbl = {
  fontStyle: "italic", fontSize: "0.72rem", color: "var(--text-muted)",
  letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "7px",
};

const statusColor = (s) => {
  if (s === "completed") return { bg: "rgba(22,163,74,0.1)",  color: "#16a34a", border: "rgba(22,163,74,0.25)" };
  if (s === "cancelled") return { bg: "rgba(239,68,68,0.08)", color: "#ef4444", border: "rgba(239,68,68,0.2)"  };
  return { bg: "rgba(99,102,241,0.08)", color: "var(--primary)", border: "rgba(99,102,241,0.2)" };
};

const DriverInfoRow = ({ ride }) => {
  if (!ride) return null;
  const driver  = ride.driverId || {};
  const name    = driver.name  || "Driver";
  const phone   = driver.phone || null;
  const rating  = driver.averageRating || 0;
  const total   = driver.totalRatings  || 0;
  const vehicle = [ride.vehicleModel, ride.vehicleColor, ride.vehicleNumber].filter(Boolean).join("  ·  ");

  return (
    <div style={{
      marginTop: "12px", padding: "12px 14px", borderRadius: "10px",
      background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.13)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "10px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "10px",
          background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem",
        }}>🚗</div>
        <div>
          <div style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.9rem" }}>{name}</div>
          {rating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
              <span style={{ color: "#f59e0b", fontSize: "0.82rem" }}>★</span>
              <span style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.78rem" }}>{rating.toFixed(1)}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>({total} rating{total !== 1 ? "s" : ""})</span>
            </div>
          )}
          {vehicle && (
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>{vehicle}</div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {ride.fare && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#c8a84b", lineHeight: 1 }}>₹{ride.fare}</div>
            <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "2px" }}>per seat</div>
          </div>
        )}
        {phone && (
          <a href={`tel:${phone}`} style={{
            padding: "7px 14px", borderRadius: "8px",
            background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.25)",
            color: "#16a34a", fontWeight: 600, fontSize: "0.78rem",
            textDecoration: "none", display: "flex", alignItems: "center", gap: "5px",
          }}>
            <PhoneIcon /> {phone}
          </a>
        )}
      </div>
    </div>
  );
};

const PassengerDashboard = () => {
  const navigate = useNavigate();

  // ── Get current user gender from session ──────────────────────────────────
  const currentUser = (() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();
  const isFemale = currentUser?.gender?.toLowerCase() === "female";

  const [filters,      setFilters]      = useState({ source: "", destination: "", womenOnly: false, seats: 1 });
  const [suggestions,  setSuggestions]  = useState([]);
  const [activeField,  setActiveField]  = useState(null);
  const [searched,     setSearched]     = useState(false);
  const [matchedRides, setMatchedRides] = useState([]);
  const [searching,    setSearching]    = useState(false);
  const [tab,          setTab]          = useState("search");
  const [ongoingBooking, setOngoingBooking] = useState(null);
  const [history,        setHistory]        = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [rideCancelled, setRideCancelled] = useState(
    () => sessionStorage.getItem("ride_cancelled") === "1"
  );
  useEffect(() => {
    if (sessionStorage.getItem("ride_cancelled") === "1")
      sessionStorage.removeItem("ride_cancelled");
  }, []);

  const checkActiveBooking = useCallback(async () => {
    try {
      const res = await API.get("/bookings");
      if (!res.data.length) { setOngoingBooking(null); return; }
      const active = res.data.find(b => ["pending","accepted","started"].includes(b.status));
      setOngoingBooking(active || null);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    checkActiveBooking();
    const iv = setInterval(checkActiveBooking, 4000);
    return () => clearInterval(iv);
  }, [checkActiveBooking]);

  useEffect(() => {
    if (tab !== "history") return;
    const load = async () => {
      setHistoryLoading(true);
      try {
        const res = await API.get("/bookings/history/passenger");
        setHistory(res.data);
      } catch (err) { console.error(err); }
      finally { setHistoryLoading(false); }
    };
    load();
  }, [tab]);

  const handleInputChange = (value, field) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setSuggestions(cities.filter(c => c.toLowerCase().includes(value.toLowerCase())));
    setActiveField(field);
  };

  const handleSearch = async () => {
    if (!filters.source || !filters.destination) { alert("Please enter source and destination"); return; }
    setSearching(true);
    try {
      const res = await API.get("/rides", { params: { source: filters.source, destination: filters.destination } });
      const filtered = res.data.filter(ride => {
        const srcMatch = ride.source.toLowerCase().includes(filters.source.toLowerCase());
        const dstMatch = ride.destination.toLowerCase().includes(filters.destination.toLowerCase());
        if (ride.womenOnly && !isFemale) return false;
        const womenFilter = filters.womenOnly ? ride.womenOnly === true : true;
        const seatsMatch = ride.seatsAvailable >= filters.seats;  // ← added
        return srcMatch && dstMatch && womenFilter && seatsMatch;
      });

      setMatchedRides(filtered);
      setSearched(true);
    } catch (error) { console.error(error); }
    finally { setSearching(false); }
  };

  const onSelectRide = async (ride) => {
    try {
      await API.post("/bookings", { rideId: ride._id, seatsBooked: filters.seats, status: "pending", otpVerified: false });
      navigate("/ride-tracking");
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  const Dropdown = ({ field }) =>
    activeField === field && suggestions.length > 0 ? (
      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg, #fff)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px", zIndex: 10, maxHeight: "160px", overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
        {suggestions.map((city, i) => (
          <div key={i}
            onMouseDown={() => { setFilters(p => ({ ...p, [field]: city })); setSuggestions([]); }}
            style={{ padding: "9px 14px", cursor: "pointer", fontSize: "0.88rem", color: "var(--text)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {city}
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-[var(--bg-void)] p-3 sm:p-4 md:p-6">
      <div className="max-w-[860px] mx-auto flex flex-col gap-3 sm:gap-4 md:gap-5">

        {/* Header */}
        <div className="fade-up" style={{ paddingTop: "1rem" }}>
          <span className="badge-glow" style={{ marginBottom: "12px", display: "inline-flex" }}>Passenger</span>
          <h1 style={{ fontWeight: 700, fontSize: "clamp(1.1rem,3.5vw,1.6rem)", letterSpacing: "-0.02em", color: "var(--cream)" }}>
            {tab === "history" ? "Ride History" : "Find a Ride"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontStyle: "italic", marginTop: "5px" }}>
            {tab === "history" ? "Your past and cancelled rides" : "Search across live routes offered by verified drivers"}
          </p>
        </div>

        {/* Ongoing ride banner */}
        {ongoingBooking && (
          <div className="glass-card fade-up flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{
            padding: "1rem", border: "1px solid rgba(99,102,241,0.35)",
            background: "rgba(99,102,241,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1", animation: "pulseDot 1.5s ease-in-out infinite" }} />
              <div>
                <div style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.9rem" }}>You have an ongoing ride</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Status: <span style={{ color: "var(--primary)", fontWeight: 600, textTransform: "capitalize" }}>{ongoingBooking.status}</span>
                  {ongoingBooking.rideId?.source && ` · ${ongoingBooking.rideId.source} → ${ongoingBooking.rideId.destination}`}
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/ride-tracking")}
              className="w-full sm:w-auto"
              style={{ padding: "9px 22px", borderRadius: "8px", background: "var(--primary, #6366f1)", color: "white", border: "none", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
              Resume Tracking →
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { key: "search",  label: "Find Ride",  icon: <RideIcon /> },
            { key: "history", label: "My History", icon: <HistoryIcon /> },
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

        {/* ══ SEARCH TAB ══ */}
        {tab === "search" && (
          <>
            <div className="glass-card fade-up relative p-4 sm:p-5 md:p-8">
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent)", borderRadius: "4px 4px 0 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label style={lbl}>From</label>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", width: "7px", height: "7px", borderRadius: "50%", background: "var(--gold)", zIndex: 1 }} />
                      <input className="input-field" placeholder="Origin city" value={filters.source}
                        onChange={e => handleInputChange(e.target.value, "source")}
                        onFocus={() => setActiveField("source")}
                        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                        style={{ paddingLeft: "32px" }} />
                      <Dropdown field="source" />
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>To</label>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", width: "7px", height: "7px", borderRadius: "2px", background: "#c0392b", zIndex: 1 }} />
                      <input className="input-field" placeholder="Destination" value={filters.destination}
                        onChange={e => handleInputChange(e.target.value, "destination")}
                        onFocus={() => setActiveField("destination")}
                        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                        style={{ paddingLeft: "32px" }} />
                      <Dropdown field="destination" />
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Seats</label>
                    <input type="number" min="1" max="4" className="input-field" value={filters.seats}
                      onChange={e => setFilters(p => ({ ...p, seats: Number(e.target.value) }))} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>

                  {/* Women-only checkbox — only show to female users */}
                  {isFemale ? (
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none" }}>
                      <input type="checkbox" checked={filters.womenOnly} onChange={e => setFilters(p => ({ ...p, womenOnly: e.target.checked }))} />
                      <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>Women-only rides</span>
                    </label>
                  ) : (
                    // Non-female users see an informational note instead
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                      🔒 Women-only rides are hidden for your profile
                    </span>
                  )}

                  <button className="btn-primary" onClick={handleSearch} disabled={searching} style={{ width: "100%", padding: "12px" }}>
                    {searching ? <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span className="spinner" />Searching...</span> : "Search Rides"}
                  </button>
                </div>
              </div>
            </div>

            <div className="fade-up fade-up-delay-2">
              {!searched ? (
                <div className="glass-card" style={{ padding: "2rem 1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>🗺️</div>
                  <p style={{ color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.85rem" }}>Enter a route to discover rides</p>
                  <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "5px" }}>Thousands of routes available across India</p>
                </div>
              ) : matchedRides.length === 0 ? (
                <div className="glass-card" style={{ padding: "2rem 1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>🚫</div>
                  <p style={{ color: "var(--text-secondary)", fontWeight: 700 }}>No rides found for this route</p>
                  <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "5px" }}>Try different cities or check back soon</p>
                </div>
              ) : (
                <>
                  <p style={{ fontStyle: "italic", fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                    {matchedRides.length} ride{matchedRides.length !== 1 ? "s" : ""} found
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {matchedRides.map(ride => (
                      <div key={ride._id} className="glass-card ride-card p-3 sm:p-4 md:p-6">
                        {/* Women-only badge */}
                        {ride.womenOnly && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "100px", background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.22)", color: "#ec4899", fontSize: "0.68rem", fontWeight: 600, marginBottom: "10px" }}>
                            ♀ Women-only ride
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="w-full sm:w-auto" style={{ flex: 1, minWidth: "0", display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--cream)" }}>{ride.source}</div>
                              <div style={{ fontStyle: "italic", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "2px" }}>Pickup</div>
                              {ride.driverId?.averageRating > 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
                                  <span style={{ color: "#f59e0b", fontSize: "0.9rem" }}>★</span>
                                  <span style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.82rem" }}>{ride.driverId.averageRating.toFixed(1)}</span>
                                  <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>({ride.driverId.totalRatings})</span>
                                </div>
                              )}
                            </div>
                            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", minWidth: "50px" }}>
                              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(200,168,75,0.4), transparent)" }} />
                              <svg width="16" height="10" fill="none" viewBox="0 0 16 10"><path d="M1 5h14M9 1l6 4-6 4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(200,168,75,0.4))" }} />
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--cream)" }}>{ride.destination}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>📅 {ride.date} &nbsp; ⏰ {ride.time}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", width: "100%" }}>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--gold)", lineHeight: 1 }}>₹{ride.fare}</div>
                              <div style={{ fontStyle: "italic", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "3px" }}>per seat</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--green-acc)", lineHeight: 1 }}>{ride.seatsAvailable}</div>
                              <div style={{ fontStyle: "italic", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "3px" }}>seats</div>
                            </div>
                            <button onClick={() => onSelectRide(ride)}
                               className="w-full sm:w-auto"
                               style={{ flex: "1 1 auto", padding: "10px 14px", borderRadius: "8px", background: "linear-gradient(135deg, #c8a84b, #a8882e)", color: "#0a0704", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.06em", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(200,168,75,0.25)", transition: "all 0.25s", textAlign: "center" }}
                              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(200,168,75,0.4)"; }}
                              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(200,168,75,0.25)"; }}>
                              Book →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ══ HISTORY TAB ══ */}
        {tab === "history" && (
          <div className="fade-up">
            {historyLoading ? (
              <div className="glass-card" style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
                <span className="spinner" style={{ margin: "0 auto" }} />
                <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "1rem" }}>Loading history…</p>
              </div>
            ) : history.length === 0 ? (
              <div className="glass-card" style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>📭</div>
                <p style={{ color: "var(--text-secondary)", fontWeight: 700 }}>No ride history yet</p>
                <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "5px" }}>Your completed and cancelled rides will appear here</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {history.map(b => {
                  const sc   = statusColor(b.status);
                  const ride = b.rideId || {};
                  return (
                    <div key={b._id} className="glass-card p-3 sm:p-4 md:p-6">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.82rem" }}>{ride.source || "—"}</span>
                          <svg width="16" height="10" fill="none" viewBox="0 0 16 10">
                            <path d="M1 5h14M9 1l6 4-6 4" stroke="var(--primary,#6366f1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.82rem" }}>{ride.destination || "—"}</span>
                        </div>
                        <span style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, textTransform: "capitalize" }}>
                          {b.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {ride.date      && <span>📅 {ride.date}</span>}
                        {ride.time      && <span>⏰ {ride.time}</span>}
                        {b.seatsBooked  && <span>💺 {b.seatsBooked} seat{b.seatsBooked !== 1 ? "s" : ""}</span>}
                        {ride.fare      && <span>💰 ₹{ride.fare} / seat</span>}
                        {ride.womenOnly && <span style={{ color: "#ec4899" }}>♀ Women-only</span>}
                      </div>
                      <DriverInfoRow ride={ride} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Cancelled toast */}
        {rideCancelled && (
          <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", zIndex: 1000, backdropFilter: "blur(4px)" }}>
            <div className="glass-card" style={{ padding: "2rem", maxWidth: "340px", width: "100%", textAlign: "center", borderRadius: "16px" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>❌</div>
              <h2 style={{ fontWeight: 700, color: "var(--cream)", marginBottom: "0.5rem", fontSize: "1rem" }}>Ride Cancelled</h2>
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "1.5rem" }}>Your driver has cancelled the ride.</p>
              <button onClick={() => setRideCancelled(false)}
                style={{ padding: "12px 28px", borderRadius: "8px", background: "var(--primary, #6366f1)", color: "white", border: "none", fontWeight: 700, cursor: "pointer", width: "100%" }}>
                Find Another Ride
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PassengerDashboard;