import { useState } from "react";
import API from "../utils/api";

const Stars = ({ value, onChange, onHover }) => {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "0.75rem 0" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          onClick={() => onChange && onChange(s)}
          onMouseEnter={() => { setHovered(s); onHover?.(s); }}
          onMouseLeave={() => { setHovered(0); onHover?.(0); }}
          style={{
            fontSize: "2.5rem",
            cursor: onChange ? "pointer" : "default",
            color: s <= display ? "#f59e0b" : "#d1d5db",
            transition: "color 0.12s, transform 0.12s",
            display: "inline-block",
            transform: s <= display ? "scale(1.2)" : "scale(1)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >★</span>
      ))}
    </div>
  );
};

const RatingModal = ({ rideId, ratedUserId, ratedUserName, role, onClose, onSubmitted }) => {
  const [rating,  setRating]  = useState(0);
  const [review,  setReview]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [hovered, setHovered] = useState(0);

  const displayRating = hovered || rating;
  const ratingLabel = ["", "Poor", "Fair", "Good", "Great", "Excellent"][displayRating] || "";

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please pick a star rating"); return; }
    setLoading(true);
    try {
      await API.post("/ratings/submit", { rideId, ratedUserId, rating, review });

      // ── Refresh current user's own rating in sessionStorage ──────────
      // So Profile page shows updated stats without a hard reload
      try {
        const meRes = await API.get("/users/me");
        const freshUser = meRes.data.user || meRes.data;
        if (freshUser) {
          sessionStorage.setItem("user", JSON.stringify(freshUser));
        }
      } catch (_) {
        // non-critical — profile will refresh on next load
      }
      // ─────────────────────────────────────────────────────────────────

      onSubmitted?.();
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to submit rating");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000, backdropFilter: "blur(8px)", padding: "24px",
    }}>
      <div style={{
        padding: "2.5rem 2rem",
        width: "100%", maxWidth: "400px",
        borderRadius: "20px", textAlign: "center",
        boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        border: "1px solid rgba(200,168,75,0.3)",
        position: "relative",
        background: "#ffffff",
      }}>
        {/* Gold top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "4px",
          background: "linear-gradient(90deg, transparent, #c8a84b, #e8c96b, #c8a84b, transparent)",
          borderRadius: "20px 20px 0 0",
        }} />

        {/* Icon */}
        <div style={{
          width: "60px", height: "60px", borderRadius: "50%",
          background: "rgba(200,168,75,0.1)", border: "2px solid rgba(200,168,75,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.1rem", fontSize: "1.8rem",
        }}>
          {role === "driver" ? "🚗" : "👤"}
        </div>

        {/* Badge */}
        <div style={{
          display: "inline-flex", padding: "4px 14px", borderRadius: "100px",
          background: "rgba(200,168,75,0.1)", border: "1px solid rgba(200,168,75,0.35)",
          color: "#b5872a", fontSize: "0.68rem", letterSpacing: "0.12em",
          textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem",
        }}>
          Ride Completed
        </div>

        {/* Title */}
        <h2 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1.25rem", marginBottom: "0.3rem" }}>
          Rate your {role}
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "0.15rem" }}>
          How was your experience with
        </p>
        <p style={{ color: "#111827", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>
          {ratedUserName}?
        </p>

        {/* Stars */}
        <Stars value={rating} onChange={setRating} onHover={setHovered} />

        {/* Rating label */}
        <div style={{
          height: "20px", marginBottom: "0.75rem",
          fontSize: "0.85rem", fontWeight: 600,
          color: displayRating >= 4 ? "#16a34a" : displayRating >= 3 ? "#d97706" : displayRating > 0 ? "#ef4444" : "transparent",
          transition: "color 0.2s",
        }}>
          {ratingLabel}
        </div>

        {/* Review textarea */}
        <textarea
          placeholder="Leave a review (optional)"
          value={review}
          onChange={e => setReview(e.target.value)}
          rows={3}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: "10px",
            border: "1.5px solid #e5e7eb",
            background: "#f9fafb",
            color: "#111827",
            fontFamily: "inherit",
            fontSize: "0.875rem", resize: "none", outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "#6366f1"}
          onBlur={e  => e.target.style.borderColor = "#e5e7eb"}
        />

        {error && (
          <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "8px", marginBottom: "0" }}>
            {error}
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "1.25rem" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: "10px",
            border: "1.5px solid #e5e7eb", background: "#f9fafb",
            color: "#374151", fontWeight: 600, cursor: "pointer",
            fontSize: "0.9rem", transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
            onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            style={{
              flex: 2, padding: "12px", borderRadius: "10px", border: "none",
              background: rating === 0 || loading ? "#c7d2fe" : "#6366f1",
              color: "white", fontWeight: 700,
              cursor: rating === 0 || loading ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              boxShadow: rating > 0 && !loading ? "0 4px 16px rgba(99,102,241,0.35)" : "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (rating > 0 && !loading) e.currentTarget.style.background = "#4f46e5"; }}
            onMouseLeave={e => { if (rating > 0 && !loading) e.currentTarget.style.background = "#6366f1"; }}
          >
            {loading ? "Submitting…" : rating > 0 ? `Rate  ${"★".repeat(rating)}` : "Rate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;