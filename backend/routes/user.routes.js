import express from "express";
import jwt from "jsonwebtoken";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/User.model.js";

const router = express.Router();

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 2* 24 * 60 * 60 * 1000,
    });

   
    return { accessToken };
}

const setCookies = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 2* 24 * 60 * 60 * 1000, //7days
    });
}

router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }
    const user = await  User.create({ name, email, password });
   

    const { accessToken} = generateTokens(user._id);

    setCookies(res, accessToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    } catch (error) {
        console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try { 
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken} = generateTokens(user._id);
      
        setCookies(res, accessToken);
      
      res.json({
        _id: user._id,
        name:user.name,
        email: user.email,
        role:user.role,  
      })
        return;
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }

    } catch (error) {
        console.log("Error in login credtinals", error.message);
    res.status(500).json({ message: error.message });
    }
})

router.get("/profile",protectRoute ,async (req, res) => {
    res.json(req.user);
})



export default router;