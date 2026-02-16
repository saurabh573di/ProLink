/*
  index.js - Main Server Entry Point
  =================================================================================
  RESPONSIBILITIES:
  - Initialize Express server and HTTP server with Socket.IO
  - Configure middleware (helmet, compression, CORS, cookie parser, JSON)
  - Setup all API routes (auth, user, post, connection, notification)
  - Initialize Socket.IO for real-time events (connections, disconnections, status updates)
  - Manage userSocketMap to track active users and their socket IDs
  
  KEY FEATURES:
  - Security: helmet() for HTTP headers, CORS with origin whitelist
  - Performance: compression middleware for response gzip, trust proxy for production
  - Real-time: Socket.IO with fallback CORS configuration
  - Database: Connects to MongoDB on startup
  
  IMPORTANT:
  - userSocketMap is exported for use in controllers to send real-time notifications
  - Socket events: "register" stores userId->socketId; "disconnect" cleans up
  - Server listens on process.env.PORT or defaults to 5000
=================================================================================
*/
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import http from "http";
import { Server } from "socket.io";
import notificationRouter from "./routes/notification.routes.js";
import compression from "compression";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

// ================== APP & SERVER ==================
const app = express();
const server = http.createServer(app);

// Trust proxy for production (Render uses proxies)
app.set("trust proxy", 1);

const allowedOrigin = process.env.VITE_FRONTEND_URL || "http://localhost:5173";

// ================== SOCKET.IO ==================
export const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
  },
});

// ================== MIDDLEWARE ==================
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// ================== ROUTES (API v1) ==================
// Versioning allows for backward compatibility if API changes
// Future versions can run alongside v1: /api/v2/auth, etc.
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/connection", connectionRouter);
app.use("/api/v1/notification", notificationRouter);

// ================== FALLBACK FOR UNVERSIONED ROUTES ==================
// Redirect old format to new versioned format for backward compatibility
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notification", notificationRouter);

// ================== ERROR HANDLER MIDDLEWARE ==================
// IMPORTANT: Must be placed AFTER all routes and BEFORE app.listen
// This middleware catches all errors passed via next(error) in try-catch blocks
app.use(errorHandler);

// ================== SOCKET.IO EVENTS ==================

// Store userId -> socketId
export const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log("User Registered:", userSocketMap);
  });

  socket.on("disconnect", () => {
    for (let [key, value] of userSocketMap.entries()) {
      if (value === socket.id) {
        userSocketMap.delete(key);
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// ================== SERVER START ==================
const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
