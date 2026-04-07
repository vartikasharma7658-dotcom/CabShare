import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import RouteMap from "../components/RouteMap";
import EmergencyModal from "../components/EmergencyModal";
import RideChat from "../components/RideChat";
import RatingModal from "../components/RatingModal";

const Dots = () => {
  const [d, setD] = useState("");
  useEffect(() => {
    const t = setInterval(() => setD(v => (v.length < 3 ? v + "." : "")), 600);
    return () => clearInterval(t);
  }, []);
  return <span>{d}</span>;
};

const Wrap = ({ children }) => (
  <div style={{ minHeight: "100vh", background: "var(--bg-void)", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
    {children}
  </div>
);

const cardStyle = { padding: "2rem 1.2rem", textAlign: "center", maxWidth: "480px", width: "100%", position: "relative" };
const topBar = <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent)", borderRadius: "4px 4px 0 0" }} />;

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const ChatIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ── Star rating — always shows 5 stars, grayed when no rating ────────────
const StarRating = ({ rating, total }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "3px" }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ color: s <= Math.round(rating) ? "#f59e0b" : "rgba(150,150,150,0.4)", fontSize: "0.75rem" }}>★</span>
    ))}
    {rating > 0 ? (
      <>
        <span style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.78rem", marginLeft: "4px" }}>{rating.toFixed(1)}</span>
    
      </>
    ) : (
      <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginLeft: "4px" }}>No ratings yet</span>
    )}
  </div>
);

const MessageButton = ({ onClick, unread = 0, label = "Message", style = {} }) => (
  <button onClick={onClick} style={{
    position: "relative", padding: "8px 16px", borderRadius: "8px",
    background: unread > 0 ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.1)",
    border: `1px solid ${unread > 0 ? "rgba(99,102,241,0.45)" : "rgba(99,102,241,0.22)"}`,
    color: "var(--primary, #6366f1)", fontWeight: 600, fontSize: "0.82rem",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
    transition: "all 0.2s", ...style,
  }}>
    <ChatIcon /> {label}
    {unread > 0 && (
      <span style={{
        position: "absolute", top: "-7px", right: "-7px",
        minWidth: "18px", height: "18px", borderRadius: "100px",
        background: "#ef4444", color: "white", fontSize: "0.65rem", fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 4px", lineHeight: 1, boxShadow: "0 2px 8px rgba(239,68,68,0.5)",
        animation: "pulseDot 1.5s ease-in-out infinite",
      }}>
        {unread > 9 ? "9+" : unread}
      </span>
    )}
  </button>
);

// ← FIXED: prop renamed to profilePicture to match User model field name
const DriverAvatar = ({ profilePicture, name, size = 44 }) => {
  const initials = name ? name.trim()[0].toUpperCase() : "D";
  if (profilePicture) {
    return (
      <img src={profilePicture} alt={name || "Driver"}
        style={{ width: size, height: size, borderRadius: "12px", objectFit: "cover", border: "1px solid rgba(99,102,241,0.25)" }}
        onError={e => { e.target.style.display = "none"; }}
      />
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "12px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary, #6366f1)", fontWeight: 700, fontSize: size * 0.4 }}>
      {initials}
    </div>
  );
};

