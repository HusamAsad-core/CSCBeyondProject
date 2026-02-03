const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const path = require("path");

// Imports
const messageRoutes = require("./src/routes/messageRoutes");
const promisePool = require("./src/config/db");
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const planRoutes = require("./src/routes/planRoutes");
const errorHandler = require("./src/utils/errorHandler");
const categoryRoutes = require("./src/routes/categoryRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: true, // allow localhost during dev
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Error handler (must be last)
app.use(errorHandler);

// ==================
// Socket.IO
// ==================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// In-memory presence store (single server)
const presence = new Map(); // userId -> { sockets:Set<string>, online:boolean, last_seen:string|null }

function setOnline(userId, socketId) {
  const p = presence.get(userId) || { sockets: new Set(), online: false, last_seen: null };
  p.sockets.add(socketId);
  p.online = true;
  presence.set(userId, p);
}

function dropSocket(userId, socketId) {
  const p = presence.get(userId);
  if (!p) return;
  p.sockets.delete(socketId);
  if (p.sockets.size === 0) {
    p.online = false;
    p.last_seen = new Date().toISOString();
  }
  presence.set(userId, p);
}

function presencePayload(userId) {
  const p = presence.get(userId);
  return {
    user_id: Number(userId),
    online: Boolean(p?.online),
    last_seen: p?.last_seen || null,
  };
}

// JWT auth for sockets
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers.authorization || "").replace("Bearer ", "");

    if (!token) return next(new Error("Missing token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    socket.user = decoded; // must include id, role
    next();
  } catch (e) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const myId = Number(socket.user?.id || 0);
  if (!myId) return socket.disconnect(true);

  // mark online
  setOnline(myId, socket.id);
  socket.join(`user:${myId}`);
  io.emit("presence:update", presencePayload(myId));

  // rooms per conversation
  socket.on("join_conversation", (conversationId) => {
    socket.join(`conv:${Number(conversationId)}`);
  });

  socket.on("leave_conversation", (conversationId) => {
    socket.leave(`conv:${Number(conversationId)}`);
  });

  // typing
  socket.on("typing:start", ({ conversation_id }) => {
    const convId = Number(conversation_id);
    if (!convId) return;
    socket.to(`conv:${convId}`).emit("typing:update", {
      conversation_id: convId,
      user_id: myId,
      typing: true,
    });
  });

  socket.on("typing:stop", ({ conversation_id }) => {
    const convId = Number(conversation_id);
    if (!convId) return;
    socket.to(`conv:${convId}`).emit("typing:update", {
      conversation_id: convId,
      user_id: myId,
      typing: false,
    });
  });

  // read receipts (no DB changes)
  socket.on("message:read", async ({ conversation_id, last_read_message_id }) => {
    try {
      const convId = Number(conversation_id);
      const lastId = Number(last_read_message_id);
      if (!convId || !lastId) return;

      // security: ensure user belongs to this conversation
      const [convRows] = await promisePool.query(
        "SELECT id FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?) LIMIT 1",
        [convId, myId, myId]
      );
      if (!convRows.length) return;

      socket.to(`conv:${convId}`).emit("read:update", {
        conversation_id: convId,
        user_id: myId,
        last_read_message_id: lastId,
        read_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error("message:read error:", e.message);
    }
  });

  socket.on("disconnect", () => {
    dropSocket(myId, socket.id);
    io.emit("presence:update", presencePayload(myId));
  });
});

// allow controllers to emit
app.set("io", io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
