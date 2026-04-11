import express from "express";
import { protect, isOwner } from "../middleware/authMiddleware.js";
import {
    checkAvailabilityAPI,
    createBooking,
    getUserBookings,
    getHotelBookings,
    createStripeSession,
    stripeSessionForExistingBooking,
    verifyStripePayment
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityAPI);
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/hotel", protect, isOwner, getHotelBookings);
bookingRouter.post("/stripe-session", protect, createStripeSession);
bookingRouter.post("/stripe-session-existing", protect, stripeSessionForExistingBooking);
bookingRouter.post("/verify-stripe", protect, verifyStripePayment);

export default bookingRouter;
