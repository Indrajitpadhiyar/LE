import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { config } from "../config/config.js";
import { ApiError } from "../error/ApiError.js";

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

/**
 * Format user response (strip sensitive fields)
 */
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      throw new ApiError("Please provide name, email and password", 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError("An account with this email already exists", 400);
    }

    // Create user (role defaults to "user")
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      throw new ApiError("Please provide email and password", 400);
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError("Invalid email or password", 401);
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError("Invalid email or password", 401);
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login admin
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      throw new ApiError("Please provide email and password", 400);
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError("Invalid admin credentials", 401);
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError("Invalid admin credentials", 401);
    }

    // Verify admin role
    if (user.role !== "admin") {
      throw new ApiError("Access denied — not an admin account", 403);
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private (requires token)
 */
export const getMe = async (req, res, _next) => {
  res.status(200).json({
    success: true,
    user: formatUserResponse(req.user),
  });
};
