import express from "express";
import { protect, isOwner } from "../middleware/authMiddleware.js";
import {
    checkAvailabilityAPI,
    createBooking,
    getUserBookings,
    getHotelBookings
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityAPI);
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, isOwner, getHotelBookings);

export default bookingRouter;
