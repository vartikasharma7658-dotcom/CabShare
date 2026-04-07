// server.js
const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");
const dotenv     = require("dotenv");
const jwt        = require("jsonwebtoken");          // ← was missing!
const connectDB  = require("./config/db");

dotenv.config();
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
connectDB();

const app    = express();
const server = http.createServer(app);

// ── CORS ──────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json());

// ── Socket.IO ─────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("[Socket.IO] Auth received:", socket.handshake.auth);
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  const token = socket.handshake.auth?.token;
  let userId;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id || decoded._id;
    console.log("[Socket.IO] Decoded:", decoded);
  } catch (err) {
    console.log("[Socket.IO] JWT error:", err.message);
    socket.disconnect();
    return;
  }

  socket.on("join-ride", ({ rideId, role }) => {
    socket.join(rideId);
    console.log(`[Socket.IO] ${userId} (${role}) joined ride room: ${rideId}`);
  });

  socket.on("driver-location", ({ rideId, lat, lng }) => {
    socket.to(rideId).emit("location-update", { lat, lng });
  });

  socket.on("join-chat", ({ bookingId }) => {
    socket.join(bookingId);
    console.log(`[Socket.IO] ${userId} joined chat room: ${bookingId}`);
  });

  socket.on("send-message", (data) => {
    socket.to(data.bookingId).emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.IO] ${userId} disconnected`);
  });
});

// ── REST routes ───────────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/users",    require("./routes/userRoutes"));
app.use("/api/rides",    require("./routes/rideRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/ratings",  require("./routes/ratingRoutes"));
app.use("/api",          require("./routes/routeProxy"));

app.get("/", (req, res) => res.send("CabShare Backend Running"));

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));