import express from "express";
import Order from "../models/order.model.js";
import { protectRoute,admin } from "../middleware/auth.middleware";


const router = express.Router();
//@route GET /api/admin/orders
//@desc Get all order (admin only)
//@acccess Private/Admin

router.get("/", protectRoute, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        res.json(orders);
    } catch (error) {
        console.log("Error in get orders in admin controller", error.message);
        res.status(500).json({ message: error.message });
    }
});

//@route PUT /api/admin/orders/:id
//@desc Update order status
//@access Private/Admin

router.put("/:id", protectRoute, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" })
        }
    } catch (error) {
        console.log("Error in update ordr")
    }
});

router.delete("/:id", protectRoute, admin, async(req, res) =>{
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Order removed" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.log("Error in  delete order in admin controller", error.message);
        res.status(500).json({ message: error.message });
    }
})
export default router;