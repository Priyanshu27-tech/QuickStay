import express from "express";
import { getReviews, addReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

reviewRouter.get("/", getReviews);
reviewRouter.post("/", protect, addReview);

export default reviewRouter;