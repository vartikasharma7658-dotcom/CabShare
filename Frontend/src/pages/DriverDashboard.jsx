import { useState, useEffect, useCallback, useRef } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import RouteMap from "../components/RouteMap";
import RideChat from "../components/RideChat";
import RatingModal from "../components/RatingModal";

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const HistoryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
  </svg>
);

const statusColor = (s) => {
  if (s === "completed") return { bg: "rgba(22,163,74,0.1)", color: "#16a34a", border: "rgba(22,163,74,0.25)" };
  if (s === "cancelled") return { bg: "rgba(239,68,68,0.08)", color: "#ef4444", border: "rgba(239,68,68,0.2)" };
  return { bg: "rgba(99,102,241,0.08)", color: "var(--primary)", border: "rgba(99,102,241,0.2)" };
};

const StarRating = ({ rating, total }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "4px" }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ color: s <= Math.round(rating) ? "#f59e0b" : "rgba(150,150,150,0.35)", fontSize: "0.75rem" }}>★</span>
    ))}
    {rating > 0 ? (
      <>
        <span style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.78rem", marginLeft: "4px" }}>{rating.toFixed(1)}</span>
      </>
    ) : (
      <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginLeft: "4px" }}>No ratings yet</span>
    )}
  </div>
);

const MessageButton = ({ onClick, unread = 0, label = "Message" }) => (
  <button onClick={onClick} style={{
    position: "relative", padding: "6px 14px", borderRadius: "7px",
    background: unread > 0 ? "rgba(99,102,241,0.16)" : "rgba(99,102,241,0.08)",
    border: `1px solid ${unread > 0 ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.2)"}`,
    color: "var(--primary)", fontSize: "0.78rem", fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
    transition: "all 0.2s",
  }}>
    <ChatIcon /> {label}
    {unread > 0 && (
      <span style={{
        position: "absolute", top: "-7px", right: "-7px",
        minWidth: "16px", height: "16px", borderRadius: "100px",
        background: "#ef4444", color: "white",
        fontSize: "0.6rem", fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 3px", lineHeight: 1,
        boxShadow: "0 2px 6px rgba(239,68,68,0.5)",
        animation: "pulseDot 1.5s ease-in-out infinite",
      }}>
        {unread > 9 ? "9+" : unread}
      </span>
    )}
  </button>
);

const PassengerCancelledModal = ({ passengerName, onClose }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1200, backdropFilter: "blur(8px)", padding: "24px",
  }}>
    <div className="glass-card" style={{
      padding: "2.5rem 2rem", width: "100%", maxWidth: "380px",
      borderRadius: "20px", textAlign: "center",
      boxShadow: "0 25px 60px rgba(0,0,0,0.55)",
      border: "1px solid rgba(239,68,68,0.25)",
    }}>
      <div style={{
        width: "60px", height: "60px", borderRadius: "50%",
        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 1.25rem",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <div style={{
        display: "inline-flex", padding: "4px 12px", borderRadius: "100px",
        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
        color: "#ef4444", fontSize: "0.68rem", letterSpacing: "0.12em",
        textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem",
      }}>
        Booking Cancelled
      </div>
      <h2 style={{ fontWeight: 700, color: "var(--text)", fontSize: "1.2rem", marginBottom: "0.5rem" }}>
        Passenger left the ride
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
        <strong style={{ color: "var(--text)" }}>{passengerName || "A passenger"}</strong> has cancelled their booking. Your seat is now available again.
      </p>
      <button onClick={onClose} style={{
        width: "100%", padding: "13px", borderRadius: "10px",
        background: "var(--primary, #6366f1)", color: "white",
        border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem",
        boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
      }}>
        Got it
      </button>
    </div>
  </div>
);

