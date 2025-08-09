import express from "express"
import Product from "../models/Product.model.js"
import { protectRoute, admin } from "../middleware/auth.middleware"


const router = express.Router();
//@route GET /api/admin/products
//@desc Get  all products (Admin only)
//@access  Private/Admin
router.get("/", protectRoute, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.log("Error in get product in admin controller", error.message);
        res.status(500).json({ message: error.message });
    }
})

export default router;