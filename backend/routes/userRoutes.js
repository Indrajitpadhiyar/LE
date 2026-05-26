import express from "express";
import {
  getAllUsers,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getLikedProducts,
  toggleLike,
} from "../controller/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only
router.get("/", protect, adminOnly, getAllUsers);

// Cart routes (authenticated users)
router.get("/cart", protect, getCart);
router.post("/cart", protect, addToCart);
router.put("/cart/:productId", protect, updateCartItem);
router.delete("/cart/clear", protect, clearCart);
router.delete("/cart/:productId", protect, removeFromCart);

// Likes routes (authenticated users)
router.get("/likes", protect, getLikedProducts);
router.post("/likes/:productId", protect, toggleLike);

export default router;
