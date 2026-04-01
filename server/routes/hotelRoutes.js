import express from "express";
import { protect, isOwner } from "../middleware/authMiddleware.js";
import { registerHotel, getOwnerHotel, getAllHotels } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.get("/", getAllHotels);
hotelRouter.post("/register", protect, registerHotel);
hotelRouter.get("/owner", protect, isOwner, getOwnerHotel);

export default hotelRouter;
