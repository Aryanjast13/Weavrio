import express from "express";
import Order from "../models/order.model.js"
import { protectRoute } from "../middleware/auth.middleware.js"


const router = express.Router();


//@route GET /api/orders/ny-orders
//@desc Get logged-in user's orders
//@access Private
router.get("/my-orders", protectRoute, async (req, res) => {
    try {
        //Find orders for the authenticated user
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 }); //sort by most recent orders
        res.json(orders);
    } catch (error) {
        console.log("Error in get orders controller", error.message);
    }
})

//@route GET /api/orders/:id
//desc get order detail by ID
//@access Private
router.get("/:id", protectRoute, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (!order) {
            return res.status(400).json({ message: "Order not found" });
        }
        
        //Return the full order details
        res.json(order);
    } catch (error) {
        console.log("Error in get single order detail controller",error.message)
        res.status(500).json({ message: error.message });
    }
})

export default router;