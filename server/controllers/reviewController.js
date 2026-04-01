import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("user", "name")
            .sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const user = req.user._id;

        if (!comment) return res.json({ success: false, message: "Comment is required." });

        await Review.create({ user, rating, comment });
        res.json({ success: true, message: "Review added successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};