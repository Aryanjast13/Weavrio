import express from "express";
import { admin, protectRoute } from "../middleware/auth.middleware.js";
import Order from "../models/order.model.js";

const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all orders (admin only)
// @access Private/Admin
router.get("/", protectRoute, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 }) 
      .populate("user", "name email") 
      .populate({
        path: "orderItems.productId",
        select: "name images price", 
      });

    res.json(orders);
  } catch (error) {
    console.log("Error in get orders admin controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/admin/orders/:id
// @desc Update order status (admin only)
// @access Private/Admin
router.put("/:id", protectRoute, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name"); 

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

   
    const newStatus = req.body.status || order.status;
    order.status = newStatus;

    if (newStatus === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else if (newStatus === "Cancelled" && order.isDelivered) {
      return res
        .status(400)
        .json({ message: "Cannot cancel a delivered order" });
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.log("Error in update order admin controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order and restore stock (admin only)
// @access Private/Admin
router.delete("/:id", protectRoute, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.isDelivered) {
      return res
        .status(400)
        .json({ message: "Cannot delete a delivered order" });
    }

    // Restore stock for each item
    for (const item of order.orderItems) {
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.countInStock": item.quantity } } 
      );
    }

    await order.deleteOne();

    res.json({ message: "Order deleted and stock restored" });
  } catch (error) {
    console.log("Error in delete order admin controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
