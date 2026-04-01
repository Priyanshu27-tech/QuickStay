import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const userRouter = express.Router();

// Become a hotel owner
userRouter.patch("/become-owner", protect, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { role: "hotelOwner" },
            { new: true }
        ).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Save recent searched city
userRouter.patch("/recent-searches", protect, async (req, res) => {
    try {
        const { city } = req.body;
        const user = await User.findById(req.user._id);
        user.recentSearchedCities = [
            city,
            ...user.recentSearchedCities.filter(c => c !== city)
        ].slice(0, 5);
        await user.save();
        res.json({ success: true, recentSearchedCities: user.recentSearchedCities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default userRouter;
