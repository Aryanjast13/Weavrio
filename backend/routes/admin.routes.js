import express from "express";
import User from "../models/User.model.js";
import { protectRoute,admin } from "../middleware/auth.middleware.js";


const router = express.Router();
//@route GET /api/admin/users
//@desc Get all users (Admin only)
//@access Private/Admin

router.get("/", protectRoute, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log("Error in get users in admin controller", error.message);
        res.status(500).json({ message: error.message });
    }
});



//@route POST /api/admin/users
//@desc Add a new user (admin only);
//@access Private/Admin

router.post("/", protectRoute, admin, async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({
            name,
            email,
            password,
            role: role || "customer",
        })
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.log("Error in create admin users", error.message);
        res.status(500).json({ message: error.message });
    }
});

//@route PUT /api/admin/users/:id
//@desc Update user info (admin only) - Name ,email and role
//@access  Private Admin

router.put("/:id", protectRoute, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email
            user.role = req.body.role || user.role
        }
        const updatedUser = await user.save();
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log("Error in updated admin users ", error.message);
        res.status(500).json({ message: error.message });
    }
});

//@route DELETE /api/admin/users/:id
//@desc Delete a user
//@access Private/Admin
router.delete("/:id", protectRoute, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne()
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({message:"User not found"})
        }
    } catch (error) {
        console.log("Error in delete admin controller", error.message);
        res.status(500).json({ message: error.message });
        
    }
})
export default router;