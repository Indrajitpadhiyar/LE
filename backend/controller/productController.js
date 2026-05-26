import Product from "../model/Product.js";
import { ApiError } from "../error/ApiError.js";

/**
 * @desc    Get all products (with optional filters)
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // newest first by default
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "name") sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, longDescription, price,
      category, image, stock, badge, rating, specs,
    } = req.body;

    if (!name || !description || price == null || !category) {
      throw new ApiError("Name, description, price, and category are required", 400);
    }

    const product = await Product.create({
      name,
      description,
      longDescription: longDescription || "",
      price,
      category,
      image: image || undefined,
      stock: stock || 0,
      badge: badge || "",
      rating: rating || 0,
      specs: specs || {},
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all categories
 * @route   GET /api/products/categories
 * @access  Public
 */
export const getCategories = async (_req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({ success: true, categories: ["All", ...categories] });
  } catch (error) {
    next(error);
  }
};