const DriverDashboard = () => {
  const [tab,            setTab]            = useState("dashboard");
  const [requests,       setRequests]       = useState([]);
  const [rideStarted,    setRideStarted]    = useState(false);
  const [ride,           setRide]           = useState(null);
  const [otpModal,       setOtpModal]       = useState({ open: false, bookingId: null, value: "" });
  const [otpError,       setOtpError]       = useState("");
  const [confirmEnd,     setConfirmEnd]     = useState(false);
  const [ending,         setEnding]         = useState(false);
  const [showChat,       setShowChat]       = useState(false);
  const [chatTarget,     setChatTarget]     = useState(null);
  const [driverName,     setDriverName]     = useState("Driver");
  const [history,        setHistory]        = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [unreadMap,      setUnreadMap]      = useState({});
  const [ratingModal,    setRatingModal]    = useState(null);

  const trackedActiveRef     = useRef(null);
  const [cancelledPassenger, setCancelledPassenger] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const u = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (u.name) setDriverName(u.name);
    } catch (_) {}
  }, []);

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

  const fetchRide = useCallback(async () => {
    try {
      const res = await API.get("/rides?role=driver");
      if (res.data.length > 0) {
        const r = res.data[0];
        setRide(r);
        if (r.status === "started") setRideStarted(true);
      } else {
        setRide(null);
      }
    } catch (err) { console.error(err); }
  }, []);

  const fetchRequests = useCallback(async (rideId) => {
    if (!rideId) return;
    try {
      const res  = await API.get(`/bookings/ride/${rideId}`);
      const data = res.data;

      if (trackedActiveRef.current !== null) {
        data.forEach(b => {
          const bid = b._id.toString();
          if (b.status === "cancelled" && trackedActiveRef.current.has(bid)) {
            setCancelledPassenger({ name: b.passengerId?.name || "A passenger" });
            trackedActiveRef.current.delete(bid);
          }
        });
      }

      trackedActiveRef.current = new Set(
        data.filter(b => b.status !== "cancelled").map(b => b._id.toString())
      );

      setRequests(data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchRide();
    const iv = setInterval(fetchRide, 3000);
    return () => clearInterval(iv);
  }, [fetchRide]);

  useEffect(() => {
    if (!ride?._id) return;
    trackedActiveRef.current = null;
    fetchRequests(ride._id);
    const iv = setInterval(() => fetchRequests(ride._id), 3000);
    return () => clearInterval(iv);
  }, [ride?._id, fetchRequests]);

  const activeRequests = requests.filter(r => r.status !== "cancelled");
  const allVerified    = activeRequests.length > 0 && activeRequests.every(r => r.otpVerified);

  const openChat = (r) => {
    const bid = r._id?.toString?.() || r._id;
    setChatTarget({ bookingId: bid, name: r.passengerId?.name || "Passenger" });
    setShowChat(true);
    setUnreadMap(prev => ({ ...prev, [bid]: 0 }));
  };

  const handleUnreadChange = useCallback((count) => {
    if (!chatTarget?.bookingId) return;
    setUnreadMap(prev => ({ ...prev, [chatTarget.bookingId]: count }));
  }, [chatTarget?.bookingId]);

  const acceptRequest = async (id) => {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      await API.put(`/bookings/${id}`, { status: "accepted", otp, otpVerified: false });
      fetchRequests(ride._id);
    } catch (err) { console.error(err); }
  };

  const verifyOtp = async () => {
    setOtpError("");
    try {
      await API.put(`/bookings/${otpModal.bookingId}`, { otpVerified: true, enteredOtp: otpModal.value });
      setOtpModal({ open: false, bookingId: null, value: "" });
      fetchRequests(ride._id);
    } catch (err) { setOtpError(err.response?.data?.message || "Wrong OTP, try again"); }
  };

  const startRide = async () => {
    if (!allVerified) { alert("Verify all passenger OTPs first"); return; }
    try {
      for (const r of activeRequests)
        await API.put(`/bookings/${r._id}`, { status: "started" });
      await API.put(`/rides/${ride._id}/start`);
      setRideStarted(true);
      fetchRequests(ride._id);
    } catch (err) { console.error(err); }
  };

  const cancelRide = async () => {
    if (!ride?._id) { alert("Ride still loading..."); return; }
    try {
      await API.put(`/rides/${ride._id}/cancel`);
      navigate("/driver-details");
    } catch (err) { alert(err.response?.data?.message || "Cancel failed"); }
  };

  const endRide = async () => {
    if (!ride?._id) return;
    setEnding(true);
    try {
      for (const r of activeRequests)
        await API.put(`/bookings/${r._id}`, { status: "completed" });
      await API.put(`/rides/${ride._id}/complete`);

      const firstPassenger = activeRequests[0];
      if (firstPassenger?.passengerId?._id) {
        setRatingModal({
          rideId:        ride._id,
          ratedUserId:   firstPassenger.passengerId._id,
          ratedUserName: firstPassenger.passengerId.name || "Passenger",
        });
      } else {
        navigate("/driver-details");
      }
    } catch (err) { alert(err.response?.data?.message || "Could not end ride."); }
    finally { setEnding(false); setConfirmEnd(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-3 sm:p-4 md:p-6">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-3 sm:gap-4 md:gap-5">

        {/* Header */}
        <div className="fade-up flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4" style={{ paddingTop: "1rem" }}>
          <div>
            <span className="chip" style={{ marginBottom: "12px", display: "inline-flex" }}><span className="chip-dot" />Driver Console</span>
            <h1 style={{ fontWeight: 700, fontSize: "clamp(1.1rem,3.5vw,1.6rem)", letterSpacing: "-0.02em", color: "var(--text)" }}>
              {tab === "history" ? "Ride History" : "Ride Dashboard"}
            </h1>
            {tab === "dashboard" && (ride
              ? <p style={{ color: "var(--text-muted)", marginTop: "6px", fontSize: "0.9rem" }}>{ride.source} → {ride.destination}</p>
              : <p style={{ color: "var(--text-muted)", marginTop: "6px", fontSize: "0.9rem", fontStyle: "italic" }}>No active ride - <span style={{ color: "var(--primary)", cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/driver-details")}>create one</span></p>
            )}
          </div>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {tab === "dashboard" && [
              { val: activeRequests.length,                            lbl: "Requests", color: "var(--primary)" },
              { val: activeRequests.filter(r => r.otpVerified).length, lbl: "Verified",  color: "#16a34a" },
            ].map(s => (
              <div key={s.lbl} className="glass-card" style={{ padding: "1rem 1.4rem", textAlign: "center", minWidth: "90px" }}>
                <div style={{ fontWeight: 700, fontSize: "1.2rem", color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "history",   label: "History", icon: <HistoryIcon /> },
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

        {/* ══ DASHBOARD TAB ══ */}
        {tab === "dashboard" && (
          <>
            <div className="glass-card fade-up p-3 sm:p-4 md:p-8">
              <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "1rem" }}>Passenger Requests</h2>

              {!ride ? (
                <div style={{ padding: "3rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>🚗</div>
                  <p style={{ color: "var(--text)", fontWeight: 700 }}>No active ride</p>
                  <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "4px" }}>Create a ride first to receive passenger requests</p>
                </div>
              ) : activeRequests.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>🛋️</div>
                  <p style={{ color: "var(--text)", fontWeight: 700 }}>No requests yet</p>
                  <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "4px" }}>Passengers will appear here once they book your ride</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {activeRequests.map(r => {
                    const bid      = r._id?.toString?.() || r._id;
                    const myUnread = unreadMap[bid] || 0;
                    return (
                      <div key={r._id} className="glass-card p-3 sm:p-4 md:p-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>👤</div>
                              <div>
                                <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>{r.passengerId?.name || "Passenger"}</div>
                                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                                  {r.passengerId?.gender || ""}{r.passengerId?.gender ? "  ·  " : ""}{r.seatsBooked} seat{r.seatsBooked !== 1 ? "s" : ""}
                                </div>
                                {/* ── Passenger rating — always shown ── */}
                                <StarRating
                                  rating={r.passengerId?.averageRating || 0}
                                  total={r.passengerId?.totalRatings || 0}
                                  newLabel="New passenger"
                                />
                              </div>
                            </div>
                            {(r.status === "accepted" || r.status === "started") && (
                              <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                                <MessageButton onClick={() => openChat(r)} unread={myUnread} />
                                {r.passengerId?.phone && (
                                  <a href={`tel:${r.passengerId.phone}`} style={{ padding: "6px 14px", borderRadius: "7px", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", color: "#16a34a", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
                                    <PhoneIcon /> {r.passengerId.phone}
                                  </a>
                                )}
                              </div>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                              <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600, background: r.status === "accepted" ? "rgba(22,163,74,0.1)" : "rgba(99,102,241,0.1)", color: r.status === "accepted" ? "#16a34a" : "var(--primary)", border: `1px solid ${r.status === "accepted" ? "rgba(22,163,74,0.2)" : "rgba(99,102,241,0.2)"}` }}>{r.status}</span>
                            </div>
                          </div>
                          <div>
                            {r.status === "pending" && (
                              <button onClick={() => acceptRequest(r._id)}
                                style={{ padding: "9px 20px", borderRadius: "8px", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", boxShadow: "0 4px 14px rgba(99,102,241,0.3)", transition: "all 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                                Accept
                              </button>
                            )}
                            {r.status === "accepted" && !r.otpVerified && (
                              <button onClick={() => { setOtpError(""); setOtpModal({ open: true, bookingId: r._id, value: "" }); }}
                                style={{ padding: "9px 20px", borderRadius: "8px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", color: "var(--primary)", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem" }}>
                                Verify OTP
                              </button>
                            )}
                            {r.otpVerified && (
                              <div style={{ padding: "9px 18px", borderRadius: "8px", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", color: "#16a34a", fontWeight: 700, fontSize: "0.85rem" }}>Verified ✓</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Start / Cancel */}
            {ride && !rideStarted && (
              <div className="glass-card fade-up p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h3 style={{ fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>Ready to Roll?</h3>
                    <p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.875rem" }}>
                      {allVerified ? "All passengers verified — you're good to go!" : "Accept requests and verify all OTPs to unlock"}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button onClick={startRide} disabled={!allVerified}
                      style={{ padding: "12px 32px", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: allVerified ? "pointer" : "not-allowed", background: allVerified ? "var(--primary)" : "var(--input-bg)", color: allVerified ? "white" : "var(--text-muted)", boxShadow: allVerified ? "0 6px 24px rgba(99,102,241,0.35)" : "none", transition: "all 0.3s" }}>
                      Start Ride
                    </button>
                    <button onClick={cancelRide}
                      style={{ padding: "12px 28px", borderRadius: "8px", background: "#ef4444", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#dc2626"}
                      onMouseLeave={e => e.currentTarget.style.background = "#ef4444"}>
                      Cancel Ride
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Live Map + End Ride */}
            {rideStarted && ride && (
              <>
                <div className="glass-card fade-up p-3 sm:p-4 md:p-6">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                    <span className="chip"><span className="chip-dot" />Live Route</span>
                    <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.9rem" }}>{ride.source} → {ride.destination}</span>
                  </div>
                  <RouteMap sourceCoords={ride.sourceCoords} destCoords={ride.destCoords} sourceName={ride.source} destName={ride.destination} height="420px" />
                </div>
                <div className="glass-card fade-up p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <h3 style={{ fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>Arrived at destination?</h3>
                      <p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.875rem" }}>This will complete the ride for all passengers.</p>
                    </div>
                    {!confirmEnd ? (
                      <button onClick={() => setConfirmEnd(true)}
                        style={{ padding: "12px 28px", borderRadius: "8px", background: "#16a34a", color: "white", border: "none", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", boxShadow: "0 6px 20px rgba(22,163,74,0.3)", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#15803d"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(0)"; }}>
                        End Ride
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>Confirm end ride?</span>
                        <button onClick={endRide} disabled={ending}
                          style={{ padding: "10px 22px", borderRadius: "8px", background: "#16a34a", color: "white", border: "none", fontWeight: 700, cursor: ending ? "not-allowed" : "pointer", opacity: ending ? 0.7 : 1 }}>
                          {ending ? "Ending…" : "Yes, End Ride"}
                        </button>
                        <button onClick={() => setConfirmEnd(false)}
                          style={{ padding: "10px 20px", borderRadius: "8px", background: "transparent", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.12)", fontWeight: 600, cursor: "pointer" }}>
                          Not yet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

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
                <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "5px" }}>Completed and cancelled rides will appear here</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {history.map(ride => {
                  const sc = statusColor(ride.status);
                  return (
                    <div key={ride._id} className="glass-card p-3 sm:p-4 md:p-6">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.82rem" }}>{ride.source}</span>
                          <svg width="16" height="10" fill="none" viewBox="0 0 16 10"><path d="M1 5h14M9 1l6 4-6 4" stroke="var(--primary,#6366f1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.82rem" }}>{ride.destination}</span>
                        </div>
                        <span style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, textTransform: "capitalize" }}>
                          {ride.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: ride.passengers?.length ? "12px" : 0 }}>
                        {ride.fare && <span>₹{ride.fare}/seat</span>}
                        {ride.date  && <span>📅 {ride.date}</span>}
                        {ride.time  && <span>⏰ {ride.time}</span>}
                        <span>{ride.passengers?.length || 0} passenger{ride.passengers?.length !== 1 ? "s" : ""}</span>
                      </div>
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
                                  </div>
                                  <StarRating
                                    rating={b.passengerId?.averageRating || 0}
                                    total={b.passengerId?.totalRatings || 0}
                                    newLabel="New passenger"
                                  />
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
      </div>

      {/* OTP Modal */}
      {otpModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(6px)" }}>
          <div className="glass-card" style={{ padding: "2.5rem 2rem", width: "100%", maxWidth: "400px", borderRadius: "20px", textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary,#6366f1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2 style={{ fontWeight: 700, color: "var(--text)", marginBottom: "0.4rem", fontSize: "0.95rem" }}>Verify Passenger OTP</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Ask the passenger to show their 4-digit code</p>
            <div className="flex gap-2 md:gap-3 justify-center mb-4">
              {[0,1,2,3].map(i => (
                <input key={i} id={`otp-box-${i}`} maxLength={1}
                  value={otpModal.value[i] || ""}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, "");
                    const arr = (otpModal.value + "    ").split("").slice(0, 4);
                    arr[i] = val;
                    setOtpModal(m => ({ ...m, value: arr.join("").trimEnd() }));
                    if (val && i < 3) document.getElementById(`otp-box-${i + 1}`)?.focus();
                  }}
                  onKeyDown={e => { if (e.key === "Backspace" && !otpModal.value[i] && i > 0) document.getElementById(`otp-box-${i - 1}`)?.focus(); }}
                  autoFocus={i === 0}
                  className="w-10 h-12 text-center text-xl font-bold rounded-xl outline-none transition-colors"
                  style={{ border: `2px solid ${otpModal.value[i] ? "var(--primary)" : "rgba(99,102,241,0.25)"}`, background: "var(--input-bg)", color: "var(--text)" }}
                />
              ))}
            </div>
            {otpError && <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "1rem" }}>{otpError}</p>}
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setOtpModal({ open: false, bookingId: null, value: "" })}
                style={{ flex: 1, padding: "13px", borderRadius: "10px", border: "1px solid rgba(99,102,241,0.2)", background: "transparent", color: "var(--text)", fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={verifyOtp} disabled={otpModal.value.replace(/\s/g, "").length < 4}
                style={{ flex: 1, padding: "13px", borderRadius: "10px", border: "none", fontWeight: 700, cursor: otpModal.value.replace(/\s/g, "").length === 4 ? "pointer" : "not-allowed", background: otpModal.value.replace(/\s/g, "").length === 4 ? "var(--primary)" : "var(--input-bg)", color: otpModal.value.replace(/\s/g, "").length === 4 ? "white" : "var(--text-muted)" }}>
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Passenger cancelled popup */}
      {cancelledPassenger && (
        <PassengerCancelledModal
          passengerName={cancelledPassenger.name}
          onClose={() => setCancelledPassenger(null)}
        />
      )}

      {/* Rating modal */}
      {ratingModal && (
        <RatingModal
          rideId={ratingModal.rideId}
          ratedUserId={ratingModal.ratedUserId}
          ratedUserName={ratingModal.ratedUserName}
          role="passenger"
          onClose={() => { setRatingModal(null); navigate("/driver-details"); }}
          onSubmitted={() => { setRatingModal(null); navigate("/driver-details"); }}
        />
      )}

      {/* Chat panel */}
      {showChat && chatTarget?.bookingId && (
        <RideChat
          bookingId={chatTarget.bookingId}
          myRole="driver"
          myName={driverName}
          onClose={() => { setShowChat(false); setChatTarget(null); }}
          onUnreadChange={handleUnreadChange}
        />
      )}
    </div>
  );
};

export default DriverDashboard;