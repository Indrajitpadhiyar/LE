import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";
import { connectDB } from "./db/db.js";
import { config } from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./error/ApiError.js";

const app = express();
const PORT = config.PORT;

const sanitizeRequest = (req, _res, next) => {
  for (const key of ["body", "params", "query"]) {
    if (req[key]) {
      mongoSanitize.sanitize(req[key]);
    }
  }
  next();
};

const requireDatabase = (_req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: "Database is not connected. Please try again in a moment.",
  });
};

// ═══════════════════════════════════════════════
//  SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════

// Set secure HTTP headers
app.use(helmet());

// Rate limiting — max 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// Stricter rate limit for auth routes (prevent brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many login attempts, please try again later." },
});
app.use("/api/auth", authLimiter);

// ═══════════════════════════════════════════════
//  CORE MIDDLEWARE
// ═══════════════════════════════════════════════
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(sanitizeRequest);

// Connect to MongoDB
connectDB();

// ═══════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════
// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", requireDatabase, authRoutes);
app.use("/api/products", requireDatabase, productRoutes);
app.use("/api/users", requireDatabase, userRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