const DriverInfoCard = ({ ride, onChat, unread }) => {
  if (!ride) return null;
  const driver     = ride.driverId || {};
  const driverName = driver.name  || "Your Driver";
  const driverPhone = driver.phone || null;
  // ← FIXED: was driver.profilePic — model field is profilePicture
  const profilePicture = driver.profilePicture || null;

  return (
    <div className="glass-card" style={{ padding: "0.9rem 1rem" }}>
      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Your Driver</div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <DriverAvatar profilePicture={profilePicture} name={driverName} size={48} />
          <div>
            <div style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.85rem" }}>{driverName}</div>
            <StarRating rating={driver.averageRating || 0} total={driver.totalRatings || 0} />
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
              {[ride.vehicleModel, ride.vehicleNumber, ride.vehicleColor].filter(Boolean).join("  ·  ")}
            </div>
            {driverPhone && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>📞 {driverPhone}</div>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <MessageButton onClick={onChat} unread={unread} />
          {driverPhone && (
            <a href={`tel:${driverPhone}`} style={{ padding: "8px 16px", borderRadius: "8px", background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.22)", color: "#16a34a", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
              <PhoneIcon /> Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const CancelConfirmModal = ({ onConfirm, onClose, cancelling }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, backdropFilter: "blur(6px)", padding: "24px" }}>
    <div className="glass-card" style={{ padding: "2rem", width: "100%", maxWidth: "360px", borderRadius: "20px", textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h2 style={{ fontWeight: 700, color: "var(--cream)", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Cancel Booking?</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
        The driver has already accepted your ride. Are you sure you want to cancel?
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onClose} disabled={cancelling}
          style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "var(--cream)", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem" }}>
          Keep Ride
        </button>
        <button onClick={onConfirm} disabled={cancelling}
          style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#ef4444", color: "white", fontWeight: 700, cursor: cancelling ? "not-allowed" : "pointer", fontSize: "0.88rem", opacity: cancelling ? 0.7 : 1 }}>
          {cancelling ? "Cancelling…" : "Yes, Cancel"}
        </button>
      </div>
    </div>
  </div>
);

const RideTracking = () => {
  const [booking,         setBooking]         = useState(null);
  const [ride,            setRide]            = useState(null);
  const [showEmergency,   setShowEmergency]   = useState(false);
  const [showChat,        setShowChat]        = useState(false);
  const [passengerName,   setPassengerName]   = useState("Passenger");
  const [rideCompleted,   setRideCompleted]   = useState(false);
  const [unread,          setUnread]          = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling,      setCancelling]      = useState(false);
  const [ratingModal,     setRatingModal]     = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const u = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (u.name) setPassengerName(u.name);
    } catch (_) {}
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await API.get("/bookings");
      if (!res.data.length) return;
      const latest = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      if (!latest) return;
      if (latest.status === "completed") {
        setRideCompleted(true);
        const rideData = latest.rideId;
        if (rideData) {
          const driver = rideData.driverId;
          if (driver?._id) {
            setRatingModal(prev => prev ? prev : {
              rideId: rideData._id,
              ratedUserId: driver._id,
              ratedUserName: driver.name || "Your Driver",
            });
          }
        }
        return;
      }
      if (latest.status === "cancelled") { sessionStorage.setItem("ride_cancelled", "1"); navigate("/passenger-dashboard"); return; }
      const rideData = latest.rideId;
      if (!rideData) { sessionStorage.setItem("ride_cancelled", "1"); navigate("/passenger-dashboard"); return; }
      setRide(rideData);
      setBooking(latest);
    } catch (err) { console.error("fetchData error:", err); }
  }, [navigate]);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 4000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const cancelBooking = async () => {
    if (!booking?._id) return;
    try {
      await API.put(`/bookings/cancel/${booking._id}`);
      navigate("/passenger-dashboard");
    } catch (err) { alert(err.response?.data?.message || "Cancel failed"); }
  };

  const cancelAcceptedBooking = async () => {
    if (!booking?._id) return;
    setCancelling(true);
    try {
      await API.put(`/bookings/cancel/${booking._id}`);
      navigate("/passenger-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  const openChat = () => { setShowChat(true); setUnread(0); };
  const bookingIdStr = booking?._id?.toString?.() || booking?._id || null;

  // ── Ride completed ────────────────────────────────────────────────────────
  if (rideCompleted) return (
    <Wrap>
      {ratingModal && (
        <RatingModal
          rideId={ratingModal.rideId}
          ratedUserId={ratingModal.ratedUserId}
          ratedUserName={ratingModal.ratedUserName}
          role="driver"
          onClose={() => { setRatingModal(null); navigate("/passenger-dashboard"); }}
          onSubmitted={() => { setRatingModal(null); navigate("/passenger-dashboard"); }}
        />
      )}
      <div className="glass-card fade-up" style={cardStyle}>
        {topBar}
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", color: "var(--green-acc, #16a34a)" }}>Ride Completed!</h2>
        <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: "1.8rem" }}>
          {ratingModal ? "Please rate your driver before leaving." : "Thank you for riding with CabShare."}
        </p>
        {!ratingModal && (
          <button onClick={() => navigate("/passenger-dashboard")} style={{ padding: "12px 30px", borderRadius: "10px", background: "var(--primary, #6366f1)", color: "white", fontWeight: 700, border: "none", cursor: "pointer" }}>
            Back to Dashboard
          </button>
        )}
      </div>
    </Wrap>
  );

  // ── Pending ───────────────────────────────────────────────────────────────
  if (!booking || booking.status === "pending") return (
    <Wrap>
      <div className="glass-card fade-up" style={cardStyle}>
        {topBar}
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(200,168,75,0.07)", border: "1px solid rgba(200,168,75,0.18)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", animation: "otpPulse 2.5s ease-in-out infinite" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold, #c8a84b)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--cream)", marginBottom: "0.75rem" }}>Waiting for driver<Dots /></h2>
        <p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.9rem", lineHeight: 1.6 }}>Your booking is live. A driver will review and accept shortly.</p>
        <button onClick={cancelBooking} style={{ marginTop: "1.5rem", padding: "10px 26px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>Cancel Booking</button>
      </div>
    </Wrap>
  );

  // ── Accepted + OTP not yet verified ──────────────────────────────────────
  if (booking.status === "accepted" && !booking.otpVerified) {
    const otp = booking.otp || "----";
    return (
      <Wrap>
        <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <DriverInfoCard ride={ride} onChat={openChat} unread={unread} />
          <div className="glass-card fade-up" style={cardStyle}>
            {topBar}
            <div style={{ display: "inline-flex", padding: "5px 14px", borderRadius: "100px", marginBottom: "1.25rem", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", color: "var(--green-acc)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Driver Accepted</div>
            <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--cream)", marginBottom: "0.5rem" }}>Your OTP</h2>
            <p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.88rem", marginBottom: "1.75rem" }}>Show this to your driver to verify your identity</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
              {otp.split("").map((digit, i) => (
                <div key={i} style={{ width: "44px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 700, borderRadius: "10px", color: "var(--primary)", background: "rgba(99,102,241,0.08)", border: "2px solid rgba(99,102,241,0.28)" }}>{digit}</div>
              ))}
            </div>
            <div style={{ padding: "11px 16px", borderRadius: "8px", background: "rgba(200,168,75,0.05)", border: "1px solid rgba(200,168,75,0.15)", color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
              Waiting for driver to enter and verify your OTP
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontStyle: "italic" }}>Driver not showing up?</p>
              <button onClick={() => setShowCancelModal(true)}
                style={{ padding: "8px 22px", background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
        {showCancelModal && <CancelConfirmModal onConfirm={cancelAcceptedBooking} onClose={() => setShowCancelModal(false)} cancelling={cancelling} />}
        {showChat && bookingIdStr && <RideChat bookingId={bookingIdStr} myRole="passenger" myName={passengerName} onClose={() => setShowChat(false)} onUnreadChange={setUnread} />}
      </Wrap>
    );
  }

  // ── Accepted + OTP verified ───────────────────────────────────────────────
  if (booking.status === "accepted" && booking.otpVerified) return (
    <Wrap>
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <DriverInfoCard ride={ride} onChat={openChat} unread={unread} />
        <div className="glass-card fade-up" style={cardStyle}>
          {topBar}
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--cream)", marginBottom: "0.5rem" }}>Identity Verified</h2>
          <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Waiting for driver to start the ride<Dots /></p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--green-acc)", fontSize: "0.78rem", letterSpacing: "0.06em", marginTop: "1rem" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--green-acc)", animation: "pulseDot 1.5s ease-in-out infinite" }} />OTP Confirmed
          </div>
        </div>
      </div>
      {showChat && bookingIdStr && <RideChat bookingId={bookingIdStr} myRole="passenger" myName={passengerName} onClose={() => setShowChat(false)} onUnreadChange={setUnread} />}
    </Wrap>
  );

  // ── Started — live ride tracking ──────────────────────────────────────────
  if (booking.status === "started") {
    const driver         = ride?.driverId || {};
    const driverName     = driver.name  || "Your Driver";
    const driverPhone    = driver.phone || null;
    // ← FIXED: was driver.profilePic — model field is profilePicture
    const profilePicture = driver.profilePicture || null;

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-void)", padding: "12px" }}>
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 500 }}>
          <button onClick={() => setShowEmergency(true)} className="flex items-center gap-2" style={{ padding: "11px 18px", borderRadius: "10px", background: "linear-gradient(135deg, #dc2626, #991b1b)", border: "none", cursor: "pointer", color: "white", fontWeight: 600, fontSize: "0.82rem", boxShadow: "0 4px 20px rgba(220,38,38,0.45)" }}>
            <ShieldIcon /> Emergency
          </button>
        </div>
        <div className="max-w-[900px] mx-auto flex flex-col gap-3 sm:gap-4">
          <div className="fade-up" style={{ paddingTop: "1rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 14px", borderRadius: "100px", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", marginBottom: "12px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#16a34a", animation: "pulseDot 1.5s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.72rem", color: "#16a34a", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Ride In Progress</span>
            </div>
            <h1 style={{ fontWeight: 700, fontSize: "clamp(1.1rem,3.5vw,1.6rem)", letterSpacing: "-0.02em", color: "var(--cream)" }}>Live Tracking</h1>
          </div>

          <div className="glass-card fade-up" style={{ padding: "1rem" }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <DriverAvatar profilePicture={profilePicture} name={driverName} size={48} />
                <div>
                  <div style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.95rem" }}>{driverName}</div>
                  <StarRating rating={driver.averageRating || 0} total={driver.totalRatings || 0} />
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {[ride?.vehicleModel, ride?.vehicleNumber, ride?.vehicleColor].filter(Boolean).join("  ·  ")}
                  </div>
                  {driverPhone && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>📞 {driverPhone}</div>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <MessageButton onClick={openChat} unread={unread} label="Message Driver" />
                {driverPhone && (
                  <a href={`tel:${driverPhone}`} style={{ padding: "8px 16px", borderRadius: "8px", background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.22)", color: "#16a34a", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                    <PhoneIcon /> Call Driver
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card fade-up" style={{ padding: "1.25rem 1.8rem" }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4" style={{ flexWrap: "wrap" }}>
              <div>
                <div style={{ fontStyle: "italic", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>From</div>
                <div style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.85rem" }}>{ride?.source || "—"}</div>
              </div>
              <div style={{ flex: 1, minWidth: "60px", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ flex: 1, height: "2px", background: "linear-gradient(90deg, var(--gold), var(--green-acc))" }} />
                <svg width="18" height="10" fill="none" viewBox="0 0 18 10"><path d="M1 5h16M11 1l6 4-6 4" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div style={{ flex: 1, height: "2px", background: "linear-gradient(90deg, var(--green-acc), rgba(200,168,75,0.3))" }} />
              </div>
              <div>
                <div style={{ fontStyle: "italic", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>To</div>
                <div style={{ fontWeight: 700, color: "var(--cream)", fontSize: "0.85rem" }}>{ride?.destination || "—"}</div>
              </div>
            </div>
          </div>

          <div className="glass-card fade-up" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <span className="chip"><span className="chip-dot" />Route Map</span>
            </div>
            {ride ? (
              <RouteMap sourceCoords={ride.sourceCoords} destCoords={ride.destCoords} sourceName={ride.source} destName={ride.destination} height="400px" />
            ) : (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>Loading map…</p>
            )}
          </div>
        </div>
        {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} rideInfo={ride} />}
        {showChat && bookingIdStr && <RideChat bookingId={bookingIdStr} myRole="passenger" myName={passengerName} onClose={() => setShowChat(false)} onUnreadChange={setUnread} />}
      </div>
    );
  }

  return null;
};

export default RideTracking;