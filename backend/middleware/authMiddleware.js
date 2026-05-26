import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { config } from "../config/config.js";
import { ApiError } from "../error/ApiError.js";

/**
 * Protect routes — verifies JWT and attaches user to request
 */
export const protect = async (req, _res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError("Not authorized — no token provided", 401);
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError("User belonging to this token no longer exists", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError("Not authorized — token verification failed", 401));
    }
  }
};

/**
 * Restrict access to admin users only
 * Must be used AFTER protect middleware
 */
export const adminOnly = (req, _res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new ApiError("Access denied — admin privileges required", 403));
  }
};
