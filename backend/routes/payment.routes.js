
import dotenv from "dotenv";
import express from "express";
import Razorpay from "razorpay";
import { protectRoute } from "../middleware/auth.middleware";

dotenv.config();

const router = express.Router();

// Create Razorpay Order
router.post("/create-order",protectRoute, async (req, res) => {
  try {
    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ 
        error: "Razorpay credentials not configured" 
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const { amount, currency = "INR", receipt, notes = {} } = req.body;

    // Validate required fields
    if (!amount || !receipt) {
      return res.status(400).json({ 
        error: "Amount and receipt are required" 
      });
    }

    // Validate amount (minimum 1 INR = 100 paise)
    if (amount < 100) {
      return res.status(400).json({ 
        error: "Amount should be at least ₹1 (100 paise)" 
      });
    }

    const orderData = {
      amount: amount, // Amount in paise
      currency: currency,
      receipt: receipt,
      notes: {
        ...notes,
        created_via: "ecommerce_backend",
        timestamp: new Date().toISOString()
      }
    };

    const order = await instance.orders.create(orderData);

    res.status(201).json({
      success: true,
      order: order,
      key_id: process.env.RAZORPAY_KEY_ID // Send key_id to frontend
    });

  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order",
      message: error.message
    });
  }
});

// Verify Payment
router.post("/verify-payment", protectRoute,async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
   console.log(req.body)
    const crypto = require('crypto');
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is valid - update your order status
      res.json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      error: "Payment verification failed"
    });
  }
});

export default router;
