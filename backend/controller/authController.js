import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { config } from "../config/config.js";
import { ApiError } from "../error/ApiError.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

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


const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  photo: user.photo,
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

/**
 * @desc    Login/Register via Google OAuth
 * @route   POST /api/auth/google-login
 * @access  Public
 */
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      throw new ApiError("Please provide Google ID Token", 400);
    }

    // Verify Google ID Token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: config.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      throw new ApiError("Invalid or expired Google Token", 401);
    }

    const payload = ticket.getPayload();
    if (!payload) {
      throw new ApiError("Failed to retrieve Google profile data", 400);
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      throw new ApiError("Google account must have an associated email address", 400);
    }

    // Find existing user by googleId or by email
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      let isModified = false;
      // If user exists but googleId isn't linked, link it
      if (!user.googleId) {
        user.googleId = googleId;
        isModified = true;
      }
      // Set Google User flag
      if (!user.isGoogleUser) {
        user.isGoogleUser = true;
        isModified = true;
      }
      // If user photo is default and Google picture is available, update it
      if (picture && (!user.photo || user.photo === "default.jpg")) {
        user.photo = picture;
        isModified = true;
      }
      
      if (isModified) {
        await user.save();
      }
    } else {
      // Create a new user with Google details and secure random password
      const randomPassword = crypto.randomBytes(32).toString("hex");
      user = await User.create({
        name: name || "Google User",
        email,
        password: randomPassword,
        googleId,
        isGoogleUser: true,
        photo: picture || "default.jpg",
      });
    }

    // Generate JWT token for App Authentication
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
