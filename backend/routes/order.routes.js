import express from "express";
import Order from "../models/order.model.js"; // Adjust path if needed
import { protectRoute } from "../middleware/auth.middleware.js"; // Adjust path if needed

const router = express.Router();

// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
router.get("/my-orders", protectRoute, async (req, res) => {
  try {
 
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "orderItems.productId", 
        select: "name images price",
      })
      .populate("user", "name email"); 

    res.json(orders);
  } catch (error) {
    console.log("Error in get my orders controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/orders/:id
// @desc Get order detail by ID (for the authenticated user)
// @access Private
router.get("/:id", protectRoute, async (req, res) => {
  try {
   
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate({
        path: "orderItems.productId",
        select: "name images price", 
      })
      .populate("user", "name email"); 

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

   
    res.json(order);
  } catch (error) {
    console.log("Error in get single order detail controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
