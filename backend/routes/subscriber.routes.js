import express from "express";
import Subscriber from "../models/Subscriber.model";

const router = express.Router();

//@route POST /api/subscribe
//@desc Handle newsletter subscription
//@access  Public
router.post("/subscribe", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        //check email is already subscribed
        let subscriber = await Subscriber.findOne({ email });
        console.log(subscriber);

        if (subscriber) {
            return res.status(400).json({ message: "email is already subscribed" });
        }
        
        //create a new subscriber
        subscriber = new Subscriber({ email });
        await subscriber.save();
        res.status(201).json({ message: "Successfully subscribed the newsletter!" });
    } catch (error) {
        console.log("Error in subscriber controller", error.message);
        res.status(500).json({ message: error.message });
    }
})

export default router;