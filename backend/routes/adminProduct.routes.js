import express from "express";
import Product from "../models/Product.model.js"; // Adjust path if needed
import { protectRoute, admin } from "../middleware/auth.middleware.js"; // Adjust path if needed

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get("/", protectRoute, admin, async (req, res) => {
  try {
    
    const products = await Product.find({})
      .sort({ createdAt: -1 }) 
      .select("-__v");

    res.json(products);
  } catch (error) {
    console.log("Error in get products admin controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
