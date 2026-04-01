import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CHECK ROOM AVAILABILITY
export const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      status: { $in: ["pending", "confirmed"] },
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) }
    });
    return bookings.length === 0;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// API: CHECK AVAILABILITY
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// CREATE BOOKING (Pay at Hotel)
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const userId = req.user._id;

    if (!room || !checkInDate || !checkOutDate) {
      return res.json({ success: false, message: "Missing required fields." });
    }

    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available for selected dates." });
    }

    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) return res.json({ success: false, message: "Room not found." });
    if (!roomData.isAvailable) return res.json({ success: false, message: "Room currently unavailable." });

    const checkin  = new Date(checkInDate);
    const checkout = new Date(checkOutDate);
    checkin.setHours(0, 0, 0, 0);
    checkout.setHours(0, 0, 0, 0);

    const nights = (checkout - checkin) / (1000 * 60 * 60 * 24);
    if (nights <= 0) return res.json({ success: false, message: "Invalid booking dates." });

    const totalPrice = nights * roomData.pricePerNight;

    await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      checkInDate: checkin,
      checkOutDate: checkout,
      guests: guests || 1,
      totalPrice,
      status: "confirmed",
      paymentMethod: "Pay At Hotel",
      isPaid: false
    });

    res.json({ success: true, message: "Booking created successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// CREATE STRIPE SESSION
export const createStripeSession = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const userId = req.user._id;

    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available for selected dates." });
    }

    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) return res.json({ success: false, message: "Room not found." });

    const checkin  = new Date(checkInDate);
    const checkout = new Date(checkOutDate);
    checkin.setHours(0, 0, 0, 0);
    checkout.setHours(0, 0, 0, 0);

    const nights = (checkout - checkin) / (1000 * 60 * 60 * 24);
    if (nights <= 0) return res.json({ success: false, message: "Invalid dates." });

    const totalPrice = nights * roomData.pricePerNight;

    // Create booking first with pending status
    const booking = await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      checkInDate: checkin,
      checkOutDate: checkout,
      guests: guests || 1,
      totalPrice,
      status: "pending",
      paymentMethod: "Stripe",
      isPaid: false
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: `${roomData.hotel.name} - ${roomData.roomType}`,
            description: `Check-in: ${checkin.toDateString()} | Check-out: ${checkout.toDateString()} | ${nights} night(s)`,
            images: roomData.images?.length ? [roomData.images[0]] : []
          },
          unit_amount: Math.round(totalPrice * 100), // paise
        },
        quantity: 1
      }],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/my-bookings?payment=success&bookingId=${booking._id}`,
      cancel_url:  `${process.env.CLIENT_URL}/rooms/${room}?payment=cancelled`,
      metadata: { bookingId: booking._id.toString() }
    });

    res.json({ success: true, sessionUrl: session.url });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// VERIFY STRIPE PAYMENT
export const verifyStripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.json({ success: false, message: "Booking not found." });

    booking.isPaid   = true;
    booking.status   = "confirmed";
    await booking.save();

    res.json({ success: true, message: "Payment verified successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// OWNER DASHBOARD BOOKINGS
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) return res.json({ success: false, message: "No hotel found." });

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue  = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
