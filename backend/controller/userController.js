import User from "../model/User.js";
import Product from "../model/Product.js";
import { ApiError } from "../error/ApiError.js";

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find().select("-cart -likedProducts").skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user cart (populated with product details)
 * @route   GET /api/users/cart
 * @access  Private
 */
export const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    res.status(200).json({
      success: true,
      cart: user.cart.filter((item) => item.product), // filter out deleted products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/users/cart
 * @access  Private
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      throw new ApiError("Product ID is required", 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    if (product.stock < quantity) {
      throw new ApiError("Insufficient stock", 400);
    }

    const user = await User.findById(req.user._id);

    // Check if product already in cart
    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    // Return populated cart
    const updatedUser = await User.findById(req.user._id).populate("cart.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedUser.cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/users/cart/:productId
 * @access  Private
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      throw new ApiError("Quantity must be at least 1", 400);
    }

    const user = await User.findById(req.user._id);

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw new ApiError("Item not found in cart", 404);
    }

    user.cart[itemIndex].quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate("cart.product");

    res.status(200).json({
      success: true,
      cart: updatedUser.cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/users/cart/:productId
 * @access  Private
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate("cart.product");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: updatedUser.cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/users/cart
 * @access  Private
 */
export const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart: [] });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get liked products
 * @route   GET /api/users/likes
 * @access  Private
 */
export const getLikedProducts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("likedProducts");

    res.status(200).json({
      success: true,
      likedProducts: user.likedProducts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle like/unlike a product
 * @route   POST /api/users/likes/:productId
 * @access  Private
 */
export const toggleLike = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    const user = await User.findById(req.user._id);
    const likedIndex = user.likedProducts.indexOf(productId);

    let action;
    if (likedIndex > -1) {
      user.likedProducts.splice(likedIndex, 1);
      action = "unliked";
    } else {
      user.likedProducts.push(productId);
      action = "liked";
    }

    await user.save();

    res.status(200).json({
      success: true,
      action,
      likedProducts: user.likedProducts,
    });
  } catch (error) {
    next(error);
  }
};
