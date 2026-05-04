import Category from "../models/Category.js";

// ------------------------------------
// Add New Category
// POST /api/category/add
// ------------------------------------
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category already exists
    const existing = await Category.findOne({ name });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ------------------------------------
// Get All Categories
// GET /api/category/list
// ------------------------------------
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
