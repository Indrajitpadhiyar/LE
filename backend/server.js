import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./db/db.js";
import { config } from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./error/ApiError.js";

const app = express();
const PORT = config.PORT;

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

// Prevent NoSQL injection
app.use(mongoSanitize());

// ═══════════════════════════════════════════════
//  CORE MIDDLEWARE
// ═══════════════════════════════════════════════
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Connect to MongoDB
connectDB();

// ═══════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
