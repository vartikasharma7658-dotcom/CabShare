// src/components/EmergencyModal.jsx
import { useState, useRef } from "react";

const CONTACTS = [
  { name: "National Emergency",      number: "112",   desc: "Police · Fire · Ambulance — All services",  color: "#dc2626", priority: true },
  { name: "Police Control Room",     number: "100",   desc: "Law enforcement & security",               color: "#1d4ed8" },
  { name: "Ambulance Services",      number: "108",   desc: "Medical emergencies",                       color: "#15803d" },
  { name: "Women Safety Helpline",   number: "1091",  desc: "24×7 women safety & support",              color: "#7c3aed" },
  { name: "Women (Domestic)",        number: "181",   desc: "Domestic violence support",                 color: "#be185d" },
  { name: "Child Helpline",          number: "1098",  desc: "Emergency help for children",               color: "#b45309" },
  { name: "Road Accident Helpline",  number: "1073",  desc: "National highway accidents",               color: "#c2410c" },
  { name: "Tourist Helpline",        number: "1363",  desc: "24×7 tourist safety assistance",           color: "#0e7490" },
  { name: "Cyber Crime Helpline",    number: "1930",  desc: "Online fraud & cybercrime",                 color: "#4338ca" },
  { name: "Senior Citizen Helpline", number: "14567", desc: "Eldercare & senior welfare",               color: "#4d7c0f" },
];

// ── Icons ─────────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PhoneIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const ShieldIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const CarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8l5 3v5h-5V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const EmergencyModal = ({ onClose, rideInfo }) => {
  const [calledNumber, setCalledNumber] = useState(null);
  const [sosCountdown, setSosCountdown] = useState(null);
  const timerRef = useRef(null);

  const callNumber = (number) => {
    setCalledNumber(number);
    window.location.href = `tel:${number}`;
  };

  const startSOS = () => {
    let count = 3;
    setSosCountdown(count);
    timerRef.current = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(timerRef.current);
        setSosCountdown(null);
        window.location.href = "tel:112";
      } else {
        setSosCountdown(count);
      }
    }, 1000);
  };

  const cancelSOS = () => {
    clearInterval(timerRef.current);
    setSosCountdown(null);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(2,4,10,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{
        width: "100%", maxWidth: "460px",
        borderRadius: "16px",
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        display: "flex", flexDirection: "column",
        maxHeight: "92vh",
        overflow: "hidden",
      }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{
          padding: "1.1rem 1.4rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#0d0d14",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "8px",
              background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#f87171",
            }}>
              <ShieldIcon size={17} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "white", fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
                Emergency Assistance
              </div>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>
                India helpline numbers
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
            <CloseIcon />
          </button>
        </div>

        {/* ── Ride context ─────────────────────────────────────────────── */}
        {rideInfo && (rideInfo.source || rideInfo.destination || rideInfo.vehicleNumber) && (
          <div style={{
            padding: "9px 1.4rem",
            background: "rgba(220,38,38,0.05)",
            borderBottom: "1px solid rgba(220,38,38,0.1)",
            display: "flex", gap: "18px", flexWrap: "wrap",
            flexShrink: 0,
          }}>
            {rideInfo.source && (
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>
                From <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{rideInfo.source}</strong>
              </span>
            )}
            {rideInfo.destination && (
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>
                To <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{rideInfo.destination}</strong>
              </span>
            )}
            {rideInfo.vehicleNumber && (
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "4px" }}>
                <CarIcon />
                <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{rideInfo.vehicleNumber}</strong>
              </span>
            )}
          </div>
        )}

        {/* ── Scrollable body ──────────────────────────────────────────── */}
        <div style={{ overflowY: "auto", flex: 1, padding: "1.1rem 1.4rem", display: "flex", flexDirection: "column", gap: "7px" }}>

          {/* SOS button */}
          {sosCountdown === null ? (
            <button
              onClick={startSOS}
              style={{
                width: "100%", padding: "14px 18px",
                borderRadius: "10px", marginBottom: "6px",
                background: "rgba(220,38,38,0.12)",
                border: "1px solid rgba(220,38,38,0.3)",
                color: "#fca5a5", fontWeight: 700, fontSize: "0.9rem",
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.2)"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,38,38,0.12)"; e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ShieldIcon size={16} />
                <span>Quick SOS — Call 112</span>
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "rgba(252,165,165,0.6)" }}>3-second delay</span>
            </button>
          ) : (
            <div style={{
              width: "100%", padding: "13px 16px", borderRadius: "10px", marginBottom: "6px",
              background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.4)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "50%",
                  border: "2px solid #dc2626",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "1.4rem", color: "#f87171",
                }}>
                  {sosCountdown}
                </div>
                <div>
                  <div style={{ color: "#fca5a5", fontWeight: 700, fontSize: "0.88rem" }}>Connecting to 112…</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem" }}>Tap cancel to abort</div>
                </div>
              </div>
              <button onClick={cancelSOS} style={{
                padding: "8px 14px", borderRadius: "7px",
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem",
              }}>
                Cancel
              </button>
            </div>
          )}

          {/* Section label */}
          <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.12em", padding: "2px 0 4px" }}>
            Emergency Contacts
          </div>

          {/* Contact rows */}
          {CONTACTS.map((c, i) => (
            <button
              key={i}
              onClick={() => callNumber(c.number)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 13px", borderRadius: "9px", cursor: "pointer",
                background: calledNumber === c.number ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
                border: `1px solid ${calledNumber === c.number ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.055)"}`,
                transition: "all 0.13s", textAlign: "left", width: "100%",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = calledNumber === c.number ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = calledNumber === c.number ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.055)"; }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.88)", fontWeight: 600, fontSize: "0.85rem" }}>{c.name}</div>
                <div style={{ color: "rgba(255,255,255,0.32)", fontSize: "0.7rem", marginTop: "1px" }}>{c.desc}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", flexShrink: 0, marginLeft: "12px" }}>
                <span style={{ color: c.color, fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.02em" }}>
                  {c.number}
                </span>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "7px",
                  background: c.color + "22",
                  border: `1px solid ${c.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: c.color,
                }}>
                  <PhoneIcon size={13} />
                </div>
              </div>
            </button>
          ))}

        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;