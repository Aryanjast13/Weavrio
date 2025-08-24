import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import Cart from "../models/Cart.model.js";
import Checkout from "../models/checkout.model.js";
import Order from "../models/order.model.js";

const router = express.Router();

// POST /checkouts - Create a new checkout from user's cart
router.post("/", protectRoute, async (req, res) => {
  try {
    const {checkoutItems, shippingAddress, paymentMethod,totalPrice } = req.body;
    const userId = req.user._id;

     if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "no items in checkout" });
    }


    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

  
    
    const newCheckout = new Checkout({
      user: userId,
      checkoutItems:checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice, 
      paymentStatus: "Pending",
      isPaid: false,
    });

    const savedCheckout = await newCheckout.save();


    res.status(201).json(savedCheckout);
  } catch (error) {
    console.log("Error in create checkout controller", error.message);
    res.status(500).json({ message: error.message });
  }
});


// PUT /checkouts/:id - Update a checkout (e.g., mark as paid after payment confirmation)
router.put("/:id/pay", protectRoute, async (req, res) => {
  try {
    const { paymentStatus, paymentDetails} = req.body; 
    const userId = req.user._id;

    const checkout = await Checkout.findOne({
      _id: req.params.id,
      user: userId,
    });
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

      if (paymentStatus === "paid") {
        checkout.isPaid = true;
        checkout.paymentStatus = paymentStatus;
        checkout.paymentDetails = paymentDetails;
        checkout.paidAt = Date.now();

        await checkout.save();
        res.status(200).json(checkout);
      } else {
        res.status(400).json({ message: "Invalid Payment Status" });
      }
  } catch (error) {
    console.log("Error in update checkout controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

//@route POST /api/checkout/:id/finalize
//@desc Finalize checkout and convert to an order after payment confirmation 
//@access Private
router.post("/:id/finalize", protectRoute, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }
        if (checkout.isPaid && !checkout.isFinalized) {
            //create a final order based on the checkout details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus:"paid",
                paymentDetails: checkout.paymentDetails,
            });
            // Mark the checkout as finalized
            checkout.isFinalized = true;
            checkout.finalized = Date.now();
            await checkout.save();
            //Delete the cart associated with the user
            await Cart.findOneAndDelete({ user: checkout.user });
            res.status(201).json(finalOrder);
        } else if (checkout.isFinalized) {
            res.status(400).json({ message: "Checkout already finalized" });
        } else {
            res.status(400).json({ message: "Checkout is not paid" });
        }
    } catch (error) {
        console.log("Error in finlize checkout controller", error.message);
        res.status(500).json({ message: error.message });
    }
})



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

    await checkout.deleteOne(); 

    res.json({ message: "Checkout deleted and stock restored" });
  } catch (error) {
    console.log("Error in delete checkout controller", error.message);
    res.status(500).json({ message: error.message });
  }
});


export default router;