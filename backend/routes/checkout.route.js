import express from "express";
import Checkout from "../models/Checkout.js"; 
import Cart from "../models/Cart.js"
import Product from "../models/Product.js"; 
import protectRoute from "../middleware/protectRoute.js"; 

const router = express.Router();

// POST /checkouts - Create a new checkout from user's cart
router.post("/", protectRoute, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    
    const checkoutItems = cart.products.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price, 
      size: item.size, 
      color: item.color, 
    }));


    for (const item of checkoutItems) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const variant = product.variants.id(item.variantId);
      if (!variant || variant.countInStock < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock for item" });
      }

    
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.countInStock": -item.quantity } }
      );
    }

    
    const newCheckout = new Checkout({
      user: userId,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice: cart.totalPrice, 
    });

    const savedCheckout = await newCheckout.save();


    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(savedCheckout);
  } catch (error) {
    console.log("Error in create checkout controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET /checkouts - Get all checkouts for the authenticated user
router.get("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const checkouts = await Checkout.find({ user: userId })
      .sort({ createdAt: -1 }) 
      .populate({
        path: "checkoutItems.productId",
        select: "name images", 
      });

    res.json(checkouts);
  } catch (error) {
    console.log("Error in get checkouts controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET /checkouts/:id - Get a single checkout by ID (for the authenticated user)
router.get("/:id", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const checkout = await Checkout.findOne({
      _id: req.params.id,
      user: userId,
    }).populate({
      path: "checkoutItems.productId",
      select: "name images",
    });

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    res.json(checkout);
  } catch (error) {
    console.log("Error in get single checkout controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

// PUT /checkouts/:id - Update a checkout (e.g., mark as paid after payment confirmation)
router.put("/:id", protectRoute, async (req, res) => {
  try {
    const { paymentStatus, paymentDetails, isPaid } = req.body; 
    const userId = req.user._id;

    const checkout = await Checkout.findOne({
      _id: req.params.id,
      user: userId,
    });
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    
    if (paymentStatus) checkout.paymentStatus = paymentStatus;
    if (paymentDetails) checkout.paymentDetails = paymentDetails;
    if (isPaid !== undefined) {
      checkout.isPaid = isPaid;
      if (isPaid) checkout.paidAt = new Date();
    }


    if (req.body.isFinalized) {
      checkout.isFinalized = true;
      checkout.finalizedAt = new Date();
    }

    const updatedCheckout = await checkout.save(); 

    res.json(updatedCheckout);
  } catch (error) {
    console.log("Error in update checkout controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /checkouts/:id - Delete a checkout (e.g., cancel unfinished order and restore stock)
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const checkout = await Checkout.findOne({
      _id: req.params.id,
      user: userId,
    });
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Restore stock for each item
    for (const item of checkout.checkoutItems) {
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.countInStock": item.quantity } } 
      );
    }

    await checkout.deleteOne(); 

    res.json({ message: "Checkout deleted and stock restored" });
  } catch (error) {
    console.log("Error in delete checkout controller", error.message);
    res.status(500).json({ message: error.message });
  }
});
