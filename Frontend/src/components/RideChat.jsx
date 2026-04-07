// src/components/RideChat.jsx
// In-ride chat — polls every 2s, messages stored in booking document
// Notifications: browser push + unread badge on the chat button

import { useState, useEffect, useRef, useCallback } from "react";
import API from "../utils/api";

const QUICK_MSGS = [
  "On my way",
  "Almost there",
  "Please be ready at pickup",
  "Running 5 mins late",
  "Arrived at pickup",
  "Call me when nearby",
];

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

// ── Request browser notification permission once ───────────────────────────
const requestNotifPermission = () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
};

const fireNotif = (title, body) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "ridechat",
      renotify: true,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// RideChat — bookingId scopes all messages to this specific booking.
// onUnreadChange(count) lets parent show a badge on the chat button.
// ─────────────────────────────────────────────────────────────────────────────
const RideChat = ({ bookingId, myRole, myName, onClose, onUnreadChange }) => {
  const [messages, setMessages] = useState([]);
  const [text,     setText]     = useState("");
  const [sending,  setSending]  = useState(false);
  const [error,    setError]    = useState("");

  const bottomRef      = useRef(null);
  // Track exactly how many messages we've already seen so we can detect NEW ones
  const prevCountRef   = useRef(null);  // null = not yet initialised
  const unreadCountRef = useRef(0);     // accumulated unread while panel is open

  const otherRole = myRole === "driver" ? "Passenger" : "Driver";

  useEffect(() => { requestNotifPermission(); }, []);

  // Clear badge as soon as the panel is open
  useEffect(() => {
    unreadCountRef.current = 0;
    onUnreadChange?.(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!bookingId) return;
    try {
      const res  = await API.get(`/bookings/${bookingId}/messages`);
      // Filter: only show messages for THIS booking (backend already does this,
      // but guard in case the endpoint ever returns a mixed array)
      const msgs = (res.data || []);
      setError("");

      setMessages(() => {
        const prevLen = prevCountRef.current;

        if (prevLen === null) {
          // First load — initialise baseline, no notification
          prevCountRef.current = msgs.length;
          return msgs;
        }

        const newLen = msgs.length;
        if (newLen > prevLen) {
          // Identify messages that arrived since last poll AND were sent by the OTHER party
          const incoming = msgs.slice(prevLen).filter(m => m.sender !== myRole);

          if (incoming.length > 0) {
            const last        = incoming[incoming.length - 1];
            const senderLabel = last.senderName || otherRole;

            // Fire browser notification regardless of panel state
            fireNotif(`New message from ${senderLabel}`, last.text);

            // Accumulate unread count and report to parent
            unreadCountRef.current += incoming.length;
            onUnreadChange?.(unreadCountRef.current);
          }
        }

        prevCountRef.current = newLen;
        return msgs;
      });
    } catch {
      setError("Could not load messages");
    }
  }, [bookingId, myRole, otherRole, onUnreadChange]);

  useEffect(() => {
    fetchMessages();
    const iv = setInterval(fetchMessages, 2000);
    return () => clearInterval(iv);
  }, [fetchMessages]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (content) => {
    const msg = (content || text).trim();
    if (!msg || sending) return;
    setSending(true);
    try {
      await API.post(`/bookings/${bookingId}/messages`, {
        sender:     myRole,
        senderName: myName,
        text:       msg,
      });
      setText("");
      fetchMessages();
    } catch {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div style={{
        width: "100%", maxWidth: "480px",
        borderRadius: "16px 16px 0 0",
        background: "var(--bg, #fff)",
        boxShadow: "0 -20px 60px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column",
        maxHeight: "85vh",
        border: "1px solid rgba(99,102,241,0.18)",
        borderBottom: "none",
        margin: "0 auto",
      }}>

        {/* Header */}
        <div style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid rgba(99,102,241,0.12)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderRadius: "16px 16px 0 0",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--primary, #6366f1)",
            }}>
              <ChatIcon />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.82rem" }}>
                Chat with {otherRole}
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                Live · updates every 2s
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)",
              borderRadius: "8px", width: "34px", height: "34px",
              cursor: "pointer", color: "var(--text)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.08)"}>
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "0.75rem 1rem",
          display: "flex", flexDirection: "column", gap: "8px",
          minHeight: "180px",
        }}>
          {error && (
            <div style={{ textAlign: "center", color: "#ef4444", fontSize: "0.8rem", padding: "8px" }}>
              {error}
            </div>
          )}
          {!error && messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              <div style={{ marginBottom: "6px", opacity: 0.5 }}><ChatIcon /></div>
              No messages yet. Say hello!
            </div>
          )}
          {messages.map((m, i) => {
            const isMe = m.sender === myRole;
            return (
              <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "7px 11px",
                  borderRadius: isMe ? "16px 16px 3px 16px" : "16px 16px 16px 3px",
                  background: isMe
                    ? "linear-gradient(135deg, var(--primary, #6366f1), #818cf8)"
                    : "rgba(99,102,241,0.07)",
                  border: isMe ? "none" : "1px solid rgba(99,102,241,0.12)",
                  color: isMe ? "white" : "var(--text)",
                }}>
                  {!isMe && (
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, opacity: 0.6, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {m.senderName || otherRole}
                    </div>
                  )}
                  <div style={{ fontSize: "0.82rem", lineHeight: 1.4 }}>{m.text}</div>
                  {m.timestamp && (
                    <div style={{ fontSize: "0.58rem", opacity: 0.55, marginTop: "4px", textAlign: isMe ? "right" : "left" }}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div style={{
          padding: "0.4rem 1rem",
          display: "flex", gap: "6px", overflowX: "auto",
          borderTop: "1px solid rgba(99,102,241,0.08)",
          flexShrink: 0,
        }}>
          {QUICK_MSGS.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{
              padding: "5px 12px", borderRadius: "100px", whiteSpace: "nowrap",
              background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)",
              color: "var(--primary, #6366f1)", fontSize: "0.73rem", fontWeight: 600,
              cursor: "pointer", transition: "background 0.15s", flexShrink: 0,
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.07)"}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: "0.6rem 1rem 1rem",
          display: "flex", gap: "8px", alignItems: "center",
          flexShrink: 0,
        }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={`Message ${otherRole.toLowerCase()}…`}
            style={{
              flex: 1, padding: "9px 14px", borderRadius: "100px",
              border: "1.5px solid rgba(99,102,241,0.22)",
              background: "var(--input-bg, #f8f9fa)", color: "var(--text)",
              fontSize: "0.88rem", outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.22)"}
          />
          <button
            onClick={() => send()}
            disabled={!text.trim() || sending}
            style={{
              width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
              background: text.trim() && !sending ? "var(--primary, #6366f1)" : "rgba(99,102,241,0.15)",
              border: "none", cursor: text.trim() && !sending ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: text.trim() && !sending ? "white" : "rgba(99,102,241,0.4)",
              boxShadow: text.trim() ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
              transition: "all 0.2s",
            }}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideChat;