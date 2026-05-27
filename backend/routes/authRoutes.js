import express from "express";
import {
  registerUser,
  loginUser,
  loginAdmin,
  getMe,
  googleLogin,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", loginAdmin);
router.post("/google-login", googleLogin);

// Protected routes
router.get("/me", protect, getMe);

export default router;
