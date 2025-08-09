import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import Cart from "../models/Cart.model.js";
import Checkout from "../models/checkout.model.js";
import Order from "../models/order.model.js";


const router = express.Router();

//@route POST /api/checkout
//@desc Create a new checkout session
//@access Private
router.post("/",protectRoute ,async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice
    } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "no items in checkout" });
    }

    try {
        //create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        });
        console.log(`Checkout created for user: ${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.log("Error in Creating checkout:", error);
        res.status(500).json({ message: error.message });
    }
});



//@route  PUT /api/checkout/:id/pay
//@desc update checkout to mark as paid  after sucessull payment
//@access private
router.put("/:id/pay", protectRoute, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(400).json({ message: "Checkout not found" });
        }
        
        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();

            await checkout.save();
            res.status(200).json(checkout);
        }
        else {
            res.status(400).json({ message: "Invalid Payment Status" });
        }
    } catch (error) {
        console.log("Error in pay controller", error.message);
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


export default router;